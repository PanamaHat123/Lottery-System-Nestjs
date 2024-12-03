import {AbstractRaffleStrategy} from "../AbstractRaffleStrategy";
import {Injectable} from "@nestjs/common";
import {DefaultChainFactory, StrategyAwardVO} from "../rule/chain/factory/DefaultChainFactory";
import {StrategyRepository} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {StrategyArmoryDispatch} from "../armory/StrategyArmoryDispatch";
import {ILogicChain} from "../rule/chain/ILogicChain";
import {DefaultTreeFactory, TreeStrategyAwardVO} from "../rule/tree/factory/DefaultTreeFactory";
import {StrategyAwardRuleModelVO} from "../../model/valobj/StrategyAwardRuleModelVO";
import {RuleTreeVO} from "../../model/valobj/RuleTreeVO";
import {IDecisionTreeEngine} from "../rule/tree/factory/engine/IDecisionTreeEngine";
import {StrategyAwardStockKeyVO} from "../../model/valobj/StrategyAwardStockKeyVO";
import {IRaffleStock} from "../IRaffleStock";
import {IRaffleAward} from "../IRaffleAward";
import {RaffleFactorEntity} from "../../model/entity/RaffleFactorEntity";



/**
 * 默认的抽奖策略实现
 */
@Injectable()
export class DefaultRaffleStrategy extends AbstractRaffleStrategy implements IRaffleAward, IRaffleStock {

    constructor(
        protected readonly repository:StrategyRepository,
        protected readonly strategyDispatch:StrategyArmoryDispatch,
        protected readonly defaultChainFactory:DefaultChainFactory,
        protected readonly defaultTreeFactory:DefaultTreeFactory,
    ) {
        super(repository,strategyDispatch,defaultChainFactory);
    }

    async raffleLogicChain(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> {
        const logicChain:ILogicChain = await this.defaultChainFactory.openLogicChain(raffleFactorEntity.strategyId);
        return logicChain.logic(raffleFactorEntity);
    }

    async raffleLogicTree(raffleFactorEntity: RaffleFactorEntity, awardId: number): Promise<TreeStrategyAwardVO> {
        const strategyAwardRuleModelVO:StrategyAwardRuleModelVO = await this.repository.queryStrategyAwardRuleModelVO(raffleFactorEntity.strategyId, awardId);
        //奖品没有自己的规则
        if(strategyAwardRuleModelVO == null){
            const treeStrategyAwardVO = new TreeStrategyAwardVO()
            treeStrategyAwardVO.awardId = awardId;
            return treeStrategyAwardVO;
        }
        const ruleTreeVO:RuleTreeVO = await this.repository.queryRuleTreeVOByTreeId(strategyAwardRuleModelVO.ruleModels);
        if(null == ruleTreeVO){
            throw new Error("存在抽奖策略配置的规则模型 Key，未在库表 rule_tree、rule_tree_node、rule_tree_line 配置对应的规则树信息 " + strategyAwardRuleModelVO.ruleModels);
        }
        const treeEngine :IDecisionTreeEngine= this.defaultTreeFactory.openLogicTree(ruleTreeVO);
        return treeEngine.process(raffleFactorEntity, awardId);
    }


    async takeQueueValue():Promise<StrategyAwardStockKeyVO>{

        return this.repository.takeQueueValue();
    }

    async updateStrategyAwardStock(strategyId: number, awardId: number) {
       await  this.repository.updateStrategyAwardStock(strategyId, awardId);
    }

    async queryRaffleStrategyAwardList(strategyId: any) {
        return this.repository.queryStrategyAwardList(strategyId);
    }
}