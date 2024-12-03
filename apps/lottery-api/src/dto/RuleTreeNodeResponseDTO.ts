import {RuleTreeNodeLineResponseDTO} from "./RuleTreeNodeLineResponseDTO";


export class RuleTreeNodeResponseDTO{
    treeId: string;
    ruleKey: string;
    ruleDesc: string;
    ruleValue: string;
    treeNodeLineList: RuleTreeNodeLineResponseDTO[];
}