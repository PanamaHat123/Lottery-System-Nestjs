import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";

@Entity('rule_tree_node_line', {
    comment: '规则树节点',
})
export class RuleTreeNodeLinePO {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
    id: number;

    @Column({ type: 'varchar', name: 'tree_id', comment: '规则树ID'})
    treeId: string;

    @Column({ type: 'varchar', name: 'rule_node_from', comment: '规则Key节点 From'})
    ruleNodeFrom: string;

    @Column({ type: 'varchar', name: 'rule_node_to', comment: '规则Key节点 To'})
    ruleNodeTo: string;

    @Column({ type: 'varchar', name: 'rule_limit_type', comment: '限定类型；1:=;2:>;3:<;4:>=;5<=;6:enum[枚举范围]'})
    ruleLimitType: string;

    @Column({ type: 'varchar', name: 'rule_limit_value', comment: '限定值（到下个节点）'})
    ruleLimitValue: string;

    @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
    createTime: ConvertDate;

    @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
    updateTime: ConvertDate;

}