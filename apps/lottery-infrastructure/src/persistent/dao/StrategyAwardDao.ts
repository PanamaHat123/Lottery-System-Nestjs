import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {StrategyAwardPO} from "../po/StrategyAwardPO.entity";

@Injectable()
export class StrategyAwardDao {

    constructor(
        @InjectRepository(StrategyAwardPO)
        private readonly strategyAwardPORepository: Repository<StrategyAwardPO>,
    ) {
    }

    async queryStrategyAwardListByStrategyId(strategyId: number):Promise<StrategyAwardPO[]> {
       const strategyAwardPOS:StrategyAwardPO[] = await this.strategyAwardPORepository.find({
           where:{
               strategyId:strategyId
           }
       })
        return strategyAwardPOS
    }

    async queryStrategyAwardRuleModels(strategyAwardPO:StrategyAwardPO):Promise<string>{
        const strategyAward:StrategyAwardPO = await this.strategyAwardPORepository.findOne({
            where:{
                strategyId:strategyAwardPO.strategyId,
                awardId:strategyAwardPO.awardId
            }
        })
        return strategyAward.ruleModels
    }

    async updateStrategyAwardStock(strategyAwardPO:StrategyAwardPO):Promise<void>{
        await this.strategyAwardPORepository.createQueryBuilder("strategyAward")
            .update(StrategyAwardPO)
            .set({awardCountSurplus:()=>"award_count_surplus - 1"})
            .where("strategy_id=:strategyId",{strategyId:strategyAwardPO.strategyId})
            .andWhere("award_id=:awardId",{awardId:strategyAwardPO.awardId})
            .andWhere("award_count_surplus>0")
            .execute();
    }

    async queryStrategyAward(strategyAwardPO:StrategyAwardPO):Promise<StrategyAwardPO>{

        const strategyAward:StrategyAwardPO = await this.strategyAwardPORepository.findOne({
            where:{
                strategyId:strategyAwardPO.strategyId,
                awardId:strategyAwardPO.awardId
            }
        })
        return strategyAward
    }


}
