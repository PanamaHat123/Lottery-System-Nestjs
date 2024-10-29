import {RuleLogicCheckTypeVO} from "../valobj/RuleLogicCheckTypeVO";


export class RuleActionEntity<T extends RaffleEntity>{

    code:string = RuleLogicCheckTypeVO.ALLOW.code

    info:string = RuleLogicCheckTypeVO.ALLOW.info

    ruleModel:string;

    data:T;

}

export class RaffleEntity {

}

//抽奖前
export class RaffleBeforeEntity extends RaffleEntity{

    /** 抽奖策略ID */
    strategyId:number;

    // 权重值 key
    ruleWeightValueKey:string;

    /** 抽奖奖品ID【规则类型为策略，则不需要奖品ID】 */
    awardId:number;
}

//抽奖中
export class RaffleCenterEntity extends RaffleEntity{

}

//抽奖后
export class RaffleAfterEntity extends RaffleEntity{

}
