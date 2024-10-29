import {RuleLogicCheckTypeVO, RuleLogicCheckTypeVOEnum} from "../../../../model/valobj/RuleLogicCheckTypeVO";
import {ILogicTreeNode} from "../ILogicTreeNode";
import {Injectable} from "@nestjs/common";
import {RuleTreeVO} from "../../../../model/valobj/RuleTreeVO";
import {IDecisionTreeEngine} from "./engine/IDecisionTreeEngine";
import {DecisionTreeEngine} from "./engine/DecisionTreeEngine";


@Injectable()
export class DefaultTreeFactory {


    logicTreeNodeGroup: Map<string, ILogicTreeNode> = new Map();

    openLogicTree( ruleTreeVO:RuleTreeVO):IDecisionTreeEngine{
        return new DecisionTreeEngine(this.logicTreeNodeGroup,ruleTreeVO);
    }

    register(nodeName:string,node:ILogicTreeNode){
        this.logicTreeNodeGroup.set(nodeName,node);
    }

}

export class TreeActionEntity{
    ruleLogicCheckType:RuleLogicCheckTypeVOEnum;
    strategyAwardVO:TreeStrategyAwardVO;
}

export class TreeStrategyAwardVO {
    /** 抽奖奖品ID - 内部流转使用 */
    awardId:number;
    /** 抽奖奖品规则 */
    awardRuleValue:string;
}
