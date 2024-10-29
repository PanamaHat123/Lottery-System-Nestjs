import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";

@Entity('rule_tree_node', {
    comment: '规则树节点',
})
export class RuleTreeNodePO {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
    id: number;

    @Column({ type: 'varchar', name: 'tree_id', comment: '规则树ID'})
    treeId: string;

    @Column({ type: 'varchar', name: 'rule_key', comment: '规则Key'})
    ruleKey: string;

    @Column({ type: 'varchar', name: 'rule_desc', comment: '规则描述'})
    ruleDesc: string;

    @Column({ type: 'varchar', name: 'rule_value', comment: '规则比值'})
    ruleValue: string;

    @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
    createTime: ConvertDate;

    @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
    updateTime: ConvertDate;

}