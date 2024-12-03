"use client";

import {LuckyWheelPage} from "@/app/components/lucky/lucky-wheel-page";
import {LuckyGridPage} from "@/app/components/lucky/lucky-grid-page";
import dynamic from "next/dynamic";
import {useEffect, useRef, useState} from "react";
import {StrategyTreeUI} from "@/app/components/StrategyTreeUI";

const StrategyArmoryButton = dynamic(async()=>(await import("./components/StrategyArmory")).StrategyArmory)

export default function Home() {
    const [strategyId,setStrategyId] =  useState<number>(10006)
    const [orderId,setOrderId] =  useState<string>("")
    const [userId,setUserId] =  useState<string>("yy")
    const randomOrderId = ()=>{
        setOrderId((+new Date()+"").slice(5))
    }
    useEffect(()=>{
        randomOrderId();
    },[])
    const childRef = useRef(null);
    const showFlowUI = ()=>{
        // 调用子组件的方法
        if (childRef.current) {
            childRef.current.show();
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* 头部文案 */}
            <header className="text-3xl font-bold text-center text-gray-800 my-8">
                营销平台 - 抽奖展示
            </header>
            <div>
                <span>策略ID: </span>
                <input className="mb-5 " value={strategyId} onChange={e=>setStrategyId(+e.target.value)}/>
                <br/>
                <span>userID: </span><input className="mb-5 " value={userId} onChange={e=>setUserId(e.target.value)}/>
                <br/>
                <span>orderID: </span><input className="mb-5 " value={orderId} onChange={e=>setOrderId(e.target.value)}/>
                <button onClick={randomOrderId}>random</button>
            </div>
            {/* 装配抽奖 */}
            <StrategyArmoryButton strategyId={strategyId}/>

            {/* 中间的两个div元素 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/1 p-6 bg-white shadow-lg rounded-lg">
                    <div className="text-gray-700">
                        <LuckyWheelPage randomOrderId={randomOrderId} showUI={showFlowUI}  strategyId={strategyId} userId={userId} orderId={orderId}/>
                    </div>
                </div>
                <StrategyTreeUI ref={childRef} orderId={orderId}/>
                {/*<div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">*/}
                {/*    <div className="text-gray-700">*/}
                {/*        <LuckyGridPage/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

        </div>
    );
}
