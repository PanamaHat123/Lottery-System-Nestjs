import { NestFactory } from '@nestjs/core';
import initConfig from "./config/yamlConfig";
import { AppModule } from './app.module';
import {CustomLogger} from "./config/CustomLogger";
import {decimalCofig} from "./config/DecimalCofig";


async function bootstrap() {
  beforeInit()
  const app = await NestFactory.create(AppModule,{
    logger: new CustomLogger()
  });
  app.enableCors()
  let port = initConfig.server.port ?? 3000
  await app.listen(port);
  console.log(`***********项目正常启动在 ${port}端口`)
}
bootstrap();


function beforeInit() {// DEV ENV  need copy file to dist package

  //配置Decimal
  decimalCofig()

}