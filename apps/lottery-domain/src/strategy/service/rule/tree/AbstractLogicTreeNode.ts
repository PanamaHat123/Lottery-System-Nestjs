import {ILogicTreeNode} from "./ILogicTreeNode";
import {DefaultTreeFactory, TreeActionEntity} from "./factory/DefaultTreeFactory";


export abstract class AbstractLogicTreeNode implements ILogicTreeNode{

    protected constructor(defaultTreeFactory:DefaultTreeFactory) {
        defaultTreeFactory.register(this.ruleName(),this)
    }

    abstract logic(userId: string, strategyId: number, awardId: number, ruleValue: string): Promise<TreeActionEntity>;

    abstract ruleName():string;

}