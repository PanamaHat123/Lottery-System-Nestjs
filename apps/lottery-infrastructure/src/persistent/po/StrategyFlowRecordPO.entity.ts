import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";


@Entity('strategy_flow_record', {
    comment: '策略执行流程表',
})
export class StrategyFlowRecordPO {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
    public id: number;

    @Column({ type: 'varchar', name: 'user_id', comment: '用户ID'})
    public userId: string;

    @Column({ type: 'int', name: 'strategy_id', comment: '抽奖策略ID'})
    public strategyId: number;

    @Column({ type: 'varchar', name: 'order_id', comment: ''})
    public orderId: string;

    @Column({ type: 'int', name: 'award_id', comment: '抽奖奖品ID'})
    public awardId: number;

    @Column({ type: 'varchar', name: 'node_desc', comment: ''})
    public nodeDesc: string;

    @Column({ type: 'varchar', name: 'process_type', comment: ''})
    public processType: string;

    @Column({ type: 'varchar', name: 'chain_process_result', comment: ''})
    public chainProcessResult: string;

    @Column({ type: 'varchar', name: 'tree_process_result', comment: ''})
    public treeProcessResult: string;

    @Column({ type: 'varchar', name: 'rule_limit_value', comment: ''})
    public ruleLimitValue: string;

    @Column({ type: 'varchar', name: 'current_node', comment: ''})
    public currentNode: string;


    @Column({ type: 'varchar', name: 'next_node', comment: ''})
    public nextNode: string;


    @Column({ type: 'varchar', name: 'tree_id', comment: ''})
    public treeId: string;


    @Column({ type: 'int', name: 'head', comment: ''})
    public head: number;


    @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
    public createTime: ConvertDate;

    @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
    public updateTime: ConvertDate;
}