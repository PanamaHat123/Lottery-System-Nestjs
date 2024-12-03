import {RuleTreeNodeResponseDTO} from "./RuleTreeNodeResponseDTO";


export class RuleTreeResponseDTO{
    treeId: string;
    treeName: string;
    treeDesc: string;
    treeRootRuleNode: string;
    treeNodeMap: Map<string, RuleTreeNodeResponseDTO>;

}