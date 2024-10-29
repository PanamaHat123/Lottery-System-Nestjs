import {ILogicChainArmory} from "./ILogicChainArmory";
import {StrategyAwardVO} from "./factory/DefaultChainFactory";


export interface ILogicChain extends ILogicChainArmory{

    /**
     * 责任链接口
     * @param userId 用户id
     * @param strategyId 策略id
     * @return 奖品id
     */
    logic(userId:string, strategyId:number):Promise<StrategyAwardVO>;
}