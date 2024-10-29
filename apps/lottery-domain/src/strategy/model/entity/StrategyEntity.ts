import {AppConstants} from "apps/lottery-types/src/common/AppConstants";


export class StrategyEntity{

    /*
      抽奖策略id
    */
    strategyId:number;

    /*
      抽奖策略描述
    */
    strategyDesc:string;

    /*
      抽奖规则模型
    */
    ruleModels:string;

    getRuleModels():string[] {
        if (this.ruleModels == null || this.ruleModels =='') return null;
        return this.ruleModels.split(AppConstants.SPLIT);
    }

    getRuleWeight():string {
        const ruleModels:string[] = this.getRuleModels();
        if (null == ruleModels) return null;
        for ( let ruleModel of ruleModels) {
            if ("rule_weight" == ruleModel) return ruleModel;
        }
        return null;
    }

}