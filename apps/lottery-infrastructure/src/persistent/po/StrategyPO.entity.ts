
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";

@Entity('strategy', {
    comment: '抽奖策略表',
})
export class StrategyPO {
  
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
  public id: number;
            
  @Column({ type: 'int', name: 'strategy_id', comment: '抽奖策略ID'})
  public strategyId: number;

  @Column({ type: 'varchar', name: 'strategy_desc', comment: '抽奖策略描述'})
  public strategyDesc: string;

  @Column({ type: 'varchar', name: 'rule_models', comment: '策略模型'})
  public ruleModels: string;

  @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
  public createTime: ConvertDate;

  @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
  public updateTime: ConvertDate;

}
    