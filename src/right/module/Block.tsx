import { Component,Show,createSignal,Accessor,Setter,createMemo } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { AddCircle } from "./AddCircle"

export const Block:Component<{
    columnIndex?:number,
    rowIndex?:number,
    setColumnIndex?:Setter<number>,
    setRowIndex?:Setter<number>,
    index?:number
    width:number,
    height:number,
    color:string,
    dx:number,
    dy:number,
    left:boolean,
    bottom:boolean,
    right?:boolean,
    setColumnSet?:SetStoreFunction<any[]>,
    setRowSet?:SetStoreFunction<any[]>,
    setPopupShow?:Setter<boolean>,
    setSetupShow?:Setter<boolean>,
    setCurrentIndex?:Setter<number>,
    rowNum?:Accessor<number>,
    columnData?:any,
    rowData?:any
    type?:any
}> = (props) => {

    const radius = 5

    const content = createMemo(()=>{
        let result = ""
        if(props.type == "row"){
            if(props.rowData?.operator != undefined) result = result + props.rowData?.operator
            result = result + " "
            if(props.rowData?.value != undefined) result = result + props.rowData?.value  
        }
        else{
            for(let i=0;i<props.columnData?.values.length??0;i++){
                result = result + props.columnData?.values[i].operator??""
                result = result + " " + props.columnData?.values[i].value??""
                if(i!=props.columnData?.values.length-1) result=result + " or "
            }
        }
        return result
    })
     
    return (
        <>
            <g style={{transform:`translate(${props.dx}px,${props.dy}px)`}}>               
                <rect
                x="0"
                y="0"
                fill="#fff"
                height={props.height}
                width={props.width}
                rx="2"
                ry="2"
                style={{"stroke":"#D6D3D1","stroke-width":"2px"}}
                >
                </rect>
                <rect
                x="0"
                y="0"
                width={props.width}
                height={18}
                fill={props.color}
                >
                </rect>
                <text
                x="5px"
                y="12px"
                font-size="10px"
                fill="#FFF"
                >{props.columnData?.fieldName??"" }</text>
                <Show when={props.columnData?.values.length??0>0}>
                    <text
                    x={props.width/2}
                    y={props.height/2 + 8}
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="10px"
                    fill="#000"
                    >{content()}</text>
                </Show>
                <foreignObject x={props.width - 18} y={-3} width={20} height={20} class="cursor-pointer" 
                onClick={()=>{
                    props.setPopupShow?.(true)
                    props.setSetupShow?.(true)
                    props.setCurrentIndex?.(props?.index??0)
                    props.setColumnIndex?.(props?.columnIndex??-2)
                    props.setRowIndex?.(props?.rowIndex??-2)
                }}>
                    <i class="fa-solid fa-sliders fa-2xs" style={{ color: "white", "font-size":"5px"}}></i>
                </foreignObject>
                <Show when={props.bottom == true}>
                    <AddCircle
                    radius={radius}
                    dx={props.width/2 + 3}
                    dy={props.height + 3}
                    columnIndex={props.columnIndex}
                    setRowSet={props?.setRowSet}
                    />
                </Show>
                <Show when={props.left == true}>
                    <AddCircle
                    radius={radius}
                    dx={-radius}
                    dy={props.height/2 - radius}
                    setColumnSet={props.setColumnSet}
                    />
                </Show>
                <Show when={props?.right == true}>
                    <AddCircle
                    radius={radius}
                    dx={props.width-radius}
                    dy={props.height/2 - radius}
                    setColumnSet={props.setColumnSet}
                    setRowSet={props.setRowSet}
                    rowNum={props.rowNum}
                    />
                </Show>
            </g>
        </>

    )
}