import {Controller, Get} from "@nestjs/common";
import {TestService} from "apps/lottery-domain/src/strategy/service/TestService";

@Controller("test")
export class DemoController {
    constructor(
        private readonly demoService:TestService,
    ) {
    }


    @Get("database")
    database():Promise<unknown>{
        return this.demoService.test_queryStrategyEntityByStrategyId();
    }

    @Get("database1")
    test_queryStrategyAwardList():Promise<unknown>{
        return this.demoService.test_queryStrategyAwardList();
    }

    @Get("assemble")
    test_assembleLotteryStrategy():Promise<unknown>{
        return this.demoService.test_assembleLotteryStrategy();
    }
    @Get("random")
    test_getRandomAwardId():Promise<unknown>{
        return this.demoService.test_getRandomAwardId();
    }
    @Get("raffle")
    test_performRaffle():Promise<unknown>{
        return this.demoService.test_performRaffle();
    }

}