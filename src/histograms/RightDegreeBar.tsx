import { Component,Accessor } from "solid-js"

export const RightDegreeBar:Component<{
    degreeData:any,
    degreeBarWidthScale:d3.ScaleLinear<number,number>,
    degreeBarHeight:number,
    degreeBarSpacing:number,
    gWidth:number,
    maxBarWidth:number,
    barHeight:number

}> = (props) => {
    const width = ()=>props.degreeBarWidthScale(props.degreeData["degree"])
    const height = ()=>props.degreeBarHeight
    const rectX = ()=>props.gWidth - 8 - width()
    const rectY = ()=>0.5 * props.barHeight + Number(props.degreeData["index"]) * (props.degreeBarHeight + props.degreeBarSpacing) - 0.5 * props.degreeBarHeight
 
     return (
         <rect
         width={width()}
         height={height()}
         x={rectX()}
         y={rectY()}
         style = {{fill:"#DDEBE8"}}>
         </rect>
     )

}