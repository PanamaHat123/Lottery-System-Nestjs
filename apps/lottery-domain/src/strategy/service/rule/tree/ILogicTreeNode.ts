import {TreeActionEntity} from "./factory/DefaultTreeFactory";


export interface ILogicTreeNode{

    logic(userId:string, strategyId:number, awardId:number,ruleValue:string): Promise<TreeActionEntity>;

}