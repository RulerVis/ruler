import { Component,For,Setter,Accessor } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import * as d3 from "d3"

import { clickBar } from "../../interaction/clickEvent"


export const ReactiveBar:Component<{
    barData:any,    
    binsNum:number                
    barHeight:number,
    barWidthScale:d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number,number>,
    barSpacing:number,
    fieldName:any,
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    setReactiveDataVisible:Setter<boolean>,
    //--reactive part
    barFilter:any,
    setBarFilter:SetStoreFunction<any>,
    lineFilter:any,
    setLineFilter:SetStoreFunction<any>

}> = (props) => {

    const getName = (code:string) => {
        if(code == "10") return "PICK"
        else if(code == "20") return "PACK"
        else if(code == "70") return "OUT"
        else if(code == "150") return "WAVE"
        else if(code == "170") return "PRE_TREAT"
        else if(code == "190") return "WEIGHT"
        else if(code == "290") return "CHECK"
    }
    
    return (
        <>
            <rect
            class="cursor-pointer"
            width = {Number(props.barWidthScale(props.barData.count))}
            height = {Number(props.barHeight)}
            //style = {{transform:`translate(0px, ${props.barData.binIndex * (props.barHeight + props.barSpacing)}px)`,fill:"#fbbf24"}}
            style = {{transform:`translate(0px, ${props.barData.binIndex * (props.barHeight + props.barSpacing)}px)`,fill:"#EDC948"}}
            onClick={(event:MouseEvent)=>{
                props.setReactiveDataVisible(true)
                clickBar(event,props.barData,props.barFilter,props.setBarFilter,props.lineFilter,props.fieldName,props.setOriginalData)}}
            >
            </rect>
            <text
            class="cursor-pointer"
            dominant-baseline="middle"
            x="4"
            y={props.barData.binIndex * (props.barHeight + props.barSpacing) + 0.5 * props.barHeight}
            style={{fill:"#000","font-size":props.binsNum <=10 ?"14px":props.binsNum<=20?"10px":"8px","font-weight":"semibold"}}
            onClick={(event:MouseEvent)=>{
                props.setReactiveDataVisible(true)
                clickBar(event,props.barData,props.barFilter,props.setBarFilter,props.lineFilter,props.fieldName,props.setOriginalData)}}
            >
            {(props.fieldName=="phase" || props.fieldName=="from_phase")?getName(props.barData.key.toString()):props.barData.key}

            </text>



         
        </>
    )
}