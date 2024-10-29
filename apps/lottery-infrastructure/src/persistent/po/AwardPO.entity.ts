import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {DateTransformer} from "apps/lottery-types/src/common/convertion/DateTransformer";
import {ConvertDate} from "apps/lottery-types/src/common/convertion/ConvertDate";

@Entity('award', {
    comment: '奖品表',
})
export class AwardPO {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键ID' })
    id: number;
    /** 抽奖奖品ID - 内部流转使用 */
    @Column({ type: 'int', name: 'award_id', comment: '抽奖奖品ID'})
    awardId: number;
    /** 奖品对接标识 - 每一个都是一个对应的发奖策略 */
    @Column({ type: 'varchar', name: 'award_key', comment: '奖品对接标识'})
    awardKey: string;
    /** 奖品配置信息 */
    @Column({ type: 'varchar', name: 'award_config', comment: '奖品配置信息'})
    awardConfig: string;
    /** 奖品内容描述 */
    @Column({ type: 'varchar', name: 'award_desc', comment: '奖品内容描述'})
    awardDesc: string;
    /** 创建时间 */
    @Column({ type: 'datetime', name: 'create_time', comment: '创建时间',transformer:new DateTransformer()})
    createTime: ConvertDate;
    /** 更新时间 */
    @Column({ type: 'datetime', name: 'update_time', comment: '更新时间',transformer:new DateTransformer()})
    updateTime: ConvertDate;

}