import {AbstractLogicTreeNode} from "../AbstractLogicTreeNode";
import {DefaultTreeFactory, TreeActionEntity, TreeStrategyAwardVO} from "../factory/DefaultTreeFactory";
import {Injectable} from "@nestjs/common";
import {AppConstants} from "apps/lottery-types/src/common/AppConstants";
import {RuleLogicCheckTypeVO} from "../../../../model/valobj/RuleLogicCheckTypeVO";


@Injectable()
export class RuleLuckAwardLogicTreeNode extends AbstractLogicTreeNode{


    constructor(
        private readonly defaultTreeFactory:DefaultTreeFactory
    ) {
        super(defaultTreeFactory);
    }

    async logic(userId: string, strategyId: number, awardId: number, ruleValue: string):  Promise<TreeActionEntity> {
        console.info(`规则过滤-兜底奖品-进入 userId:${userId} strategyId:${strategyId} awardId:${awardId} ruleValue:${ruleValue}`);
        const split:string[] = ruleValue.split(AppConstants.COLON);
        if (split.length == 0) {
            console.error(`规则过滤-兜底奖品，兜底奖品未配置告警 userId:${userId} strategyId:${strategyId} awardId:${awardId} ruleValue:${ruleValue}`);
            throw new Error("兜底奖品未配置 " + ruleValue);
        }
        // 兜底奖励配置
        const luckAwardId:number = +split[0];
        const awardRuleValue:string = split.length > 1 ? split[1] : "";

        // 返回兜底奖品
        console.info(`规则过滤-兜底奖品-接管 userId:${userId} strategyId:${strategyId} awardId:${luckAwardId} awardRuleValue:${awardRuleValue} CheckType:${RuleLogicCheckTypeVO.TAKE_OVER}`);

        const treeActionEntity = new TreeActionEntity;
        treeActionEntity.ruleLogicCheckType = RuleLogicCheckTypeVO.TAKE_OVER;
        const treeStrategyAwardVO = new TreeStrategyAwardVO();
        treeStrategyAwardVO.awardId = luckAwardId;
        treeStrategyAwardVO.awardRuleValue = awardRuleValue;
        treeActionEntity.strategyAwardVO = treeStrategyAwardVO;
        treeActionEntity.nodeDesc = "兜底奖品: "+luckAwardId
        return treeActionEntity;
    }

    ruleName(): string {
        return "rule_luck_award";
    }


}