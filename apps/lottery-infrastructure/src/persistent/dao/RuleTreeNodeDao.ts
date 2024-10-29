import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RuleTreePO} from "../po/RuleTreePO.entity";
import {RuleTreeNodePO} from "../po/RuleTreeNodePO.entity";

@Injectable()
export class RuleTreeNodeDao {

    constructor(
        @InjectRepository(RuleTreeNodePO)
        private readonly ruleTreeNodePORepository: Repository<RuleTreeNodePO>,
    ) {
    }

    async queryRuleTreeNodeListByTreeId(treeId:string):Promise<RuleTreeNodePO[]>{
        const ruleTreeNodePOs = await this.ruleTreeNodePORepository.find({
            where:{
                treeId:treeId
            }
        })
        return ruleTreeNodePOs
    }


}
