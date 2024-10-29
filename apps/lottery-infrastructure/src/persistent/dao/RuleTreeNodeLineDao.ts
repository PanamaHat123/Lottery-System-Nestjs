import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RuleTreePO} from "../po/RuleTreePO.entity";
import {RuleTreeNodePO} from "../po/RuleTreeNodePO.entity";
import {RuleTreeNodeLinePO} from "../po/RuleTreeNodeLinePO.entity";

@Injectable()
export class RuleTreeNodeLineDao {

    constructor(
        @InjectRepository(RuleTreeNodeLinePO)
        private readonly ruleTreeNodeLinePORepository: Repository<RuleTreeNodeLinePO>,
    ) {
    }

    async queryRuleTreeNodeLineListByTreeId(treeId:string):Promise<RuleTreeNodeLinePO[]>{
        const ruleTreeNodeLinePOS = await this.ruleTreeNodeLinePORepository.find({
            where:{
                treeId:treeId
            }
        })
        return ruleTreeNodeLinePOS
    }


}
