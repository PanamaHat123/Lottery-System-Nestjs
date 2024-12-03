// 请求地址
const apiHostUrl = process.env.API_HOST_URL ? process.env.API_HOST_URL : "https://console-mock.apipost.cn/mock/6afa907d-6678-45e2-b867-032a11090abd";

/**
 * 装配抽奖
 * @param strategyId
 */
export const strategyArmory = (strategyId?: number) => {
    return fetch(`${apiHostUrl}/api/v1/raffle/strategy/strategy_armory?strategyId=${strategyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 查询抽奖奖品列表
 * @param strategyId 策略ID
 */
export const queryRaffleAwardList = (strategyId?: number) => {
    try {
        return fetch(`${apiHostUrl}/api/v1/raffle/strategy/query_raffle_award_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                strategyId: strategyId
            })
        });
    } catch (error) {
        return fetch("{\n" +
            "    \"code\": \"0001\",\n" +
            "    \"info\": \"调用失败\",\n" +
            "    \"data\": [\n" +
            "}");
    }
}

/**
 * 随机抽奖接口
 * @param strategyId 策略ID
 *
 * {
 * 	"code": "0000",
 * 	"info": "调用成功",
 * 	"data": {
 * 	    "awardIndex": 1, // awardIndex 获得的是列表中第几个奖品，方便测试使用
 * 		"awardId": 535,
 * 		"awardTitle": "一部手机"
 * 	}
 * }
 */
export const randomRaffle = (strategyId?: number,userId?:string,orderId?:string) => {
    try {
        return fetch(`${apiHostUrl}/api/v1/raffle/strategy/random_raffle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                strategyId: strategyId,
                userId:userId,
                orderId:orderId
            })
        })
    } catch (error) {
        return fetch("{\n" +
            "    \"code\": \"0001\",\n" +
            "    \"info\": \"调用失败\",\n" +
            "    \"data\": [\n" +
            "}");
    }
}
/**
 * 查询规则树
 * @param treeId
 */
export const strategyRuleTree = (treeId?: string) => {
    return fetch(`${apiHostUrl}/api/v1/raffle/strategy/rule_tree?treeId=${treeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 查询抽奖流程记录，用于流程可视化
 * @param treeId
 */
export const raffleFlowAndStrategy = (orderId?: string) => {
    return fetch(`${apiHostUrl}/api/v1/raffle/strategy/raffle_flow?orderId=${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}