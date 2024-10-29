import {StrategyAwardEntity} from "../model/entity/StrategyAwardEntity";


export interface IRaffleAward {


    /**
     * 根据策略ID查询抽奖奖品列表配置
     * @param strategyId 策略ID
     * @return 奖品列表
     */
    queryRaffleStrategyAwardList(strategyId:number):Promise<StrategyAwardEntity[]>;
    
}