import {StrategyPO} from "apps/lottery-infrastructure/src/persistent/po/StrategyPO.entity";
import {StrategyEntity} from "../model/entity/StrategyEntity";
import {StrategyAwardEntity} from "../model/entity/StrategyAwardEntity";
import {StrategyRuleEntity} from "../model/entity/StrategyRuleEntity";
import {StrategyAwardRuleModelVO} from "../model/valobj/StrategyAwardRuleModelVO";
import {RuleTreeVO} from "../model/valobj/RuleTreeVO";
import {StrategyAwardStockKeyVO} from "../model/valobj/StrategyAwardStockKeyVO";


export interface IStrategyRepository {

    queryStrategyEntityByStrategyId(strategyId: number): Promise<StrategyEntity>;

    queryStrategyAwardList(strategyId: number): Promise<StrategyAwardEntity[]>;

    queryStrategyRule(strategyId: number, ruleModel: string, awardId?: number): Promise<StrategyRuleEntity>;

    storeStrategyAwardSearchTables(key: string, size: number, shuffleStrategyAwardSearchRateTables: Map<number, number>): Promise<void>;

    getRateRange(strategyId: string): Promise<number>;

    getStrategyAwardAssemble(key: string, secureRandomInt: number): Promise<number>;

    queryStrategyAwardEntity(strategyId: number, awardId: number): Promise<StrategyAwardEntity>;

    queryStrategyRuleValue(strategyId: number, ruleModel: string, awardId?: number): Promise<string>;

    queryStrategyAwardRuleModelVO(strategyId: number, awardId: number): Promise<StrategyAwardRuleModelVO>;

    queryRuleTreeVOByTreeId(treeId: string):Promise<RuleTreeVO>;

    cacheStrategyAwardCount(cacheKey: string, awardCount: number) :Promise<void>;

    subtractionAwardStock(cacheKey: string):Promise<boolean> ;

    awardStockConsumeSendQueue(strategyAwardStockKeyVO: StrategyAwardStockKeyVO):Promise<void>;

}