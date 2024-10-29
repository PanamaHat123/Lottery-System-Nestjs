"use client";

import {LuckyWheelPage} from "@/app/components/lucky/lucky-wheel-page";
import {LuckyGridPage} from "@/app/components/lucky/lucky-grid-page";
import dynamic from "next/dynamic";
import {useState} from "react";

const StrategyArmoryButton = dynamic(async()=>(await import("./components/StrategyArmory")).StrategyArmory)

export default function Home() {
    const [strategyId,setStrategyId] =  useState<number>(1)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* 头部文案 */}
            <header className="text-3xl font-bold text-center text-gray-800 my-8">
                营销平台 - 抽奖展示
            </header>
            <div>
                <span>策略ID: </span>
                <input className="mb-5 " value={strategyId} onChange={e=>setStrategyId(+e.target.value)}/>
            </div>
            {/* 装配抽奖 */}
            <StrategyArmoryButton strategyId={strategyId}/>

            {/* 中间的两个div元素 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-1/1 p-6 bg-white shadow-lg rounded-lg">
                    <div className="text-gray-700">
                        <LuckyWheelPage strategyId={strategyId}/>
                    </div>
                </div>
                {/*<div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">*/}
                {/*    <div className="text-gray-700">*/}
                {/*        <LuckyGridPage/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

        </div>
    );
}
