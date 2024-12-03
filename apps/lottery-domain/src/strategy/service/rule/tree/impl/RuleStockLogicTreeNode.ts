import {AbstractLogicTreeNode} from "../AbstractLogicTreeNode";
import {DefaultTreeFactory, TreeActionEntity, TreeStrategyAwardVO} from "../factory/DefaultTreeFactory";
import {Injectable} from "@nestjs/common";
import {StrategyArmoryDispatch} from "../../../armory/StrategyArmoryDispatch";
import {RuleLogicCheckTypeVO} from "../../../../model/valobj/RuleLogicCheckTypeVO";
import {
    StrategyRepository
} from "apps/lottery-infrastructure/src/persistent/repository/StrategyRepository";
import {StrategyAwardStockKeyVO} from "../../../../model/valobj/StrategyAwardStockKeyVO";


@Injectable()
export class RuleStockLogicTreeNode extends AbstractLogicTreeNode {

    constructor(
        private readonly defaultTreeFactory: DefaultTreeFactory,
        private readonly strategyDispatch: StrategyArmoryDispatch,
        private readonly strategyRepository: StrategyRepository,
    ) {
        super(defaultTreeFactory);
    }

    async logic(userId: string, strategyId: number, awardId: number, ruleValue: string): Promise<TreeActionEntity> {

        console.info(`规则过滤-库存扣减-进入 userId: ${userId} strategyId: ${strategyId} awardId: ${awardId}`);

        // 1. 扣减库存
        const status:boolean = await this.strategyDispatch.subtractionAwardStock(strategyId, awardId);

        if(status){
            console.info(`规则过滤-库存扣减-成功 userId: ${userId} strategyId: ${strategyId} awardId: ${awardId} CheckType:${RuleLogicCheckTypeVO.ALLOW}`);
            // 写入延迟队列，延迟消费更新数据库记录。【在trigger的job；UpdateAwardStockJob 下消费队列，更新数据库记录】
            const strategyAwardStockKeyVO = new StrategyAwardStockKeyVO();
            strategyAwardStockKeyVO.strategyId = strategyId;
            strategyAwardStockKeyVO.awardId = awardId;
            await this.strategyRepository.awardStockConsumeSendQueue(strategyAwardStockKeyVO)

            const treeActionEntity = new TreeActionEntity();
            treeActionEntity.ruleLogicCheckType = RuleLogicCheckTypeVO.ALLOW
            const treeStrategyAwardVO = new TreeStrategyAwardVO();
            treeStrategyAwardVO.awardId = awardId;
            treeStrategyAwardVO.awardRuleValue = '';
            treeActionEntity.strategyAwardVO = treeStrategyAwardVO;
            treeActionEntity.nodeDesc = `库存扣减: 库存扣减成功  awardId: ${awardId}`;
            return treeActionEntity;
        }
        console.info(`规则过滤-库存扣减-失败 userId: ${userId} strategyId: ${strategyId} awardId: ${awardId} CheckType:${RuleLogicCheckTypeVO.TAKE_OVER}`);
        const treeActionEntity = new TreeActionEntity();
        treeActionEntity.ruleLogicCheckType = RuleLogicCheckTypeVO.TAKE_OVER
        return treeActionEntity;

    }

    ruleName(): string {
        return "rule_stock";
    }
}