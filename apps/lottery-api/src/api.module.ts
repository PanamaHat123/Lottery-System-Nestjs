import { Module } from '@nestjs/common';
import {TypesModule} from "apps/lottery-types/src/types.module";

@Module({
  imports: [TypesModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
