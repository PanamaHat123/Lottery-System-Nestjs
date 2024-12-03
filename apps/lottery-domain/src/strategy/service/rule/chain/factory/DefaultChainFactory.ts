import {Injectable} from "@nestjs/common";
import {ILogicChain} from "../ILogicChain";
import {StrategyEntity} from "../../../../model/entity/StrategyEntity";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";


@Injectable()
export class DefaultChainFactory{

    logicChainGroup:Map<string, ILogicChain> = new Map<string, ILogicChain>();

    constructor(
        private readonly repository:StrategyRepository,
    ) {

    }

    async openLogicChain(strategyId: number):Promise<ILogicChain> {
        const strategy:StrategyEntity = await this.repository.queryStrategyEntityByStrategyId(strategyId);
        const ruleModels:string[] = strategy.getRuleModels()
        if(null == ruleModels || ruleModels.length == 0){
            return this.logicChainGroup.get("rule_default");
        }
        const logicChain:ILogicChain = this.logicChainGroup.get(ruleModels[0]);
        let prev:ILogicChain = null;
        let current:ILogicChain = logicChain;
        current.appendPrev(prev);
        for (let i = 1; i < ruleModels.length; i++) {
            const nextChain:ILogicChain = this.logicChainGroup.get(ruleModels[i]);
            prev = current;
            current = current.appendNext(nextChain);
            current.appendPrev(prev);
        }
        const default1 = this.logicChainGroup.get("rule_default");
        default1.appendPrev(current);
        current.appendNext(default1);
        return logicChain;
    }

    public register(key:string,chain:ILogicChain){
        this.logicChainGroup.set(key,chain);
    }


}

export class StrategyAwardVO {
    /** 抽奖奖品ID - 内部流转使用 */
    awardId:number;
    /**  */
    logicModel:string;

}
export class LogicModel {

    static RULE_DEFAULT = {code:"rule_default",info:"默认抽奖"};
    static RULE_BLACKLIST = {code:"rule_blacklist",info:"黑名单抽奖"};
    static RULE_WEIGHT = {code:"rule_weight",info:"权重规则"};

}