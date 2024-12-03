import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StrategyPO} from "../po/StrategyPO.entity";
import {Repository} from "typeorm";
import {StrategyRulePO} from "../po/StrategyRulePO.entity";

@Injectable()
export class StrategyRuleDao {

    constructor(
        @InjectRepository(StrategyRulePO)
        private readonly strategyRulePORepository: Repository<StrategyRulePO>,
    ) {
    }

    async queryStrategyRule(strategyRule:StrategyRulePO):Promise<StrategyRulePO> {
        const where :any = {
            strategyId:strategyRule.strategyId,
            ruleModel:strategyRule.ruleModel,
        }
        if(strategyRule.awardId){
            where.awardId = strategyRule.awardId
        }
       const strategyPO= await this.strategyRulePORepository.findOne({
           where
       })
        return strategyPO
    }

    async queryStrategyRuleValue(strategyRule:StrategyRulePO):Promise<string>{
        const where :any = {
            strategyId:strategyRule.strategyId,
            ruleModel:strategyRule.ruleModel,
        }
        if(strategyRule.awardId){
            where.awardId = strategyRule.awardId
        }
        const strategyPO= await this.strategyRulePORepository.findOne({
            where
        })
        return strategyPO.ruleValue
    }

    async queryStrategyRuleList(strategyId:number):Promise<StrategyRulePO[]>{
        return await this.strategyRulePORepository.find({
            where:{
                strategyId:strategyId
            }
        })
    }

}
