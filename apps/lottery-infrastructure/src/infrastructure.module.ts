import { Module } from '@nestjs/common';
import {RedisService} from "./persistent/redis/RedisService";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StrategyDao} from "./persistent/dao/StrategyDao";
import {StrategyPO} from "./persistent/po/StrategyPO.entity";
import {StrategyRepository} from "./persistent/repository/StrategyRepository";
import {TypesModule} from "apps/lottery-types/src/types.module";
import {StrategyAwardPO} from "./persistent/po/StrategyAwardPO.entity";
import {StrategyAwardDao} from "./persistent/dao/StrategyAwardDao";
import {StrategyRulePO} from "./persistent/po/StrategyRulePO.entity";
import {StrategyRuleDao} from "./persistent/dao/StrategyRuleDao";
import {AwardPO} from "./persistent/po/AwardPO.entity";
import {AwardDao} from "./persistent/dao/AwardDao";
import {RuleTreePO} from "./persistent/po/RuleTreePO.entity";
import {RuleTreeDao} from "./persistent/dao/RuleTreeDao";
import {RuleTreeNodePO} from "./persistent/po/RuleTreeNodePO.entity";
import {RuleTreeNodeDao} from "./persistent/dao/RuleTreeNodeDao";
import {RuleTreeNodeLinePO} from "./persistent/po/RuleTreeNodeLinePO.entity";
import {RuleTreeNodeLineDao} from "./persistent/dao/RuleTreeNodeLineDao";

//数据看实体对象
const po = [
    StrategyPO,StrategyAwardPO,StrategyRulePO,AwardPO,RuleTreePO,RuleTreeNodePO,RuleTreeNodeLinePO
]
// dao
const dao = [
    StrategyDao,StrategyAwardDao,StrategyRuleDao,AwardDao,RuleTreeDao,RuleTreeNodeDao,RuleTreeNodeLineDao
]
// 暴露的服务
const service = [
    RedisService,StrategyRepository
]


@Module({
  imports: [
      TypeOrmModule.forFeature([
          ...po
      ]),
      TypesModule
  ],
  controllers: [],
  providers: [
      ...dao,
      ...service
  ],
  exports:service
})
export class InfrastructureModule {}
