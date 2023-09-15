import { Component,Accessor } from "solid-js"
import * as d3 from "d3"

export const LeftDegreeBar:Component<{
    degreeData:any,
    degreeBarWidthScale:d3.ScaleLinear<number,number>,
    degreeBarHeight:number,
    degreeBarSpacing:number,
    maxBarWidth:number,
    barHeight:number,
}> = (props) => {
    
   const width = ()=>props.degreeBarWidthScale(props.degreeData["degree"])
   const height = ()=>props.degreeBarHeight
   const rectX = ()=>props.maxBarWidth + 8
   const rectY = ()=>0.5 * props.barHeight + Number(props.degreeData["index"]) * (props.degreeBarHeight + props.degreeBarSpacing) - 0.5 * props.degreeBarHeight

    return (
        <rect
        width={width()}
        height={height()}
        x={rectX()}
        y={rectY()}
        style={{fill:"#DDEBE8"}}
        //style = {{fill:"#d4d4d4",opacity:"60%"}}
        >
        </rect>
    )
}