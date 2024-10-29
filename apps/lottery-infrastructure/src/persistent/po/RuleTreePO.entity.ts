import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";

@Entity('rule_tree', {
    comment: '规则树',
})
export class RuleTreePO {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
    id: number;

    @Column({ type: 'varchar', name: 'tree_id', comment: '规则树ID'})
    treeId: string;

    @Column({ type: 'varchar', name: 'tree_name', comment: '规则树名称'})
    treeName: string;

    @Column({ type: 'varchar', name: 'tree_desc', comment: '规则树描述'})
    treeDesc: string;

    @Column({ type: 'varchar', name: 'tree_root_rule_key', comment: '规则根节点'})
    treeRootRuleKey: string;

    @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
    createTime: ConvertDate;
    /** 更新时间 */
    @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
    updateTime: ConvertDate;

}