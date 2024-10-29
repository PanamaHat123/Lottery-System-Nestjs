import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RuleTreePO} from "../po/RuleTreePO.entity";

@Injectable()
export class RuleTreeDao {

    constructor(
        @InjectRepository(RuleTreePO)
        private readonly ruleTreePORepository: Repository<RuleTreePO>,
    ) {
    }

    async queryRuleTreeByTreeId(treeId:string):Promise<RuleTreePO>{
        const ruleTreePO = await this.ruleTreePORepository.findOne({
            where:{
                treeId:treeId
            }
        })
        return ruleTreePO
    }


}
