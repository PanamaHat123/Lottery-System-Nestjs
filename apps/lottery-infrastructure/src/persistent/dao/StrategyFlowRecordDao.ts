import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StrategyPO} from "../po/StrategyPO.entity";
import {Repository} from "typeorm";
import {StrategyFlowRecordPO} from "../po/StrategyFlowRecordPO.entity";

@Injectable()
export class StrategyFlowRecordDao {

    constructor(
        @InjectRepository(StrategyFlowRecordPO)
        private readonly strategyFlowRecordPORepository: Repository<StrategyFlowRecordPO>,
    ) {
    }

    async insert(strategyFlowRecordPO: StrategyFlowRecordPO):Promise<number> {
        const res =  await this.strategyFlowRecordPORepository.insert(strategyFlowRecordPO)
        return 1;
    }

    //查询抉择树id，如果该流程没有经历抉择树，则返回空 有则返回树id
    async selectTreeIdByOrderId(orderId:string):Promise<string>{
        const strategyFlowRecordPO = await this.strategyFlowRecordPORepository
            .createQueryBuilder('strategy_flow_record') // 'strategy_flow_record' 是实体的别名
            .select('strategy_flow_record.tree_id') // 选择 tree_id 列
            .where('strategy_flow_record.order_id = :orderId', { orderId }) // 添加where条件
            .andWhere('strategy_flow_record.tree_id IS NOT NULL') // 添加额外的条件
            .limit(1) // 限制结果数量为1
            .getOne(); // 获取单个结果
        return strategyFlowRecordPO ? strategyFlowRecordPO.treeId : undefined; // 如果查询到结果，则返回tree_id，否则返回undefined

    }

    async queryStrategyFlowRecordList(orderId:string):Promise<StrategyFlowRecordPO[]>{
        const StrategyFlowRecordPOS = await this.strategyFlowRecordPORepository.find({
            where:{
                orderId:orderId
            }
        })
        return StrategyFlowRecordPOS;
    }


}
