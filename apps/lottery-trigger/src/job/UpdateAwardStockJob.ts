import {Injectable} from "@nestjs/common";
import {DefaultRaffleStrategy} from "apps/lottery-domain/src/strategy/service/raffle/DefaultRaffleStrategy";
import {StrategyAwardStockKeyVO} from "apps/lottery-domain/src/strategy/model/valobj/StrategyAwardStockKeyVO";


@Injectable()
export class UpdateAwardStockJob {


    constructor(
        private readonly raffleStock:DefaultRaffleStrategy,
    ) {
        this.init()
    }

    private init() {
        setInterval(async ()=>{
            try {
                console.info("定时任务，更新奖品消耗库存【延迟队列获取，降低对数据库的更新频次，不要产生竞争】");
                const strategyAwardStockKeyVO: StrategyAwardStockKeyVO = await this.raffleStock.takeQueueValue();
                if (!strategyAwardStockKeyVO) return;
                console.info(`定时任务，更新奖品消耗库存 strategyId:${strategyAwardStockKeyVO.strategyId} awardId:${strategyAwardStockKeyVO.awardId}`);
                await this.raffleStock.updateStrategyAwardStock(strategyAwardStockKeyVO.strategyId, strategyAwardStockKeyVO.awardId);
                console.log("定时任务 扣减mysql库存成功")
            } catch (e) {
                console.error("定时任务，更新奖品消耗库存失败", e);
            }

        },6000)
    }
}