import {ILogicChain} from "./ILogicChain";
import {DefaultChainFactory, StrategyAwardVO} from "./factory/DefaultChainFactory";
import {RaffleFactorEntity} from "../../../model/entity/RaffleFactorEntity";


export abstract class AbstractLogicChain implements ILogicChain {

    private nextChain:ILogicChain;
    private prevChain:ILogicChain;

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

    public appendPrev(prev:ILogicChain):ILogicChain {
        this.prevChain = prev;
        return prev;
    }

    public prev():ILogicChain {
        return this.prevChain;
    }


    abstract logic(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> ;

    public abstract ruleModel():string;

}