import {RuleTreeNodeLineVO} from "./RuleTreeNodeLineVO";


export class RuleTreeNodeVO {
    /** 规则树ID */
    treeId:string;
    /** 规则Key */
    ruleKey:string;
    /** 规则描述 */
    ruleDesc:string;
    /** 规则比值 */
    ruleValue:string;
    /** 规则连线 */
    treeNodeLineVOList:RuleTreeNodeLineVO[];

}