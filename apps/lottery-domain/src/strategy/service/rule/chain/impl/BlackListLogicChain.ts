import {AbstractLogicChain} from "../AbstractLogicChain";
import { DefaultChainFactory, LogicModel, StrategyAwardVO } from '../factory/DefaultChainFactory';
import {Injectable} from "@nestjs/common";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {AppConstants} from "apps/lottery-types/src/common/AppConstants";


@Injectable()
export class BlackListLogicChain extends AbstractLogicChain{

    constructor(
        private readonly repository:StrategyRepository,
        private readonly defaultChainFactory:DefaultChainFactory,
    ) {
        super(defaultChainFactory);
    }

    async logic(userId: string, strategyId: number): Promise<StrategyAwardVO> {
        console.info(`抽奖责任链-黑名单开始 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()}`);
        const ruleValue = await this.repository.queryStrategyRuleValue(strategyId, this.ruleModel());
        const splitRuleValue:string[]  = ruleValue.split(AppConstants.COLON);
        const awardId:number = +splitRuleValue[0]

        //100:user001,user002,user003
        // 过滤其他规则
        const userBlackIds:string[] = splitRuleValue[1].split(AppConstants.SPLIT);
        for (let userBlackId of userBlackIds) {
            if (userId == userBlackId) {
                console.info(`抽奖责任链-黑名单接管 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()} awardId:${awardId}`);
                const strategyAwardVO = new StrategyAwardVO()
                strategyAwardVO.awardId = awardId;
                strategyAwardVO.logicModel =  this.ruleModel();
                return strategyAwardVO;
            }
        }
        // 过滤其他责任链
        console.info(`抽奖责任链-黑名单放行 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()}`);
        return this.next().logic(userId,strategyId);
    }

    protected ruleModel(): string {
        return  LogicModel.RULE_BLACKLIST.code;
    }

}