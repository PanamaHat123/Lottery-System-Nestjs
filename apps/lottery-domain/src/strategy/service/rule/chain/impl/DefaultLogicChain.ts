import {ILogicChain} from "../ILogicChain";
import {Injectable} from "@nestjs/common";
import { DefaultChainFactory, LogicModel, StrategyAwardVO } from '../factory/DefaultChainFactory';
import {AbstractLogicChain} from "../AbstractLogicChain";
import {StrategyArmoryDispatch} from "../../../armory/StrategyArmoryDispatch";


@Injectable()
export class DefaultLogicChain extends AbstractLogicChain{

    constructor(
        private readonly strategyDispatch:StrategyArmoryDispatch,
        private readonly defaultChainFactory:DefaultChainFactory,
    ) {
        super(defaultChainFactory);
    }

    async logic(userId: string, strategyId: number): Promise<StrategyAwardVO> {
       const awardId:number = await this.strategyDispatch.getRandomAwardId(strategyId);
        console.info(`抽奖责任链-默认处理 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()} awardId: ${awardId}`);
        const strategyAwardVO = new StrategyAwardVO();
        strategyAwardVO.awardId = awardId;
        strategyAwardVO.logicModel = this.ruleModel();
        return strategyAwardVO;
    }

    protected ruleModel(): string {
        return LogicModel.RULE_DEFAULT.code;
    }

}