import {Inject, Injectable} from "@nestjs/common";
import {StrategyRepository} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {StrategyArmoryDispatch} from "./armory/StrategyArmoryDispatch";
import {DefaultRaffleStrategy} from "./raffle/DefaultRaffleStrategy";
import {RaffleFactorEntity} from "../model/entity/RaffleFactorEntity";


@Injectable()
export class TestService {

    constructor(
        @Inject()
        private readonly strategyRepository:StrategyRepository,
        private readonly strategyArmoryDispatch:StrategyArmoryDispatch,
        private readonly defaultRaffleStrategy:DefaultRaffleStrategy,
    ) {
    }

    public test_queryStrategyEntityByStrategyId():any{
       return this.strategyRepository.queryStrategyEntityByStrategyId(1)
    }
    public test_queryStrategyAwardList():any{
        return this.strategyRepository.queryStrategyAwardList(1)
    }

    public test_assembleLotteryStrategy():any{
        return this.strategyArmoryDispatch.assembleLotteryStrategy(1)
    }

    public test_getRandomAwardId():any{
        return this.strategyArmoryDispatch.getRandomAwardId(1)
    }

    public test_performRaffle():any{
        const raffleFactorEntity = new RaffleFactorEntity();
        raffleFactorEntity.userId = "panama"
        raffleFactorEntity.strategyId = 1
        return this.defaultRaffleStrategy.performRaffle(raffleFactorEntity)
    }


}
