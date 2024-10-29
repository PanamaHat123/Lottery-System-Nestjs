import {AppConstants} from "apps/lottery-types/src/common/AppConstants";


export class StrategyRuleEntity{


    /** 抽奖策略ID */
     strategyId:number;
    /** 抽奖奖品ID【规则类型为策略，则不需要奖品ID】 */
     awardId:number;
    /** 抽象规则类型；1-策略规则、2-奖品规则 */
     ruleType:number;
    /** 抽奖规则类型【rule_random - 随机值计算、rule_lock - 抽奖几次后解锁、rule_luck_award - 幸运奖(兜底奖品)】 */
     ruleModel:string;
    /** 抽奖规则比值 */
     ruleValue:string;
    /** 抽奖规则描述 */
     ruleDesc:string;

    /**
     * 获取权重值
     * 数据案例；4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108,109
     */
    public getRuleWeightValues(): Map<string, number[]> | null {
        if (this.ruleModel !== 'rule_weight') return null;
        const ruleValueGroups = this.ruleValue.split(AppConstants.SPACE);
        const resultMap = new Map<string, number[]>();

        for (const ruleValueGroup of ruleValueGroups) {
            if (!ruleValueGroup) {
                return resultMap;
            }
            const parts = ruleValueGroup.split(AppConstants.COLON);
            if (parts.length !== 2) {
                throw new Error(`Invalid input format for rule_weight: ${ruleValueGroup}`);
            }
            const valueStrings = parts[1].split(AppConstants.SPLIT);
            const values = valueStrings.map((valueString) => parseInt(valueString, 10));
            resultMap.set(ruleValueGroup, values);
        }
        return resultMap;
    }


}