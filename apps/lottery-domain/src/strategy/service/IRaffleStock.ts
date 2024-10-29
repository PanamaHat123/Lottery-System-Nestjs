import {StrategyAwardStockKeyVO} from "../model/valobj/StrategyAwardStockKeyVO";


export interface IRaffleStock {


    /**
     * 获取奖品库存消耗队列
     */
    takeQueueValue():Promise<StrategyAwardStockKeyVO>;

    /**
     * 更新奖品库存消耗记录
     * @param strategyId 策略ID
     * @param awardId   奖品ID
     */
    updateStrategyAwardStock( strategyId:number,  awardId:number):Promise<void>;


}