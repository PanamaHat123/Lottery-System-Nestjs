interface ResponseCode {
    code: string;
    info: string;
}

export type ResponseCodeType = {
    [key:string]: ResponseCode;
}

export const ResponseCode:ResponseCodeType = {

    SUCCESS: { code: "0000", info: "成功" } ,
    UN_ERROR: { code: "0001", info: "未知失败" } ,
    ILLEGAL_PARAMETER: { code: "0002", info: "非法参数" },
    STRATEGY_RULE_WEIGHT_IS_NULL:{code:"ERR_BIZ_001", info:"业务异常，策略规则中 rule_weight 权重规则已适用但未配置"},
    UN_ASSEMBLED_STRATEGY_ARMORY:{code:"ERR_BIZ_002", info:"抽奖策略配置未装配，请通过IStrategyArmory完成装配"}

};

