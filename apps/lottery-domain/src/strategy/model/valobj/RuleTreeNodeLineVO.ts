import {RuleLogicCheckTypeVOEnum} from "./RuleLogicCheckTypeVO";
import {RuleLimitTypeVOEnum} from "./RuleLimitTypeVO";


export class RuleTreeNodeLineVO {
    /** 规则树ID */
    treeId:string;
    /** 规则Key节点 From */
    ruleNodeFrom:string;
    /** 规则Key节点 To */
    ruleNodeTo:string;

    ruleLimitType:RuleLimitTypeVOEnum;

    ruleLimitValue:RuleLogicCheckTypeVOEnum;

}