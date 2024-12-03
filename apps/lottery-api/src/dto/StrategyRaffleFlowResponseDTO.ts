/**
 * 策略流程
 */
import {StrategyRaffleFlowRecordDTO} from "./StrategyRaffleFlowRecordDTO";
import {RuleTreeResponseDTO} from "./RuleTreeResponseDTO";
import {StrategyRuleDTO} from "./StrategyRuleDTO";

export class StrategyRaffleFlowResponseDTO{

    strategyRaffleFlowRecords:StrategyRaffleFlowRecordDTO[];

    tree:RuleTreeResponseDTO;

    chain:StrategyRuleDTO[];
}