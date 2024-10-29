import {IRaffleStrategy} from "./IRaffleStrategy";
import {RaffleFactorEntity} from "../model/entity/RaffleFactorEntity";
import {RaffleAwardEntity} from "../model/entity/RaffleAwardEntity";
import {Injectable} from "@nestjs/common";
import {IStrategyRepository} from "../repository/IStrategyRepository";
import {IStrategyDispatch} from "./armory/IStrategyDispatch";
import {AppException} from "apps/lottery-types/src/exception/AppException";
import {ResponseCode} from "apps/lottery-types/src/enums/ResponseCode";
import {DefaultChainFactory, LogicModel, StrategyAwardVO} from "./rule/chain/factory/DefaultChainFactory";
import {TreeStrategyAwardVO } from "./rule/tree/factory/DefaultTreeFactory";
import {StrategyAwardEntity} from "../model/entity/StrategyAwardEntity";

/**
 * 抽奖策略抽象类
 */
// @Injectable()
export abstract class AbstractRaffleStrategy implements IRaffleStrategy {

    //策略仓储服务 -》 domain层 大厨  仓储层 提供米油
    protected repository: IStrategyRepository;

    //策略调度服务 -》只负责抽奖处理，通过新增接口的方式，隔离职责。 不需要使用方关心或者调用抽奖的初始化
    protected strategyDispatch: IStrategyDispatch;

    //抽奖责任链
    protected defaultChainFactory: DefaultChainFactory;

    protected constructor(repository: IStrategyRepository, strategyDispatch: IStrategyDispatch, defaultChainFactory: DefaultChainFactory) {
        this.repository = repository;
        this.strategyDispatch = strategyDispatch;
        this.defaultChainFactory = defaultChainFactory;
    }

    async performRaffle(raffleFactorEntity: RaffleFactorEntity): Promise<RaffleAwardEntity> {

        // 1. 参数校验
        if (!raffleFactorEntity.userId || !raffleFactorEntity.strategyId) {
            throw new AppException(ResponseCode.ILLEGAL_PARAMETER.code, ResponseCode.ILLEGAL_PARAMETER.info);
        }
        const userId = raffleFactorEntity.userId;
        const strategyId = raffleFactorEntity.strategyId;


        // 2. 责任链抽奖计算【这步拿到的是初步的抽奖ID，之后需要根据ID处理抽奖】注意；黑名单、权重等非默认抽奖的直接返回抽奖结果
        const chainStrategyAwardVO = await this.raffleLogicChain(userId, strategyId);
        console.log("抽奖策略计算-责任链 {} {} {} {}", userId, strategyId, chainStrategyAwardVO.awardId, chainStrategyAwardVO.logicModel);
        if (LogicModel.RULE_DEFAULT.code !== chainStrategyAwardVO.logicModel) {
            // TODO awardConfig 暂时为空。黑名单指定积分奖品，后续需要在库表中配置上对应的1积分值，并获取到。
            return this.buildRaffleAwardEntity(strategyId, chainStrategyAwardVO.awardId, null);
        }
        // 3. 规则树抽奖过滤【奖品ID，会根据抽奖次数判断、库存判断、兜底兜里返回最终的可获得奖品信息】todo
        const treeStrategyAwardVO:TreeStrategyAwardVO = await this.raffleLogicTree(userId, strategyId, chainStrategyAwardVO.awardId);
        console.info("抽奖策略计算-规则树 {} {} {} {}", userId, strategyId, treeStrategyAwardVO.awardId, treeStrategyAwardVO.awardRuleValue);

        return this.buildRaffleAwardEntity(strategyId,treeStrategyAwardVO.awardId,treeStrategyAwardVO.awardRuleValue);
    }

    /**
     * 抽奖计算，责任链抽象方法
     *
     * @param userId     用户ID
     * @param strategyId 策略ID
     * @return 奖品ID
     */
    public abstract raffleLogicChain(userId: string, strategyId: number): Promise<StrategyAwardVO>;

    /**
     * 抽奖结果过滤，决策树抽象方法
     *
     * @param userId     用户ID
     * @param strategyId 策略ID
     * @param awardId    奖品ID
     * @return 过滤结果【奖品ID，会根据抽奖次数判断、库存判断、兜底兜里返回最终的可获得奖品信息】
     */
    public abstract raffleLogicTree(userId: string, strategyId: number, awardId: number): Promise<TreeStrategyAwardVO>;


    private async buildRaffleAwardEntity(strategyId: number, awardId: number, awardConfig: string): Promise<RaffleAwardEntity> {
        const strategyAward: StrategyAwardEntity = await this.repository.queryStrategyAwardEntity(strategyId, awardId);
        const raffleAwardEntity = new RaffleAwardEntity();
        raffleAwardEntity.awardId = awardId;
        raffleAwardEntity.awardConfig = awardConfig;
        raffleAwardEntity.sort = strategyAward.sort;
        return raffleAwardEntity;
    }
}