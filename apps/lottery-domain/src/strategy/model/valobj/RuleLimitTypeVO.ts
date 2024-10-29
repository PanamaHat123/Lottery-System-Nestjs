
export type RuleLimitTypeVOEnum = "EQUAL"|"GT"|"LT"|"GE"|"LE"|"ENUM"

export class RuleLimitTypeVO {
    private static mapping = {
        "EQUAL":{code:1,info:"等于"},
        "GT":{code:2,info:"大于"},
        "LT":{code:3,info:"小于"},
        "GE":{code:4,info:"大于&等于"},
        "LE":{code:5,info:"小于&等于"},
        "ENUM":{code:6,info:"枚举"},
    }
    static EQUAL:RuleLimitTypeVOEnum = "EQUAL"; //等于
    static GT:RuleLimitTypeVOEnum = "GT"; //大于
    static LT:RuleLimitTypeVOEnum = "LT"; //小于
    static GE:RuleLimitTypeVOEnum = "GE"; //大于&等于
    static LE:RuleLimitTypeVOEnum = "LE"; //小于&等于
    static ENUM:RuleLimitTypeVOEnum = "ENUM"; //枚举

    public static getVO(key:RuleLimitTypeVOEnum){
        return RuleLimitTypeVO.mapping[key];
    }

}