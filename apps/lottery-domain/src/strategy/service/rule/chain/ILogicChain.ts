import {ILogicChainArmory} from "./ILogicChainArmory";
import {StrategyAwardVO} from "./factory/DefaultChainFactory";
import {RaffleFactorEntity} from "../../../model/entity/RaffleFactorEntity";


export interface ILogicChain extends ILogicChainArmory{

    /**
     * 责任链接口
     * @param userId 用户id
     * @param strategyId 策略id
     * @return 奖品id
     */
    logic(raffleFactorEntity:RaffleFactorEntity):Promise<StrategyAwardVO>;

    //记录责任链处理结果
    record(raffleFactorEntity:RaffleFactorEntity,strategyAwardVO:StrategyAwardVO):Promise<void>;

    ruleModel():string;
}