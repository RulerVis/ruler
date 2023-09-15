import { Component } from "solid-js"
import * as d3 from "d3"

export const WeightBar:Component<{
    weightCount:any,
    weightHeightScale:d3.ScaleLinear<number,number>,
    weightBarWidth:number,
    weightBarSpacing:number,
    index:number,
    selected:boolean
}> = (props) => {
    return (
        <rect
        width={props.weightBarWidth}
        height={props.weightHeightScale(props.weightCount["count"]) == 0 ? 1 : props.weightHeightScale(props.weightCount["count"])}
        x={props.index * (props.weightBarSpacing + props.weightBarWidth) + props.weightBarSpacing}
        y={180-props.weightHeightScale(props.weightCount["count"])}
        style = {{fill:props.selected?"#EDC948":"#d4d4d4",opacity:props.selected?"100%":"60%"}}>
        </rect>
    )
}