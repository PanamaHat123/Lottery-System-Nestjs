import {Injectable} from "@nestjs/common";
import {StrategyPO} from "../po/StrategyPO.entity";
import {StrategyDao} from "../dao/StrategyDao";
import {IStrategyRepository} from "apps/lottery-domain/src/strategy/repository/IStrategyRepository";
import {StrategyEntity} from "apps/lottery-domain/src/strategy/model/entity/StrategyEntity";
import {AppConstants} from "apps/lottery-types/src/common/AppConstants";
import {RedisService} from "../redis/RedisService";
import {StrategyAwardEntity} from "apps/lottery-domain/src/strategy/model/entity/StrategyAwardEntity";
import {StrategyAwardDao} from "../dao/StrategyAwardDao";
import {StrategyAwardPO} from "../po/StrategyAwardPO.entity";
import {StrategyRuleDao} from "../dao/StrategyRuleDao";
import {StrategyRuleEntity} from "apps/lottery-domain/src/strategy/model/entity/StrategyRuleEntity";
import {StrategyRulePO} from "../po/StrategyRulePO.entity";
import Decimal from 'decimal.js';
import {AppException} from "apps/lottery-types/src/exception/AppException";
import {ResponseCode} from "apps/lottery-types/src/enums/ResponseCode";
import {StrategyAwardRuleModelVO} from "apps/lottery-domain/src/strategy/model/valobj/StrategyAwardRuleModelVO";
import {RuleTreeVO} from "apps/lottery-domain/src/strategy/model/valobj/RuleTreeVO";
import {RuleTreePO} from "../po/RuleTreePO.entity";
import {RuleTreeNodePO} from "../po/RuleTreeNodePO.entity";
import {RuleTreeNodeLinePO} from "../po/RuleTreeNodeLinePO.entity";
import {RuleTreeDao} from "../dao/RuleTreeDao";
import {RuleTreeNodeDao} from "../dao/RuleTreeNodeDao";
import {RuleTreeNodeLineDao} from "../dao/RuleTreeNodeLineDao";
import {RuleTreeNodeLineVO} from "apps/lottery-domain/src/strategy/model/valobj/RuleTreeNodeLineVO";
import {RuleLimitTypeVOEnum} from "apps/lottery-domain/src/strategy/model/valobj/RuleLimitTypeVO";
import {RuleLogicCheckTypeVOEnum} from "apps/lottery-domain/src/strategy/model/valobj/RuleLogicCheckTypeVO";
import {RuleTreeNodeVO} from "apps/lottery-domain/src/strategy/model/valobj/RuleTreeNodeVO";
import {StrategyAwardStockKeyVO} from "../../../../lottery-domain/src/strategy/model/valobj/StrategyAwardStockKeyVO";

@Injectable()
export class StrategyRepository implements IStrategyRepository{

    constructor(
       private readonly strategyDao:StrategyDao,
       private readonly strategyAwardDao:StrategyAwardDao,
       private readonly strategyRuleDao:StrategyRuleDao,
       private readonly redisService:RedisService,
       private readonly ruleTreeDao:RuleTreeDao,
       private readonly ruleTreeNodeDao:RuleTreeNodeDao,
       private readonly ruleTreeNodeLineDao:RuleTreeNodeLineDao,
    ) {
    }

    async queryStrategyEntityByStrategyId(strategyId: number):Promise<StrategyEntity> {
        //有限从缓存中获取
        let cacheKey = AppConstants.RedisKey.STRATEGY_KEY + strategyId;
        let strategy:StrategyEntity =  await this.redisService.getValue(cacheKey);
        if(null != strategy) {
            Object.setPrototypeOf(strategy,StrategyEntity.prototype)
            return strategy;
        }
        const strategyPO =  await this.strategyDao.queryStrategyEntityByStrategyId(strategyId)
        strategy = new StrategyEntity();
        strategy.strategyId = strategyPO.strategyId;
        strategy.strategyDesc = strategyPO.strategyDesc;
        strategy.ruleModels = strategyPO.ruleModels;
        await this.redisService.setValue(cacheKey,strategy);
        return strategy;
    }

    async queryStrategyAwardList(strategyId: number): Promise<StrategyAwardEntity[]> {

        const cacheKey = AppConstants.RedisKey.STRATEGY_AWARD_LIST_KEY + strategyId;
        let strategyAwardEntities:StrategyAwardEntity[] = await this.redisService.getValue(cacheKey);

        if(null != strategyAwardEntities && strategyAwardEntities.length!=0){
            strategyAwardEntities.forEach(item=>item.awardRate=new Decimal(item.awardRate));
            return strategyAwardEntities;
        }

        const strategyAwardPOS:StrategyAwardPO[] = await this.strategyAwardDao.queryStrategyAwardListByStrategyId(strategyId)
        strategyAwardEntities = []
        for (let strategyAwardPO of strategyAwardPOS) {
            const strategyAwardEntity = new StrategyAwardEntity()
            strategyAwardEntity.awardId = strategyAwardPO.awardId
            strategyAwardEntity.strategyId = strategyAwardPO.strategyId
            strategyAwardEntity.awardTitle = strategyAwardPO.awardTitle
            strategyAwardEntity.awardSubtitle = strategyAwardPO.awardSubtitle
            strategyAwardEntity.awardCount = strategyAwardPO.awardCount
            strategyAwardEntity.awardCountSurplus = strategyAwardPO.awardCountSurplus
            strategyAwardEntity.awardRate = strategyAwardPO.awardRate
            strategyAwardEntity.sort = strategyAwardPO.sort
            strategyAwardEntities.push(strategyAwardEntity)
        }

        await this.redisService.setValue(cacheKey,strategyAwardEntities);
        return strategyAwardEntities;
    }

    async queryStrategyRule(strategyId: number, ruleModel: string, awardId?: number): Promise<StrategyRuleEntity> {
        const strategyRuleReq = new StrategyRulePO();
        strategyRuleReq.strategyId = strategyId;
        strategyRuleReq.ruleModel = ruleModel;
        strategyRuleReq.awardId = awardId;
        const strategyRulePO = await this.strategyRuleDao.queryStrategyRule(strategyRuleReq);
        if (null == strategyRulePO) return null;
        const strategyRule = new StrategyRuleEntity();
        strategyRule.strategyId = strategyRulePO.strategyId
        strategyRule.awardId = strategyRulePO.awardId
        strategyRule.ruleType = strategyRulePO.ruleType
        strategyRule.ruleModel = strategyRulePO.ruleModel
        strategyRule.ruleValue = strategyRulePO.ruleValue
        strategyRule.ruleDesc = strategyRulePO.ruleDesc
        return strategyRule;
    }


    async storeStrategyAwardSearchTables(key: string, rateRange: number, shuffleStrategyAwardSearchRateTables: Map<number, number>):Promise<void> {
        // 1. 存储抽奖策略范围值，如10000，用于生成1000以内的随机数
        await this.redisService.setValue(AppConstants.RedisKey.STRATEGY_RATE_RANGE_KEY + key, rateRange);
        // 2. 存储概率查找表
        await this.redisService.hmset(AppConstants.RedisKey.STRATEGY_RATE_TABLE_KEY + key,shuffleStrategyAwardSearchRateTables as any);

    }

    async getRateRange(key: string):Promise<number> {
        const cacheKey:string = AppConstants.RedisKey.STRATEGY_RATE_RANGE_KEY + key;
        const isExist = await this.redisService.isExists(cacheKey);
        if (!isExist) {
            throw new AppException(ResponseCode.UN_ASSEMBLED_STRATEGY_ARMORY.code, cacheKey + AppConstants.COLON + ResponseCode.UN_ASSEMBLED_STRATEGY_ARMORY.info);
        }
        return  this.redisService.getValue(AppConstants.RedisKey.STRATEGY_RATE_RANGE_KEY + key);
    }

    async getStrategyAwardAssemble(key: string, secureRandomInt: number):Promise<number> {
        const k = AppConstants.RedisKey.STRATEGY_RATE_TABLE_KEY + key
        return this.redisService.hget(k, secureRandomInt + "") as Promise<number> ;
    }

    async queryStrategyAwardEntity(strategyId: number, awardId: number): Promise<StrategyAwardEntity> {
        // 优先从缓存获取
        const cacheKey = AppConstants.RedisKey.STRATEGY_AWARD_KEY + strategyId + AppConstants.UNDERLINE + awardId;
        let strategyAwardEntity:StrategyAwardEntity = await this.redisService.getValue(cacheKey);
        if (null != strategyAwardEntity){
            strategyAwardEntity.awardRate = new Decimal(strategyAwardEntity.awardRate);
            return strategyAwardEntity;
        }
        // 查询数据
        const strategyAwardReq:StrategyAwardPO = new StrategyAwardPO();
        strategyAwardReq.strategyId = strategyId;
        strategyAwardReq.awardId = awardId;
        const strategyAwardRes:StrategyAwardPO =await this.strategyAwardDao.queryStrategyAward(strategyAwardReq);
        strategyAwardEntity = new StrategyAwardEntity()
        strategyAwardEntity.strategyId = strategyAwardRes.strategyId
        strategyAwardEntity.awardId = strategyAwardRes.awardId
        strategyAwardEntity.awardTitle = strategyAwardRes.awardTitle
        strategyAwardEntity.awardSubtitle = strategyAwardRes.awardSubtitle
        strategyAwardEntity.awardCount = strategyAwardRes.awardCount
        strategyAwardEntity.awardCountSurplus = strategyAwardRes.awardCountSurplus
        strategyAwardEntity.awardRate = strategyAwardRes.awardRate
        strategyAwardEntity.sort = strategyAwardRes.sort
        // 缓存结果
        await this.redisService.setValue(cacheKey, strategyAwardEntity);

        return strategyAwardEntity;
    }

    async queryStrategyRuleValue(strategyId: number, ruleModel: string, awardId?: number): Promise<string> {
        const strategyRule:StrategyRulePO = new StrategyRulePO();
        strategyRule.strategyId = strategyId;
        strategyRule.awardId = awardId;
        strategyRule.ruleModel = ruleModel;
        return this.strategyRuleDao.queryStrategyRuleValue(strategyRule);
    }


    async queryStrategyAwardRuleModelVO(strategyId: number, awardId: number): Promise<StrategyAwardRuleModelVO> {
        const strategyAward:StrategyAwardPO = new StrategyAwardPO();
        strategyAward.strategyId = strategyId;
        strategyAward.awardId = awardId;
        const ruleModels:string = await this.strategyAwardDao.queryStrategyAwardRuleModels(strategyAward);
        if(!ruleModels){
            return null
        }
        return {ruleModels};
    }

    async queryRuleTreeVOByTreeId(treeId: string):Promise<RuleTreeVO> {
        // 优先从缓存获取
        const cacheKey:string = AppConstants.RedisKey.RULE_TREE_VO_KEY + treeId;
        const ruleTreeVOCache:RuleTreeVO = await this.redisService.getValue(cacheKey);
        if (null != ruleTreeVOCache) {
            ruleTreeVOCache.treeNodeMap = new Map(Object.entries(ruleTreeVOCache.treeNodeMap))
            //todo
            return ruleTreeVOCache;
        }

        // 从数据库获取
        const ruleTree:RuleTreePO = await this.ruleTreeDao.queryRuleTreeByTreeId(treeId);
        const ruleTreeNodes:RuleTreeNodePO[] =await this.ruleTreeNodeDao.queryRuleTreeNodeListByTreeId(treeId);
        const ruleTreeNodeLines:RuleTreeNodeLinePO[] = await this.ruleTreeNodeLineDao.queryRuleTreeNodeLineListByTreeId(treeId);

        // 1. tree node line 转换Map结构
        const ruleTreeNodeLineMap:Map<string, RuleTreeNodeLineVO[]> = new Map();

        for (let ruleTreeNodeLine of ruleTreeNodeLines) {
            const ruleTreeNodeLineVO = new RuleTreeNodeLineVO();
            ruleTreeNodeLineVO.treeId = ruleTreeNodeLine.treeId;
            ruleTreeNodeLineVO.ruleNodeFrom = ruleTreeNodeLine.ruleNodeFrom;
            ruleTreeNodeLineVO.ruleNodeTo = ruleTreeNodeLine.ruleNodeTo;
            ruleTreeNodeLineVO.ruleLimitType = ruleTreeNodeLine.ruleLimitType as RuleLimitTypeVOEnum;
            ruleTreeNodeLineVO.ruleLimitValue = ruleTreeNodeLine.ruleLimitValue as RuleLogicCheckTypeVOEnum;
            const ruleTreeNodeLineVOS:RuleTreeNodeLineVO[] = ruleTreeNodeLineMap.get(ruleTreeNodeLine.ruleNodeFrom);
            if(ruleTreeNodeLineVOS){
                ruleTreeNodeLineVOS.push(ruleTreeNodeLineVO);
            }else{
                ruleTreeNodeLineMap.set(ruleTreeNodeLine.ruleNodeFrom,[ruleTreeNodeLineVO])
            }
        }

        // 2. tree node 转换为Map结构
        const treeNodeMap:Map<string, RuleTreeNodeVO> = new Map();
        for (let ruleTreeNode of ruleTreeNodes) {
            const ruleTreeNodeVO = new RuleTreeNodeVO();
            ruleTreeNodeVO.treeId = ruleTreeNode.treeId;
            ruleTreeNodeVO.ruleKey = ruleTreeNode.ruleKey;
            ruleTreeNodeVO.ruleDesc = ruleTreeNode.ruleDesc;
            ruleTreeNodeVO.ruleValue = ruleTreeNode.ruleValue;
            ruleTreeNodeVO.treeNodeLineVOList = ruleTreeNodeLineMap.get(ruleTreeNode.ruleKey);
            treeNodeMap.set(ruleTreeNode.ruleKey,ruleTreeNodeVO);
        }
        // 3. 构建 Rule Tree
        const ruleTreeVODB = new RuleTreeVO();
        ruleTreeVODB.treeId = ruleTree.treeId;
        ruleTreeVODB.treeName = ruleTree.treeName;
        ruleTreeVODB.treeDesc = ruleTree.treeDesc;
        ruleTreeVODB.treeRootRuleNode = ruleTree.treeRootRuleKey;
        ruleTreeVODB.treeNodeMap = treeNodeMap;

        await this.redisService.setValue(cacheKey, ruleTreeVODB);
        return ruleTreeVODB;
    }

    async cacheStrategyAwardCount(cacheKey: string, awardCount: number) :Promise<void>{

        const cacheAwardCount:number = await this.redisService.getValue(cacheKey);
        if(cacheAwardCount&&cacheAwardCount!==0) return;
        await this.redisService.setValue(cacheKey,awardCount);

    }

    async subtractionAwardStock(cacheKey: string):Promise<boolean> {
        const surplus = await this.redisService.decrementAtomicLong(cacheKey,1)
        if(surplus < 0){
            await this.redisService.setValue(cacheKey,0);
            return false;
        }
        const lockKey = cacheKey + AppConstants.UNDERLINE + surplus;
        const lock:boolean = await this.redisService.setNx(lockKey)
        if(!lock){
            console.info(`策略奖品库存失败 ${lockKey}`);
        }
        return lock;
    }

    async awardStockConsumeSendQueue(strategyAwardStockKeyVO: StrategyAwardStockKeyVO):Promise<void> {
        const cacheKey = AppConstants.RedisKey.STRATEGY_AWARD_COUNT_QUEUE_KEY;
        await this.redisService.addToArray(cacheKey,strategyAwardStockKeyVO);
    }

    async takeQueueValue():Promise<StrategyAwardStockKeyVO> {
        const cacheKey = AppConstants.RedisKey.STRATEGY_AWARD_COUNT_QUEUE_KEY;
        return await this.redisService.popArray(cacheKey);
    }

    async updateStrategyAwardStock(strategyId: number, awardId: number) {
        const strategyAward:StrategyAwardPO = new StrategyAwardPO();
        strategyAward.strategyId = strategyId;
        strategyAward.awardId = awardId;
        await this.strategyAwardDao.updateStrategyAwardStock(strategyAward);
    }
}
