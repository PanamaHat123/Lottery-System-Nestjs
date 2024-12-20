import {AbstractLogicChain} from "../AbstractLogicChain";
import { DefaultChainFactory, LogicModel, StrategyAwardVO } from '../factory/DefaultChainFactory';
import {Injectable} from "@nestjs/common";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {StrategyArmoryDispatch} from "../../../armory/StrategyArmoryDispatch";
import {StrategyAwardEntity} from "../../../../model/entity/StrategyAwardEntity";
import {AppConstants} from "apps/lottery-types/src/common/AppConstants";
import {RaffleFactorEntity} from "../../../../model/entity/RaffleFactorEntity";
import {StrategyFlowRecordEntity} from "../../../../model/entity/StrategyFlowRecordEntity";
import {RuleLogicCheckTypeVO} from "../../../../model/valobj/RuleLogicCheckTypeVO";


@Injectable()
export class RuleWeightLogicChain  extends AbstractLogicChain{

    userScore:number = 3000;

    constructor(
        public readonly repository:StrategyRepository,
        private readonly strategyDispatch:StrategyArmoryDispatch,
        private readonly defaultChainFactory:DefaultChainFactory,

    ) {
        super(defaultChainFactory,repository);
    }

    /**
     * 权重规则过滤；
     * 1. 权重规则格式；4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108,109
     * 2. 解析数据格式；判断哪个范围符合用户的特定抽奖范围
     */
    async doLogic(raffleFactorEntity:RaffleFactorEntity): Promise<StrategyAwardVO> {
        let strategyId = raffleFactorEntity.strategyId
        let userId = raffleFactorEntity.userId
        let orderId = raffleFactorEntity.orderId

        console.info(`抽奖责任链-权重开始 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()}`);

        const ruleValue:string = await this.repository.queryStrategyRuleValue(strategyId,this.ruleModel());

        // 1. 根据用户ID查询用户抽奖消耗的积分值，先写死为固定的值。后续需要从数据库中查询。
        const analyticalValueGroup:Map<number, string> = this.getAnalyticalValue(ruleValue)
        if (null == analyticalValueGroup || analyticalValueGroup.size == 0) return null;

        // 2. 转换Keys值，并默认排序
        const analyticalSortedKeys = Array.from(analyticalValueGroup.keys());
        analyticalSortedKeys.sort();

        // 3. 找出最小符合的值，也就是【4500 积分，能找到 4000:102,103,104,105】、【5000 积分，能找到 5000:102,103,104,105,106,107】
        let nextValue = analyticalSortedKeys
            .sort((a, b) => b - a) // 降序排序
            .find(analyticalSortedKeyValue => this.userScore >= analyticalSortedKeyValue);

        if (nextValue != null) {
            let awardId = await this.strategyDispatch.getRandomAwardId(strategyId, analyticalValueGroup.get(nextValue));
            console.info(`抽奖责任链-权重接管 userId: ${userId} strategyId:${strategyId} ruleModel: ${this.ruleModel()} awardId:${awardId}`);

            return {
                awardId: awardId,
                processResult: RuleLogicCheckTypeVO.TAKE_OVER,
                nodeDesc: "权重接管-权重配置:" + ruleValue + ";当前权重:" + this.userScore+"; awardId"+awardId,
                logicModel: this.ruleModel()
            };
        }
        // 5. 过滤其他责任链
        console.info(`抽奖责任链-权重放行 userId: ${userId} strategyId: ${strategyId} ruleModel: ${this.ruleModel()}`);

        return  {
            processResult: RuleLogicCheckTypeVO.ALLOW,
            nodeDesc: "权重放行-权重配置:" + ruleValue + ";当前权重:" + this.userScore,
            logicModel: this.ruleModel()
        };
    }

    public ruleModel(): string {
        return LogicModel.RULE_WEIGHT.code;
    }

// 定义一个函数，其行为类似于Java方法
    public getAnalyticalValue(ruleValue: string): Map<number, string> {
        const ruleValueGroups = ruleValue.split(AppConstants.SPACE);
        const ruleValueMap = new Map<number, string>();
        for (const ruleValueKey of ruleValueGroups) {
            // 检查输入是否为空
            if (!ruleValueKey) {
                return ruleValueMap;
            }
            // 分割字符串以获取键和值
            const parts = ruleValueKey.split(AppConstants.COLON);
            if (parts.length !== 2) {
                throw new Error(`Invalid input format for rule_weight rule: ${ruleValueKey}`);
            }
            // 将字符串键转换为数字，并添加到Map中
            ruleValueMap.set(+parts[0], ruleValueKey);
        }
        return ruleValueMap;
    }
}

