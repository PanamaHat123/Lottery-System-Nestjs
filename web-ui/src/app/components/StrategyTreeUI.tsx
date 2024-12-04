import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react'
import * as echarts from 'echarts';
import {raffleFlowAndStrategy, strategyRuleTree} from "@/apis";

export const StrategyTreeUI =  forwardRef(({orderId},ref)=> {

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
                        // return data.name + "\r\n" + data.desc
                        return data.name
                    },
                },
                tooltip: {
                    formatter: (params) => {
                        if (params.dataType == "node") {
                            //节点上的提示
                            const data = params.data
                            return data.desc || "无提示"
                        } else if (params.dataType == "edge") {
                            //线上的提示
                            const lineData = params.data
                            return lineData.pathMessage
                        }
                    },
                    padding: 20,
                    textStyle: {
                        width: 300,
                        height: 300
                    }
                },
                data: [],
                links: [],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    }
    const chartRef = useRef(null);
    const [showOrderId,setShowOrderId] = useState<string>("");
    useImperativeHandle(ref,()=>{
        return {
            show
        }
    })

    const show = (showOrderId?:any)=> {
        raffleFlowAndStrategy(showOrderId||orderId).then(async (result) => {
            const {code, info, data} = await result.json();
            console.log("flowData", data)
            const [nodeList, lineList] = process(data)
            option.series[0].data = nodeList;
            option.series[0].links = lineList;
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(chartRef.current);
            // flowEchartEntity.current = myChart
            // 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成
            myChart.setOption(option as any);
            // flowEchartEntity.current.setOption(option as any);
        })
    }
    return (<div>
        <div>
            orderId: <input  className="mb-5 " value={showOrderId} onChange={e=>setShowOrderId(e.target.value)} />--
            <button onClick={()=>show(showOrderId)}>查询</button>
        </div>
        <div ref={chartRef} style={{width: '700px', height: '600px'}}/>
    </div>)
})

let x = 150;
let y = 200;
let gloalLineLabel = {
    show: true,
    formatter(params) {
        const linkData = params.data
        return linkData.type
    },
    fontSize: 12
}

function assembleChain(chain) {
    const lineList = []
    const nodeList = []
    let lastLine = null;
    chain.forEach(chainNode => {
        x += 100;
        y += 50;
        let node = {
            name: chainNode.ruleModel,
            desc: chainNode.ruleDesc,
            bgColor: "gray",
            x: x,
            y: y
        }
        if (lastLine) {
            lastLine.target = chainNode.ruleModel;
        }
        let currentLine = {
            source: chainNode.ruleModel,
            target: undefined,
            label: gloalLineLabel,
            type:"ALLOW"
        }
        lastLine = currentLine;
        lineList.push(currentLine)
        nodeList.push(node);
    })
    return [nodeList, lineList];
}

function assembleTree(tree: any) {
    let deep = 0;
    let midX = x;
    const treeNodeList = []
    const treeLineList = []
    //所有的treeNode节点
    const treeNodeMap = tree.treeNodeMap;
    const treeRootRuleNodeName = tree.treeRootRuleNode;
    const treeNodeHead = treeNodeMap[treeRootRuleNodeName]
    if (treeNodeHead) {
        y += 100;
        let node = {
            name: treeNodeHead.ruleKey,
            desc: treeNodeHead.ruleDesc,
            ruleValue: treeNodeHead.ruleValue,
            bgColor: "gray",
            x: x,
            y: y
        }
        treeNodeList.push(node)
    }
    //处理子节点
    assembleTreeChildNode(treeNodeHead, treeNodeMap)


    //处理连线
    getAllLine(treeNodeHead, treeLineList);

    function assembleTreeChildNode(treeNodeHead, treeNodeMap) {
        deep++;
        y += 100;
        const treeNodeLineList = treeNodeHead.treeNodeLineList;
        if (!treeNodeLineList || treeNodeLineList.length == 0) return;
        let i = 0;
        let tempNodeList = []
        for (let treeNodeLine of treeNodeLineList) {
            i++;
            const level = deep;
            let levelY = y
            const name = treeNodeLine.ruleNodeTo;
            const existNode = treeNodeList.find(item => item.name == name);
            if (existNode) {
                //node已经存在
            } else {
                const treeNode = treeNodeMap[name];
                let node = {
                    name: treeNode.ruleKey,
                    desc: treeNode.ruleDesc,
                    ruleValue: treeNode.ruleValue,
                    bgColor: "gray",
                    x: midX - level * 200 + i * 140,
                    y: levelY
                }
                treeNodeList.push(node)
                tempNodeList.push(node)
            }
        }
        for (let node of tempNodeList) {
            assembleTreeChildNode(node, treeNodeMap);
        }
    }

    function getAllLine(treeNodeHead, allLine = []) {
        const treeNodeLineList = treeNodeHead.treeNodeLineList;
        if (!treeNodeLineList || treeNodeLineList.length == 0) return;

        for (let line of treeNodeLineList) {

            let lineNode = {
                source: line.ruleNodeFrom,
                target: line.ruleNodeTo,
                type: line.ruleLimitValue,
                label: gloalLineLabel
            }
            //已处理过的连线  防止死递归
            if (allLine.find(item => (item.source == lineNode.source && item.target == lineNode.target))) {
                continue;
            }
            const name = line.ruleNodeTo;
            const treeNode = treeNodeMap[name];
            allLine.push(lineNode);
            getAllLine(treeNode, allLine)
        }
        return allLine;
    }

    return [treeNodeList, treeLineList]
}

function processFlow(strategyRaffleFlowRecords: any, nodeList: any[], lineList: any[]) {
    const chainRecords = strategyRaffleFlowRecords.filter(item => item.processType == "chain")
    const treeRecords = strategyRaffleFlowRecords.filter(item => item.processType == "tree")
    const nodeMap = {}
    nodeList.forEach(node => {
        nodeMap[node.name] = node;
    })
    const lineMap = {}
    lineList.forEach(line => {
        lineMap[line.source + line.target] = line;
    })
    //处理责任链
    chainRecords.forEach(chainNodeRecord => {
        //处理节点
        const nodeName = chainNodeRecord.currentNode;
        nodeMap[nodeName].desc = chainNodeRecord.nodeDesc;

        //是否接管，标为红色
        if(chainNodeRecord.chainProcessResult == "TAKE_OVER"){
            nodeMap[nodeName].bgColor = "red";
            //接管后-不处理当前连线
            return
        }else{
            nodeMap[nodeName].bgColor = "green";
        }

        //处理线
        let key = chainNodeRecord.currentNode + chainNodeRecord.nextNode;
        if (lineMap[key]) {
            //存在这跟连线
            let line = lineMap[key];
            // line.type = chainNodeRecord.treeProcessResult;
            line.pathMessage = chainNodeRecord.treeProcessResult;
            line.lineStyle = {
                color: "green",
                width: 2
            }
        }

    })
    //处理抉择树
    if (treeRecords && treeRecords.length > 0) {
        const headRecord = treeRecords.find(item=>item.head == 1);
        //责任链连接抉择树
        let key = "rule_default" + headRecord.currentNode;
        if (lineMap[key]) {
            lineMap[key].lineStyle = {
                color: "green",
                width: 2
            }
        }

        //有进入奖品抉择树
        treeRecords.forEach(treeRecord => {
            //处理节点
            const nodeName = treeRecord.currentNode;
            nodeMap[nodeName].desc = treeRecord.nodeDesc;

            //抉择树最后一个节点标红
            if(!treeRecord.nextNode){
                nodeMap[nodeName].bgColor = "yellow";
            }else{
                nodeMap[nodeName].bgColor = "green";
            }

            //处理连线
            let key = treeRecord.currentNode + treeRecord.nextNode;
            if (lineMap[key]) {
                //存在这跟连线
                let line = lineMap[key];
                line.type = treeRecord.treeProcessResult;
                line.pathMessage = treeRecord.nodeDesc;
                line.lineStyle = {
                    color: "green",
                    width: 2
                }
            }
        })


    }
}

function process(data: any) {
    const chain = data.chain;
    const nodeList = []
    const lineList = []

    //责任链
    const [chainNodeList, chainLineList] = assembleChain(chain);
    nodeList.push(...chainNodeList)
    lineList.push(...chainLineList)
    let lastLine = chainLineList.pop()

    // 抉择树
    const tree = data.tree;
    if (tree) {
        const [treeNodeList, treeLineList] = assembleTree(tree)
        nodeList.push(...treeNodeList)
        lineList.push(...treeLineList)
        const treeHead = treeNodeList.shift()
        lastLine.target = treeHead.name
    }

    //处理实际流程
    const strategyRaffleFlowRecords = data.strategyRaffleFlowRecords
    processFlow(strategyRaffleFlowRecords, nodeList, lineList)

    return [nodeList, lineList]
}

