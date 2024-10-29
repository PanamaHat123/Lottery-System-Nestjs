import {ILogicChain} from "./ILogicChain";


export interface ILogicChainArmory{


     appendNext(next:ILogicChain):ILogicChain;

     next():ILogicChain;


}