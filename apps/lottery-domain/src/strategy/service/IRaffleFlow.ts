import {RuleTreeVO} from "../model/valobj/RuleTreeVO";
import {StrategyRuleEntity} from "../model/entity/StrategyRuleEntity";
import {StrategyEntity} from "../model/entity/StrategyEntity";

class StrategyFlowRecordEntity {
}

export interface IRaffleFlow{

    queryRuleTree(treeId: string): Promise<RuleTreeVO>;

    // 查询策略的规则
    queryStrategyRuleList(strategyId: number): Promise<StrategyRuleEntity[]>;

    // 查询抽奖流程记录
    queryStrategyFlowRecordList(orderId: string): Promise<StrategyFlowRecordEntity[]>;

    queryStrategyByStrategyId(strategyId: number): Promise<StrategyEntity>;

}