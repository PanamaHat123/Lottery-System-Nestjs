import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { TriggerModule } from 'apps/lottery-trigger/src/trigger.module';
import { InfrastructureModule } from 'apps/lottery-infrastructure/src/infrastructure.module';
import RedisDefault from "./config/redisConfig";
import TypeORMDefault from './config/typeOrm/typeORMConfig';
import {AsyncLocalStorageInterceptor} from "./config/asyncStore/AsyncLocalStorageInterceptor";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {CustomLogger} from "./config/CustomLogger";

@Module({
  imports: [
      TriggerModule,InfrastructureModule,RedisDefault,TypeORMDefault
  ],
  controllers: [],
  providers: [
      {
          provide:APP_INTERCEPTOR,
          useClass:AsyncLocalStorageInterceptor
      },
      {
          provide: 'Logger',
          useClass: CustomLogger,
      },
  ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {

    }

}
