import {ILogicChain} from "../ILogicChain";
import {Injectable} from "@nestjs/common";
import { DefaultChainFactory, LogicModel, StrategyAwardVO } from '../factory/DefaultChainFactory';
import {AbstractLogicChain} from "../AbstractLogicChain";
import {StrategyArmoryDispatch} from "../../../armory/StrategyArmoryDispatch";
import {RaffleFactorEntity} from "../../../../model/entity/RaffleFactorEntity";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {RuleLogicCheckTypeVO} from "../../../../model/valobj/RuleLogicCheckTypeVO";



@Injectable()
export class DefaultLogicChain extends AbstractLogicChain{

    constructor(
        private readonly strategyDispatch:StrategyArmoryDispatch,
        private readonly defaultChainFactory:DefaultChainFactory,
        public readonly repository:StrategyRepository,

    ) {
        super(defaultChainFactory,repository);
    }

    async doLogic(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> {
        let strategyId = raffleFactorEntity.strategyId
        let userId = raffleFactorEntity.userId

       const awardId:number = await this.strategyDispatch.getRandomAwardId(strategyId);
        console.info(`抽奖责任链-默认处理 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()} awardId: ${awardId}`);

        const strategyAwardVO = new StrategyAwardVO();
        strategyAwardVO.awardId = awardId;
        strategyAwardVO.nodeDesc ="默认Logic节点，进行抽奖，奖品id:"+awardId
        strategyAwardVO.processResult = RuleLogicCheckTypeVO.ALLOW;
        strategyAwardVO.logicModel = this.ruleModel();
        return strategyAwardVO;
    }

    public ruleModel(): string {
        return LogicModel.RULE_DEFAULT.code;
    }

}