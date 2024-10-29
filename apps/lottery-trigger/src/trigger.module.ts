import { Module } from '@nestjs/common';
import {DomainModule} from "apps/lottery-domain/src/domain.module";
import {TypesModule} from "apps/lottery-types/src/types.module";
import {DemoController} from "./http/DemoController";
import {UpdateAwardStockJob} from "./job/UpdateAwardStockJob";
import {ApiModule} from "apps/lottery-api/src/api.module";
import {IRaffleController} from "./http/IRaffleController";

const service = [
  UpdateAwardStockJob
]

@Module({
  imports: [DomainModule,TypesModule,ApiModule],
  controllers: [
      DemoController,IRaffleController,

  ],
  providers: [
      ...service,
  ],
})
export class TriggerModule {}
