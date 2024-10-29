/**
 * 抽奖策略接口
 */
import {RaffleFactorEntity} from "../model/entity/RaffleFactorEntity";
import {RaffleAwardEntity} from "../model/entity/RaffleAwardEntity";

export interface IRaffleStrategy{

     performRaffle(raffleFactorEntity:RaffleFactorEntity):Promise<RaffleAwardEntity>;

}