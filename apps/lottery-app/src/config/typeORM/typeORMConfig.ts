import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import config from 'config'

const entitiesPaths = [join(__dirname,'..','..','..','..','**','*.entity.{ts,js}')]
console.log("entitiesPaths: ",entitiesPaths);
const typeOrmConfig ={
    ...config["data"].database
} as any;
export default TypeOrmModule.forRoot({
    ...typeOrmConfig,
    entities: entitiesPaths,
  });