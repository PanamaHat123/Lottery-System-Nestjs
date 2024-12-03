import {Injectable} from "@nestjs/common";
import {DefaultTreeFactory, TreeActionEntity} from "../factory/DefaultTreeFactory";
import {AbstractLogicTreeNode} from "../AbstractLogicTreeNode";
import {RuleLogicCheckTypeVO} from "../../../../model/valobj/RuleLogicCheckTypeVO";


@Injectable()
export class RuleLockLogicTreeNode extends AbstractLogicTreeNode{

    public userRaffleCount:number = 1;

    constructor(
        private readonly defaultTreeFactory:DefaultTreeFactory
    ) {
        super(defaultTreeFactory);
    }


    async logic(userId: string, strategyId: number, awardId: number, ruleValue: string):  Promise<TreeActionEntity> {
        console.info(`规则过滤-次数锁-进入 userId: ${userId} strategyId: ${strategyId} awardId: ${awardId}`);
        let raffleCount:number = 0;
        let awardRaffleCountMap = {}
        try {
           const  split =  ruleValue.split(" ");
            for (let awardConfig of split) {
                const awardRuleLockConfig = awardConfig.split(":");
                awardRaffleCountMap[awardRuleLockConfig[0]] = +awardRuleLockConfig[1];
            }
        } catch (e) {
            throw new Error("规则过滤次数异常 ruleValue="+ruleValue+" 配置不正常");
        }
        if(awardRaffleCountMap[awardId]){
            raffleCount = awardRaffleCountMap[awardId]
        }

        //抽奖次数达到
        if(this.userRaffleCount >= raffleCount ) {
            console.info(`规则过滤-次数锁-放行 userId: ${userId} strategyId: ${strategyId} awardId: ${awardId} CheckType：${RuleLogicCheckTypeVO.ALLOW}`);
            const treeActionEntity = new TreeActionEntity();
            treeActionEntity.ruleLogicCheckType = RuleLogicCheckTypeVO.ALLOW;
            treeActionEntity.nodeDesc = "次数锁: 用户抽奖次数: "+this.userRaffleCount+" ,已达到, 规则次数: "+raffleCount+"; 奖品id："+awardId
            return treeActionEntity;
        }
        //抽奖次数未达到
        console.info("用户抽奖次数未达到");
        console.info(`规则过滤-次数锁-接管 userId: ${userId} strategyId: ${strategyId} awardId: ${awardId} CheckType：${RuleLogicCheckTypeVO.TAKE_OVER}`);
        const treeActionEntity = new TreeActionEntity();
        treeActionEntity.ruleLogicCheckType = RuleLogicCheckTypeVO.TAKE_OVER;
        treeActionEntity.nodeDesc = "次数锁: 用户抽奖次数: "+this.userRaffleCount+" ,未达到, 规则次数: "+raffleCount+"; 奖品id："+awardId
        return treeActionEntity;
    }

    ruleName(): string {
        return "rule_lock";
    }

}