
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";
import Decimal from "decimal.js";
import {DecimalTransformer} from "apps/lottery-types/src/common/convertion/DecimalTransformer";

@Entity('strategy_award', {
    comment: '策略奖品表',
})
export class StrategyAwardPO {
  
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
  public id: number;
            
  @Column({ type: 'int', name: 'strategy_id', comment: '抽奖策略ID'})
  public strategyId: number;

  @Column({ type: 'int', name: 'award_id', comment: '抽奖奖品ID'})
  public awardId: number;

  @Column({ type: 'varchar', name: 'award_title', comment: '抽奖奖品标题'})
  public awardTitle: string;

  @Column({ type: 'varchar', name: 'award_subtitle', comment: '抽奖奖品副标题'})
  public awardSubtitle: string;

  @Column({ type: 'int', name: 'award_count', comment: '奖品库存总量'})
  public awardCount: number;

  @Column({ type: 'int', name: 'award_count_surplus', comment: '奖品库存剩余'})
  public awardCountSurplus: number;

  @Column({ type: 'decimal', name: 'award_rate', comment: '奖品中奖概率',transformer:new DecimalTransformer()})
  public awardRate: Decimal;

  @Column({ type: 'varchar', name: 'rule_models', comment: '规则模型，rule配置的模型同步到此表，便于使用'})
  public ruleModels: string;

  @Column({ type: 'int', name: 'sort', comment: '排序'})
  public sort: number;

  @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
  public createTime: ConvertDate;

  @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
  public updateTime: ConvertDate;

}
    