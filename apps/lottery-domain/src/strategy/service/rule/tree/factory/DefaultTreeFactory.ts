import {RuleLogicCheckTypeVO, RuleLogicCheckTypeVOEnum} from "../../../../model/valobj/RuleLogicCheckTypeVO";
import {ILogicTreeNode} from "../ILogicTreeNode";
import {Injectable} from "@nestjs/common";
import {RuleTreeVO} from "../../../../model/valobj/RuleTreeVO";
import {IDecisionTreeEngine} from "./engine/IDecisionTreeEngine";
import {DecisionTreeEngine} from "./engine/DecisionTreeEngine";
import {
    StrategyRepository
} from "../../../../../../../lottery-infrastructure/src/persistent/repository/StrategyRepository";


@Injectable()
export class DefaultTreeFactory {


    logicTreeNodeGroup: Map<string, ILogicTreeNode> = new Map();

    constructor(
        private readonly repository:StrategyRepository,
    ) {
    }


    openLogicTree( ruleTreeVO:RuleTreeVO):IDecisionTreeEngine{
        return new DecisionTreeEngine(this.logicTreeNodeGroup,ruleTreeVO,this.repository);
    }

    register(nodeName:string,node:ILogicTreeNode){
        this.logicTreeNodeGroup.set(nodeName,node);
    }

}

export class TreeActionEntity{
    ruleLogicCheckType:RuleLogicCheckTypeVOEnum;
    strategyAwardVO:TreeStrategyAwardVO;
    nodeDesc:string;
}

export class TreeStrategyAwardVO {
    /** 抽奖奖品ID - 内部流转使用 */
    awardId:number;
    /** 抽奖奖品规则 */
    awardRuleValue:string;
}
