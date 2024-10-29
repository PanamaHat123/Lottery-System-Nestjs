import {RuleTreeNodeVO} from "./RuleTreeNodeVO";


export class RuleTreeVO {

    /** 规则树ID */
    treeId:string;
    /** 规则树名称 */
    treeName:string;
    /** 规则树描述 */
    treeDesc:string;
    /** 规则根节点 */
    treeRootRuleNode:string;
    /** 规则节点 */
    treeNodeMap:Map<string, RuleTreeNodeVO>;
}