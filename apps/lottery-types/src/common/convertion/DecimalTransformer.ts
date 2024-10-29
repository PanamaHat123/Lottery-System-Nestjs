import { ValueTransformer } from 'typeorm';
import {ConvertDate} from "./ConvertDate";
import {Decimal} from "decimal.js";

export class DecimalTransformer implements ValueTransformer {
  to(value: any): Decimal {
    return value;
  }

  from(value: string): Decimal {
    return new Decimal(value);
  }
}
