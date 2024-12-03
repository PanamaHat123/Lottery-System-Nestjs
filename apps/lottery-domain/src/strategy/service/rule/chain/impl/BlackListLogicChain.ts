import {AbstractLogicChain} from "../AbstractLogicChain";
import { DefaultChainFactory, LogicModel, StrategyAwardVO } from '../factory/DefaultChainFactory';
import {Injectable} from "@nestjs/common";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {AppConstants} from "apps/lottery-types/src/common/AppConstants";
import {StrategyFlowRecordEntity} from "../../../../model/entity/StrategyFlowRecordEntity";
import {RaffleFactorEntity} from "../../../../model/entity/RaffleFactorEntity";


@Injectable()
export class BlackListLogicChain extends AbstractLogicChain{

    constructor(
        private readonly repository:StrategyRepository,
        private readonly defaultChainFactory:DefaultChainFactory,
    ) {
        super(defaultChainFactory);
    }

    async logic(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> {
        let strategyId = raffleFactorEntity.strategyId;
        let userId = raffleFactorEntity.userId;
        let orderId = raffleFactorEntity.orderId;
        console.info(`抽奖责任链-黑名单开始 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()}`);
        const ruleValue = await this.repository.queryStrategyRuleValue(strategyId, this.ruleModel());
        const splitRuleValue:string[]  = ruleValue.split(AppConstants.COLON);
        const awardId:number = +splitRuleValue[0]

        //记录流程
        const strategyFlowRecordEntity = new StrategyFlowRecordEntity();
        strategyFlowRecordEntity.strategyId = strategyId;
        strategyFlowRecordEntity.userId = userId;
        strategyFlowRecordEntity.orderId = orderId;
        strategyFlowRecordEntity.currentNode = this.ruleModel();
        strategyFlowRecordEntity.processType = "chain";
        strategyFlowRecordEntity.head = this.prev() == null?1:0;

        if(null != this.next()){
            strategyFlowRecordEntity.nextNode = this.next().ruleModel();
        }
        //100:user001,user002,user003
        // 过滤其他规则
        const userBlackIds:string[] = splitRuleValue[1].split(AppConstants.SPLIT);
        for (let userBlackId of userBlackIds) {
            if (userId == userBlackId) {
                console.info(`抽奖责任链-黑名单接管 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()} awardId:${awardId}`);

                strategyFlowRecordEntity.nodeDesc = "黑名单接管,userId:" + userId + "";
                strategyFlowRecordEntity.chainProcessResult = "TAKE_OVER"
                strategyFlowRecordEntity.awardId = awardId

                await this.repository.saveStrategyFlowRecord(strategyFlowRecordEntity);

                const strategyAwardVO = new StrategyAwardVO()
                strategyAwardVO.awardId = awardId;
                strategyAwardVO.logicModel =  this.ruleModel();
                return strategyAwardVO;
            }
        }
        // 过滤其他责任链
        console.info(`抽奖责任链-黑名单放行 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()}`);

        strategyFlowRecordEntity.nodeDesc = "黑名单放行,userId:" + userId + "";
        strategyFlowRecordEntity.chainProcessResult = "ALLOW"
        await this.repository.saveStrategyFlowRecord(strategyFlowRecordEntity);
        return this.next().logic(raffleFactorEntity);
    }

    public ruleModel(): string {
        return  LogicModel.RULE_BLACKLIST.code;
    }


}