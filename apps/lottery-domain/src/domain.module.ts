import { Module } from '@nestjs/common';
import {InfrastructureModule} from "apps/lottery-infrastructure/src/infrastructure.module";
import {TypesModule} from "apps/lottery-types/src/types.module";
import {TestService} from "./strategy/service/TestService";
import {StrategyArmoryDispatch} from "./strategy/service/armory/StrategyArmoryDispatch";
import {DefaultRaffleStrategy} from "./strategy/service/raffle/DefaultRaffleStrategy";
import {DefaultChainFactory} from "./strategy/service/rule/chain/factory/DefaultChainFactory";
import {BlackListLogicChain} from "./strategy/service/rule/chain/impl/BlackListLogicChain";
import {DefaultLogicChain} from "./strategy/service/rule/chain/impl/DefaultLogicChain";
import {RuleWeightLogicChain} from "./strategy/service/rule/chain/impl/RuleWeightLogicChain";
import {DefaultTreeFactory} from "./strategy/service/rule/tree/factory/DefaultTreeFactory";
import {RuleLockLogicTreeNode} from "./strategy/service/rule/tree/impl/RuleLockLogicTreeNode";
import {RuleLuckAwardLogicTreeNode} from "./strategy/service/rule/tree/impl/RuleLuckAwardLogicTreeNode";
import {RuleStockLogicTreeNode} from "./strategy/service/rule/tree/impl/RuleStockLogicTreeNode";
import {RaffleFlowService} from "./strategy/service/raffle/RaffleFlowService";



const service = [
    TestService,StrategyArmoryDispatch,DefaultRaffleStrategy,DefaultChainFactory,BlackListLogicChain,
    DefaultLogicChain,RuleWeightLogicChain,DefaultTreeFactory,RuleLockLogicTreeNode,RuleLuckAwardLogicTreeNode,
    RuleStockLogicTreeNode,RaffleFlowService
]

@Module({
  imports: [InfrastructureModule,TypesModule],
  controllers: [],
  providers: [
      ...service,
  ],
  exports:[
      ...service,
  ]
})
export class DomainModule {}
