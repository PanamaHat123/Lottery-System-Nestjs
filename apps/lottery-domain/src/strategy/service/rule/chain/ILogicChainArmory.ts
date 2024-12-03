import {ILogicChain} from "./ILogicChain";


export interface ILogicChainArmory{


     appendNext(next:ILogicChain):ILogicChain;

     next():ILogicChain;


     appendPrev(prev:ILogicChain):ILogicChain;

     prev():ILogicChain;



}