

/**
 * 策略抽奖的调度
 */
export interface IStrategyDispatch{




    getRandomAwardId(strategyId:number,ruleWeightValue?:string): Promise<number>;

    subtractionAwardStock(strategyId: number, awardId: number) :Promise<boolean>;
}