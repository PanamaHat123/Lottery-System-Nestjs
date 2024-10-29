"use client"

import React, {useState, useRef} from 'react'
// @ts-ignore
import {LuckyGrid} from '@lucky-canvas/react'

/**
 * 大转盘文档：https://100px.net/docs/grid.html
 * @constructor
 */
export function LuckyGridPage() {
    // 背景
    const [blocks] = useState([
        {padding: '10px', background: '#869cfa'}
    ])

    const [prizes] = useState([
        {x: 0, y: 0, fonts: [{text: 'A', top: '35%'}]},
        {x: 1, y: 0, fonts: [{text: 'B', top: '35%'}]},
        {x: 2, y: 0, fonts: [{text: 'C', top: '35%'}]},
        {x: 2, y: 1, fonts: [{text: 'D', top: '35%'}]},
        {x: 2, y: 2, fonts: [{text: 'E', top: '35%'}]},
        {x: 1, y: 2, fonts: [{text: 'F', top: '35%'}]},
        {x: 0, y: 2, fonts: [{text: 'G', top: '35%'}]},
        {x: 0, y: 1, fonts: [{text: 'H', top: '35%'}]},
    ])

    const [buttons] = useState([
        {x: 1, y: 1, background: "#7f95d1", fonts: [{text: '开始', top: '35%'}]}
    ])

    const [defaultStyle] = useState([{background: "#b8c5f2"}])

    const myLucky = useRef()

    return <>
        <LuckyGrid
            ref={myLucky}
            width="300px"
            height="300px"
            rows="3"
            cols="3"
            prizes={prizes}
            defaultStyle={defaultStyle}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发star回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    const index = Math.random() * 8 >> 0
                    // @ts-ignore
                    myLucky.current.stop(index)
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
                }
            }>

        </LuckyGrid>
    </>

}