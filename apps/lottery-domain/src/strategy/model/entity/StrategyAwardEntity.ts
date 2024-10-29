
import { Decimal } from 'decimal.js';

export class StrategyAwardEntity {

    /** 抽奖策略ID */
    strategyId:number;
    /** 抽奖奖品ID - 内部流转使用 */
    awardId:number;
    /** 抽奖奖品标题 */
    awardTitle:string;
    /** 抽奖奖品副标题 */
    awardSubtitle:string;
    /** 奖品库存总量 */
    awardCount:number;
    /** 奖品库存剩余 */
    awardCountSurplus:number;
    /** 奖品中奖概率 */
    awardRate:Decimal;
    /** 排序 */
    sort:number;
}