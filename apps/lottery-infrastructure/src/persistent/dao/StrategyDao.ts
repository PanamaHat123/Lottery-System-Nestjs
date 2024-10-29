import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StrategyPO} from "../po/StrategyPO.entity";
import {Repository} from "typeorm";

@Injectable()
export class StrategyDao {

    constructor(
        @InjectRepository(StrategyPO)
        private readonly strategyEntityRepository: Repository<StrategyPO>,
    ) {
    }

    async queryStrategyEntityByStrategyId(strategyId: number):Promise<StrategyPO> {
       const strategyPO = await this.strategyEntityRepository.findOne({
           where:{
               strategyId:strategyId
           }
       })
        return strategyPO
    }


}
