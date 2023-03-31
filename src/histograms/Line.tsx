import { Component,Setter } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import * as d3 from "d3"

import { clickLine } from "../interaction/clickEvent"

export const Line:Component<{
    fieldName:any,
    nextFieldName:any,
    lineData:any,
    lineWidthScale:d3.ScaleLinear<number,number> | d3.ScaleLogarithmic<number,number>,
    barHeight:number,
    nextBarHeight:number,
    barSpacing:number,
    nextBarSpacing:number,
    binsByCol:any,
    nextBinsByCol:any,
    gWidth:number,
    maxBarWidth:number,
    leftDegree:any,
    rightDegree:any,
    degreeBarWidthScale:d3.ScaleLinear<number,number>,
    setOriginalData:Setter<any>,
    setReactiveDataVisible:Setter<boolean>,
    // --filter part
    barFilter:any,
    setBarFilter:SetStoreFunction<any>,
    lineFilter:any,
    setLineFilter:SetStoreFunction<any>

}> = (props) => {

    const width = () => {return props.lineData.count>0?props.lineWidthScale(props.lineData.count):0}
    const leftX = () =>props.maxBarWidth + 8 + props.degreeBarWidthScale(props.leftDegree[props.lineData["leftBinIndex"]]["degree"])
    const leftY = () =>props.lineData.leftBinIndex * (props.barHeight + props.barSpacing) + 0.5 * props.barHeight
    const rightX = () =>props.gWidth - 8 - props.degreeBarWidthScale(props.rightDegree[props.lineData["rightBinIndex"]]["degree"])
    const rightY = () =>props.lineData.rightBinIndex * (props.nextBarHeight + props.nextBarSpacing) + 0.5 * props.nextBarHeight
    return (
        <line
            class="cursor-pointer"
            x1={leftX()}
            y1={leftY()}
            x2={rightX()}
            y2={rightY()}
            stroke="#d4d4d4"
            stroke-width={width()}
            onClick={(event:MouseEvent)=>{
                props.setReactiveDataVisible(true)
                clickLine(props.lineData,props.binsByCol,props.nextBinsByCol,props.barFilter,props.lineFilter,props.setLineFilter,props.setOriginalData,props.fieldName)}}
            >
        </line>
    )
}