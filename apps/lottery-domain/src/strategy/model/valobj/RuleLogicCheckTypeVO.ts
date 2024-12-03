
export type RuleLogicCheckTypeVOEnum = "ALLOW" | "TAKE_OVER";


export class RuleLogicCheckTypeVO{
    static mapping = {
        "ALLOW":{code:"0000",info:"放行；执行后续的流程，不受规则引擎影响",name:"ALLOW"},
        "TAKE_OVER":{code:"0001",info:"接管；后续的流程，受规则引擎执行结果影响",name:"TAKE_OVER"}
    }
    // static ALLOW:RuleLogicCheckTypeVOEnum={code:"0000",info:"放行；执行后续的流程，不受规则引擎影响"};
    // static TAKE_OVER:RuleLogicCheckTypeVOEnum={code:"0001",info:"接管；后续的流程，受规则引擎执行结果影响"};

    static ALLOW:RuleLogicCheckTypeVOEnum="ALLOW";
    static TAKE_OVER:RuleLogicCheckTypeVOEnum="TAKE_OVER";

    public static getVO(key:RuleLogicCheckTypeVOEnum){
        return RuleLogicCheckTypeVO.mapping[key];
    }

}