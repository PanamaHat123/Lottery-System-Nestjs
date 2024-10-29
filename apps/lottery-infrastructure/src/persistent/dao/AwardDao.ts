import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AwardPO} from "../po/AwardPO.entity";

@Injectable()
export class AwardDao {

    constructor(
        @InjectRepository(AwardPO)
        private readonly awardPORepository: Repository<AwardPO>,
    ) {
    }

    async queryAwardList():Promise<AwardPO[]>{
        const AwardPOs = await this.awardPORepository.find()
        return AwardPOs
    }


}
