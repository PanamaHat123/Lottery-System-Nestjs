import {TreeStrategyAwardVO} from "../DefaultTreeFactory";
import {RaffleFactorEntity} from "../../../../../model/entity/RaffleFactorEntity";


export interface IDecisionTreeEngine {

    process(raffleFactorEntity:RaffleFactorEntity, awardId: number): Promise<TreeStrategyAwardVO>;

}