import {TreeStrategyAwardVO} from "../DefaultTreeFactory";


export interface IDecisionTreeEngine {

    process(userId: string, strategyId: number, awardId: number): Promise<TreeStrategyAwardVO>;

}