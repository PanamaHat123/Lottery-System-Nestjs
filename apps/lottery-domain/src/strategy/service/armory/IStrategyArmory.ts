
/**
 * 策略装配库  负责初始化策略计算
 */
export interface IStrategyArmory {

    assembleLotteryStrategy(strategyId:number):Promise<boolean>;

}
