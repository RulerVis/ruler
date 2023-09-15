import { Component,Setter,createSignal,Show,createMemo,For,Accessor } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import * as lodash from "lodash"
import { Block } from "../module/Block"
import { HorizontalLine } from "../module/HorizontalLine"

export const ManyTemplate:Component<{
    link:any,
    blockWidth:number,
    blockHeight:number,
    lineLength:number,
    columnSet:any,
    setColumnSet:SetStoreFunction<any[]>,
    setPopupShow:Setter<boolean>,
    setCurrentIndex:Setter<number>,

}> = (props) => {

    const height = 200

    const branchNum = 3

    const blockSpacing = createMemo(()=>{
        return (height - branchNum * props.blockHeight)/(branchNum -1 )
    })

    const colorBar = ["#fca5a5","#f87171","#ef4444"]


    return (
        <>
            <Block 
            columnData={props.columnSet[0]}
            width={props.blockWidth}
            height={props.blockHeight}
            color="#60a5fa"
            dx={0}
            dy={0}
            left={true}
            bottom={false}
            setColumnSet={props.setColumnSet}
            />
            <foreignObject x={props.blockWidth - 5} y={props.blockHeight/2 - 16} width={20} height={20} class="cursor-pointer" 
            onClick={()=>{
                props.setPopupShow(true)
                props.setCurrentIndex(-1)
            }}>
                    <i class="fas fa-gear" style={{ color: "#000", "font-size":"10px"}}></i>
            </foreignObject>
            <For each={lodash.range(0,branchNum)}>{
                (num,index)=>(
                    <>
                        <Block
                        columnData={props.columnSet[1]}
                        index={index()+2}
                        color={colorBar[num%colorBar.length]}
                        width={props.blockWidth}
                        height={props.blockHeight}
                        left={false}
                        bottom={false}
                        dx={props.blockWidth + props.lineLength}
                        dy={props.blockHeight/2 - height/2 + index()*(props.blockHeight + blockSpacing())}
                        />
                        <line
                        x1={props.blockWidth + 8}
                        x2={props.blockWidth + props.lineLength}
                        y1={props.blockHeight/2}
                        y2={props.blockHeight/2 - height/2 + index()*(props.blockHeight + blockSpacing()) + props.blockHeight/2}
                        stroke="#d6d3d1"
                        stroke-width={2}
                        >
                        </line>
                    </>
                )
            }
            </For>
            <text
            x={1.5 * props.blockWidth + props.lineLength}
            y={props.blockHeight/2}
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#FFF"
            font-size="16px">
                ...
            </text>
            <text
            x={1.5 * props.blockWidth + props.lineLength}
            y={props.blockHeight/2 - height/2 - 30}
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#fbbf24"
            font-size="14px"
            >
                {props.link?.type} {props.link?.operator} {props.link?.value}
            </text>
        </>
        
    )
}