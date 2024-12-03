import {ILogicChain} from "../ILogicChain";
import {Injectable} from "@nestjs/common";
import { DefaultChainFactory, LogicModel, StrategyAwardVO } from '../factory/DefaultChainFactory';
import {AbstractLogicChain} from "../AbstractLogicChain";
import {StrategyArmoryDispatch} from "../../../armory/StrategyArmoryDispatch";
import {RaffleFactorEntity} from "../../../../model/entity/RaffleFactorEntity";
import {StrategyFlowRecordEntity} from "../../../../model/entity/StrategyFlowRecordEntity";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";



@Injectable()
export class DefaultLogicChain extends AbstractLogicChain{

    constructor(
        private readonly strategyDispatch:StrategyArmoryDispatch,
        private readonly defaultChainFactory:DefaultChainFactory,
        private readonly repository:StrategyRepository,

    ) {
        super(defaultChainFactory);
    }

    async logic(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> {
        let strategyId = raffleFactorEntity.strategyId
        let userId = raffleFactorEntity.userId
        let orderId = raffleFactorEntity.orderId

       const awardId:number = await this.strategyDispatch.getRandomAwardId(strategyId);
        console.info(`抽奖责任链-默认处理 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()} awardId: ${awardId}`);

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
        strategyFlowRecordEntity.nodeDesc = "默认Logic节点，进行抽奖，奖品id:"+awardId
        strategyFlowRecordEntity.chainProcessResult = "ALLOW";
        strategyFlowRecordEntity.awardId = awardId;
        await this.repository.saveStrategyFlowRecord(strategyFlowRecordEntity);

        const strategyAwardVO = new StrategyAwardVO();
        strategyAwardVO.awardId = awardId;
        strategyAwardVO.logicModel = this.ruleModel();
        return strategyAwardVO;
    }

    public ruleModel(): string {
        return LogicModel.RULE_DEFAULT.code;
    }

}