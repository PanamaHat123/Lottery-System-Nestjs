import {IStrategyArmory} from "./IStrategyArmory";
import {Injectable, Logger} from '@nestjs/common';
import {StrategyRepository} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {StrategyAwardEntity} from "../../model/entity/StrategyAwardEntity";
import {Decimal} from "decimal.js";
import {StrategyEntity} from "../../model/entity/StrategyEntity";
import {StrategyRuleEntity} from "../../model/entity/StrategyRuleEntity";
import {ResponseCode} from "apps/lottery-types/src/enums/ResponseCode";
import {AppException} from "apps/lottery-types/src/exception/AppException";
import {IStrategyDispatch} from "./IStrategyDispatch";
import {randomInt} from "crypto";
import {AppConstants} from "apps/lottery-types/src/common/AppConstants";


@Injectable()
export class StrategyArmoryDispatch implements IStrategyArmory, IStrategyDispatch {
    private logger = new Logger(StrategyArmoryDispatch.name);

    constructor(
        private readonly repository: StrategyRepository,
    ) {
    }

    async assembleLotteryStrategy(strategyId: number): Promise<boolean> {
        //1.查询策略配置
        const strategyAwardEntities: StrategyAwardEntity[] = await this.repository.queryStrategyAwardList(strategyId)

        //2.缓存奖品库存【用于decr扣减库存】 todo

        for(let strategyAward of strategyAwardEntities){
            const awardId:number = strategyAward.awardId;
            const awardCount:number = strategyAward.awardCount;
            await this.cacheStrategyAwardCount(strategyId,awardId,awardCount);
        }
        //3-1 默认装配配置 （全量抽奖概率）
        await this.doAssembleLotteryStrategy(strategyId + '', strategyAwardEntities);

        //3-2. 权重策略配置 - 适用于 rule_weight 权重规则配置
        const strategyEntity: StrategyEntity = await this.repository.queryStrategyEntityByStrategyId(strategyId);
        const ruleWeight: string = strategyEntity.getRuleWeight();
        if (null == ruleWeight || '' == ruleWeight) return true;
        const strategyRuleEntity: StrategyRuleEntity = await this.repository.queryStrategyRule(strategyId, ruleWeight);
        if (null == strategyRuleEntity) {
            throw new AppException(
                ResponseCode.STRATEGY_RULE_WEIGHT_IS_NULL.code,
                ResponseCode.STRATEGY_RULE_WEIGHT_IS_NULL.info
            );
        }
        const ruleWeightValueMap: Map<string, number[]> = strategyRuleEntity.getRuleWeightValues();
        const keys = ruleWeightValueMap.keys();
        for (let key of keys) {
            const ruleWeightValues = ruleWeightValueMap.get(key)
            let strategyAwardEntitiesClone: StrategyAwardEntity[] = [...strategyAwardEntities];
            strategyAwardEntitiesClone = strategyAwardEntitiesClone.filter(entity => ruleWeightValues.includes(entity.awardId));
            await this.doAssembleLotteryStrategy(strategyId + '_' + key, strategyAwardEntitiesClone);
        }
        return true;
    }

    async doAssembleLotteryStrategy(key: string, strategyAwardEntities: StrategyAwardEntity[]): Promise<void> {
        //1. 获取最小概率值
        const minAwardRate: Decimal = strategyAwardEntities.reduce((minItem: StrategyAwardEntity | null, currentItem) => {
            if (!minItem || currentItem.awardRate.lessThan(minItem.awardRate)) {
                return currentItem
            }
            return minItem
        }, null).awardRate
        this.logger.log(minAwardRate)

        //2.获取概率值的总和
        const totalAwardRate: Decimal = strategyAwardEntities.reduce((lastItem: Decimal | null, currentItem) => {

            return currentItem.awardRate.add(lastItem ? lastItem : 0)

        }, null)
        //3. 用 1 % 0.0001 获取概率范围
        let rateRange: Decimal = totalAwardRate.dividedBy(minAwardRate);

        //4.
        const strategyAwardSearchRateTables = [];
        for (let strategyAwardEntity of strategyAwardEntities) {
            const awardId: number = strategyAwardEntity.awardId;
            const awardRate: Decimal = strategyAwardEntity.awardRate;

            //计算出 每个概率值需要存放到查找表的数量
            for (let i = 0; i < rateRange.mul(awardRate).ceil().toNumber(); i++) {
                strategyAwardSearchRateTables.push(awardId);
            }
        }
        //5. 乱序
        strategyAwardSearchRateTables.sort(() => Math.random() - 0.5);

        //6.
        const shuffleStrategyAwardSearchRateTables = new Map<number, number>();
        for (let i = 0; i < strategyAwardSearchRateTables.length; i++) {
            shuffleStrategyAwardSearchRateTables.set(i, strategyAwardSearchRateTables[i]);
        }
        //7.存储到Redis
        await this.repository.storeStrategyAwardSearchTables(key, shuffleStrategyAwardSearchRateTables.size, shuffleStrategyAwardSearchRateTables);

    }

    async getRandomAwardId(strategyId: number, ruleWeightValue?: string): Promise<number> {

        let key = "";
        if (!ruleWeightValue) {
            key = strategyId + "";
        } else {
            key = strategyId + "_" + ruleWeightValue;
        }
        const rateRange: number = await this.repository.getRateRange(key);
        const secureRandomInt = randomInt(0, rateRange);
        return this.repository.getStrategyAwardAssemble(key,secureRandomInt);
    }

    private async cacheStrategyAwardCount(strategyId: number, awardId: number, awardCount: number):Promise<void> {
        const cacheKey:string = AppConstants.RedisKey.STRATEGY_AWARD_COUNT_KEY+strategyId+AppConstants.UNDERLINE+ awardId;
        await this.repository.cacheStrategyAwardCount(cacheKey,awardCount);

    }

    async subtractionAwardStock(strategyId: number, awardId: number) :Promise<boolean> {
        const cacheKey:string = AppConstants.RedisKey.STRATEGY_AWARD_COUNT_KEY + strategyId + AppConstants.UNDERLINE + awardId;
        return  this.repository.subtractionAwardStock(cacheKey);
    }
}