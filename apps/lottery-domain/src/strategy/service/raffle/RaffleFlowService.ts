import {IRaffleFlow} from "../IRaffleFlow";
import {Injectable} from "@nestjs/common";
import {RuleTreeVO} from "../../model/valobj/RuleTreeVO";
import {StrategyEntity} from "../../model/entity/StrategyEntity";
import {StrategyFlowRecordEntity} from "../../model/entity/StrategyFlowRecordEntity";
import {StrategyRuleEntity} from "../../model/entity/StrategyRuleEntity";
import {StrategyRepository} from "../../../../../lottery-infrastructure/src/persistent/repository/StrategyRepository";


@Injectable()
export class RaffleFlowService implements IRaffleFlow{

    constructor(
        private readonly repository:StrategyRepository,
    ) {
    }


    queryRuleTree(treeId: string): Promise<RuleTreeVO> {
        return this.repository.queryRuleTreeVOByTreeId(treeId);
    }

    queryStrategyRuleList(strategyId: number): Promise<StrategyRuleEntity[]> {
        return this.repository.queryStrategyRuleList(strategyId);
    }

    queryStrategyFlowRecordList(orderId: string): Promise<StrategyFlowRecordEntity[]> {
        return this.repository.queryStrategyFlowRecordList(orderId);
    }

    queryStrategyByStrategyId(strategyId: number): Promise<StrategyEntity> {
        return this.repository.queryStrategyByStrategyId(strategyId);
    }





}