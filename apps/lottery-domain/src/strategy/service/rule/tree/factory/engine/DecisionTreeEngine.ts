import {IDecisionTreeEngine} from "./IDecisionTreeEngine";
import {TreeActionEntity, TreeStrategyAwardVO} from "../DefaultTreeFactory";
import {ILogicTreeNode} from "../../ILogicTreeNode";
import {RuleTreeVO} from "../../../../../model/valobj/RuleTreeVO";
import {RuleTreeNodeVO} from "../../../../../model/valobj/RuleTreeNodeVO";
import {RuleTreeNodeLineVO} from "../../../../../model/valobj/RuleTreeNodeLineVO";
import {RaffleFactorEntity} from "../../../../../model/entity/RaffleFactorEntity";
import {StrategyFlowRecordEntity} from "../../../../../model/entity/StrategyFlowRecordEntity";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";


export class DecisionTreeEngine implements IDecisionTreeEngine {

    private logicTreeNodeGroup: Map<string, ILogicTreeNode>;

    private ruleTreeVO: RuleTreeVO;
    private repository:StrategyRepository;

    constructor(logicTreeNodeGroup: Map<string, ILogicTreeNode>, ruleTreeVO: RuleTreeVO,repository:StrategyRepository) {
        this.logicTreeNodeGroup = logicTreeNodeGroup;
        this.ruleTreeVO = ruleTreeVO;
        this.repository = repository;
    }


    async process(raffleFactorEntity:RaffleFactorEntity, awardId: number): Promise<TreeStrategyAwardVO> {

        let strategyId = raffleFactorEntity.strategyId;
        let userId = raffleFactorEntity.userId;
        let orderId = raffleFactorEntity.orderId;

        let strategyAwardData: TreeStrategyAwardVO = null;
        //获取基础信息
        let nextNode: string = this.ruleTreeVO.treeRootRuleNode;
        const treeNodeMap: Map<string, RuleTreeNodeVO> = this.ruleTreeVO.treeNodeMap;
        let ruleTreeNode: RuleTreeNodeVO = treeNodeMap.get(nextNode);
        while (null != nextNode) {
            const logicTreeNode: ILogicTreeNode = this.logicTreeNodeGroup.get(ruleTreeNode.ruleKey);
            const ruleValue = ruleTreeNode.ruleValue;

            //记录流程
            const strategyFlowRecordEntity = new StrategyFlowRecordEntity();
            strategyFlowRecordEntity.strategyId = strategyId;
            strategyFlowRecordEntity.userId = userId;
            strategyFlowRecordEntity.orderId = orderId;
            strategyFlowRecordEntity.currentNode = ruleTreeNode.ruleKey;
            strategyFlowRecordEntity.processType = "tree";
            strategyFlowRecordEntity.head = (nextNode ==this.ruleTreeVO.treeRootRuleNode) ?1:0;
            strategyFlowRecordEntity.treeId = this.ruleTreeVO.treeId;


            const logicEntity: TreeActionEntity =await logicTreeNode.logic(userId, strategyId, awardId, ruleValue);
            const ruleLogicCheckType = logicEntity.ruleLogicCheckType;
            strategyAwardData = logicEntity.strategyAwardVO;

            //记录
            strategyFlowRecordEntity.nodeDesc = logicEntity.nodeDesc;
            if(null != logicEntity.strategyAwardVO){
                strategyFlowRecordEntity.awardId = logicEntity.strategyAwardVO.awardId;
            }else{
                strategyFlowRecordEntity.awardId = awardId;
            }
            strategyFlowRecordEntity.ruleLimitValue =  ruleLogicCheckType;
            strategyFlowRecordEntity.treeProcessResult =  ruleLogicCheckType;

            nextNode = this.nextNode(ruleLogicCheckType, ruleTreeNode.treeNodeLineVOList);
            console.info(`决策树引擎【${this.ruleTreeVO.treeName}】treeId:${this.ruleTreeVO.treeId} node:${nextNode} code:${ruleLogicCheckType}`);
            ruleTreeNode = treeNodeMap.get(nextNode);

            if(ruleTreeNode!=null){
                strategyFlowRecordEntity.nextNode =ruleTreeNode.ruleKey;
            }
            await this.repository.saveStrategyFlowRecord(strategyFlowRecordEntity);
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