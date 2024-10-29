
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";

@Entity('strategy_rule', {
    comment: '抽奖策略表',
})
export class StrategyRulePO {
  
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
  public id: number;
            
  @Column({ type: 'int', name: 'strategy_id', comment: '抽奖策略ID'})
  public strategyId: number;

  @Column({ type: 'int', name: 'award_id', comment: '抽奖奖品ID【规则类型为策略，则不需要奖品ID'})
  public awardId: number;

  @Column({ type: 'int', name: 'rule_type', comment: '抽象规则类型；1-策略规则、2-奖品规则'})
  public ruleType: number;

  @Column({ type: 'varchar', name: 'rule_model', comment: '抽奖规则类型【rule_random - 随机值计算、rule_lock - 抽奖几次后解锁、rule_luck_award - 幸运奖(兜底奖品)】'})
  public ruleModel: string;

  @Column({ type: 'varchar', name: 'rule_value', comment: '抽奖规则值'})
  public ruleValue: string;

  @Column({ type: 'varchar', name: 'rule_desc', comment: '抽奖规则描述'})
  public ruleDesc: string;

  @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
  public createTime: ConvertDate;

  @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
  public updateTime: ConvertDate;

}
    