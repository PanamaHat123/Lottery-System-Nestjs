import { RedisModule } from "@nestjs-modules/ioredis";
import config from "config";


export default RedisModule.forRoot({
    ...config['data'].redis,
  })