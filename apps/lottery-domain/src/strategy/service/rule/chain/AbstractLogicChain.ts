import {ILogicChain} from "./ILogicChain";
import {DefaultChainFactory, StrategyAwardVO} from "./factory/DefaultChainFactory";
import {RaffleFactorEntity} from "../../../model/entity/RaffleFactorEntity";
import {RuleLogicCheckTypeVO} from "../../../model/valobj/RuleLogicCheckTypeVO";
import {StrategyFlowRecordEntity} from "../../../model/entity/StrategyFlowRecordEntity";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";


export abstract class AbstractLogicChain implements ILogicChain {

    private nextChain:ILogicChain;
    private prevChain:ILogicChain;
    public repository:StrategyRepository;

    protected constructor(defaultChainFactory:DefaultChainFactory,repository:StrategyRepository) {
       defaultChainFactory.register(this.ruleModel(),this);
       this.repository = repository;
    }

    async logic(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> {
       const strategyAwardVO = await this.doLogic(raffleFactorEntity);
       await this.record(raffleFactorEntity,strategyAwardVO);
       if(strategyAwardVO.processResult!= RuleLogicCheckTypeVO.TAKE_OVER && this.next()!=null){
           return this.next().logic(raffleFactorEntity);
       }
       return strategyAwardVO;
    }

    async record(raffleFactorEntity: RaffleFactorEntity, strategyAwardVO: StrategyAwardVO): Promise<void> {
        //记录流程  TODO 改为mq 提升效率
        const strategyFlowRecordEntity = new StrategyFlowRecordEntity();
        strategyFlowRecordEntity.strategyId = raffleFactorEntity.strategyId;
        strategyFlowRecordEntity.userId = raffleFactorEntity.userId;
        strategyFlowRecordEntity.orderId = raffleFactorEntity.orderId;
        strategyFlowRecordEntity.currentNode = this.ruleModel();
        strategyFlowRecordEntity.processType = "chain";
        strategyFlowRecordEntity.head = this.prev() == null?1:0;
        if(null != this.next()){
            strategyFlowRecordEntity.nextNode = this.next().ruleModel();
        }
        strategyFlowRecordEntity.nodeDesc =strategyAwardVO.nodeDesc ;
        strategyFlowRecordEntity.chainProcessResult = strategyAwardVO.processResult
        strategyFlowRecordEntity.awardId = strategyAwardVO.awardId
        await this.repository.saveStrategyFlowRecord(strategyFlowRecordEntity);
    }


    public appendNext(next:ILogicChain):ILogicChain {
        this.nextChain = next;
        return next;
    }

    public next():ILogicChain {
        return this.nextChain;
    }

    public appendPrev(prev:ILogicChain):ILogicChain {
        this.prevChain = prev;
        return prev;
    }

    public prev():ILogicChain {
        return this.prevChain;
    }

    abstract doLogic(raffleFactorEntity:RaffleFactorEntity) : Promise<StrategyAwardVO>;

    public abstract ruleModel():string;

}