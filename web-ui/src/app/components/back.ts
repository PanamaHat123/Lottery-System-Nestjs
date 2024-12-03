

const option = {
    title: {
        text: '抽奖流程'
    },
    tooltip: {},
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            type: 'graph',
            layout: 'none',
            symbol: "circle",
            symbolSize: 80,
            roam: true,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            itemStyle: {
                color: (params) => {
                    const data = params.data
                    return data.bgColor
                },
            },
            label: {
                show: true,
                formatter: (params) => {
                    const data = params.data
                    return data.name + "\r\n" + data.desc
                },
            },
            tooltip: {
                formatter: (params) => {
                    if (params.dataType == "node") {
                        //节点上的提示
                        const data = params.data
                        return data.jsonData || "aa"
                    } else if (params.dataType == "edge") {
                        //线上的提示
                        const lineData = params.data
                        console.log("线上的提示", lineData)
                        return JSON.stringify(lineData)
                    }
                },
                padding: 20,
                textStyle: {
                    width: 300,
                    height: 300
                }
            },
            data: [
                {
                    name: "rule_backlist",
                    desc: "黑名单",
                    type: "chain",
                    jsonData: "非黑名单",
                    bgColor: "green",
                    x: 200,
                    y: 200
                },
                {
                    name: "rule_weight",
                    desc: "权重",
                    bgColor: "red",
                    type: "chain",
                    jsonData: "权重达标",
                    x: 300,
                    y: 200
                },
                {
                    name: "rule_lock",
                    desc: "限定用户已完成N次抽奖后解锁",
                    jsonData: "当时抽奖次数: 2",
                    bgColor: "green",
                    x: 300,
                    y: 300
                },
                {
                    name: "rule_stock",
                    desc: "库存扣减规则",
                    jsonData: "当时库存: 3",
                    bgColor: "green",
                    x: 200,
                    y: 400
                },
                {
                    name: "rule_luck_award",
                    desc: "兜底奖品随机积分",
                    bgColor: "gray",
                    x: 400,
                    y: 400
                },
            ],
            links: [
                {
                    source: "rule_backlist",
                    target: "rule_weight",
                    lineStyle: {
                        color: "green",
                        width: 2
                    },
                },
                {
                    source: "rule_weight",
                    target: "rule_lock",
                },
                {
                    source: "rule_lock",
                    target: "rule_stock",
                    type: "TAKE_OVER",
                    pathMessage: "抽奖次数大于3",
                    label: {
                        show: true,
                        formatter(params) {
                            const linkData = params.data
                            return linkData.type + "\r\n" + linkData.pathMessage
                        },
                        fontSize: 12,
                        color: "green",
                    },
                    lineStyle: {
                        color: "green",
                        width: 2
                    },
                },
                {
                    source: 'rule_lock',
                    target: "rule_luck_award",
                    type: "ALLOW",
                    pathMessage: "抽奖次数小于等于3",
                    label: {
                        show: true,
                        formatter(params) {
                            const linkData = params.data
                            return linkData.type + "\r\n" + linkData.pathMessage
                        },
                        fontSize: 12
                    },

                },
                {
                    source: 'rule_stock',
                    target: "rule_luck_award",
                    type: "TAKE_OVER",
                    pathMessage: "库存不足",
                    label: {
                        show: true,
                        formatter(params) {
                            const linkData = params.data
                            return linkData.type + "\r\n" + linkData.pathMessage
                        },
                        fontSize: 12
                    },
                },
            ],
            lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
            }
        }
    ]
}