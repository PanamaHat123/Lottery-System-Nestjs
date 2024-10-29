import {ILogicChain} from "./ILogicChain";
import {DefaultChainFactory, StrategyAwardVO} from "./factory/DefaultChainFactory";


export abstract class AbstractLogicChain implements ILogicChain {

    private nextChain:ILogicChain;

    protected constructor(defaultChainFactory:DefaultChainFactory) {
       defaultChainFactory.register(this.ruleModel(),this);
    }


    public appendNext(next:ILogicChain):ILogicChain {
        this.nextChain = next;
        return next;
    }

    public next():ILogicChain {
        return this.nextChain;
    }

    abstract logic(userId: string, strategyId: number): Promise<StrategyAwardVO> ;

    protected abstract ruleModel():string;

}