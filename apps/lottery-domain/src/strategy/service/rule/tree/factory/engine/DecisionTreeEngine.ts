import {IDecisionTreeEngine} from "./IDecisionTreeEngine";
import {TreeActionEntity, TreeStrategyAwardVO} from "../DefaultTreeFactory";
import {ILogicTreeNode} from "../../ILogicTreeNode";
import {RuleTreeVO} from "../../../../../model/valobj/RuleTreeVO";
import {RuleTreeNodeVO} from "../../../../../model/valobj/RuleTreeNodeVO";
import {RuleTreeNodeLineVO} from "../../../../../model/valobj/RuleTreeNodeLineVO";


export class DecisionTreeEngine implements IDecisionTreeEngine {

    private logicTreeNodeGroup: Map<string, ILogicTreeNode>;

    private ruleTreeVO: RuleTreeVO;

    constructor(logicTreeNodeGroup: Map<string, ILogicTreeNode>, ruleTreeVO: RuleTreeVO) {
        this.logicTreeNodeGroup = logicTreeNodeGroup;
        this.ruleTreeVO = ruleTreeVO;
    }


    async process(userId: string, strategyId: number, awardId: number): Promise<TreeStrategyAwardVO> {
        let strategyAwardData: TreeStrategyAwardVO = null;
        //获取基础信息
        let next: string = this.ruleTreeVO.treeRootRuleNode;
        const treeNodeMap: Map<string, RuleTreeNodeVO> = this.ruleTreeVO.treeNodeMap;
        let ruleTreeNode: RuleTreeNodeVO = treeNodeMap.get(next);
        while (null != next) {
            const logicTreeNode: ILogicTreeNode = this.logicTreeNodeGroup.get(ruleTreeNode.ruleKey);
            const ruleValue = ruleTreeNode.ruleValue;

            const logicEntity: TreeActionEntity =await logicTreeNode.logic(userId, strategyId, awardId, ruleValue);
            const ruleLogicCheckType = logicEntity.ruleLogicCheckType;
            strategyAwardData = logicEntity.strategyAwardVO;

            next = this.nextNode(ruleLogicCheckType, ruleTreeNode.treeNodeLineVOList);
            console.info(`决策树引擎【${this.ruleTreeVO.treeName}】treeId:${this.ruleTreeVO.treeId} node:${next} code:${ruleLogicCheckType}`);
            ruleTreeNode = treeNodeMap.get(next);
        }
        return strategyAwardData;
    }

    private nextNode(matterValue: string, ruleTreeNodeLineVOList: RuleTreeNodeLineVO[]): string {
        if (null == ruleTreeNodeLineVOList || ruleTreeNodeLineVOList.length == 0) return null;
        for (let nodeLine of ruleTreeNodeLineVOList) {
            if (this.decisionLogic(matterValue, nodeLine)) {
                return nodeLine.ruleNodeTo;
            }
        }
        return null;
        // throw new RuntimeException("决策树引擎，nextnode，计算失败，未找到可执行节点");
    }

    private decisionLogic(matterValue: string, nodeLine: RuleTreeNodeLineVO) {
        switch (nodeLine.ruleLimitType) {
            case "EQUAL":
                return matterValue == nodeLine.ruleLimitValue;
            // 以下规则暂时不需要实现
            case "GT":
            case "LT":
            case "GE":
            case "LE":
            default:
                return false;
        }
    }
}