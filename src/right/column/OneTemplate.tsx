import { Component,Setter } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { Block } from "../module/Block"
import { HorizontalLine } from "../module/HorizontalLine"

export const OneTemplate:Component<{
    blockWidth:number,
    blockHeight:number,
    link:any,
    lineLength:number,
    columnSet:any[],
    setColumnSet:SetStoreFunction<any[]>,
    setPopupShow:Setter<boolean>,
    setCurrentIndex:Setter<number>

}> = (props) => {
    return (
        <>
            <Block 
            columnData={props.columnSet[0]}
            index={0}
            width={props.blockWidth}
            height={props.blockHeight}
            color="#60a5fa"
            dx={0}
            dy={0}
            left={true}
            bottom={false}
            setColumnSet={props.setColumnSet}
            setPopupShow={props.setPopupShow}
            setCurrentIndex={props.setCurrentIndex}/>
            <HorizontalLine
            length={props.lineLength}
            dx={props.blockWidth}
            dy={props.blockHeight/2}/>
            <foreignObject x={props.blockWidth + props.lineLength/2 - 5} y={props.blockHeight/2 - 20} width={20} height={20} class="cursor-pointer"
            onClick={()=>{
                props.setPopupShow(true)
                props.setCurrentIndex(-2)
            }}>
                <i class="fas fa-gear" style={{ color: "#000", "font-size":"10px"}}></i>
            </foreignObject>
            <text
            x={props.blockWidth + props.lineLength/2} y={props.blockHeight/2 + 35}
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#fbbf24"
            font-size="14px"
            >
                {props.link?.operator??""}
            </text>
            <Block 
            columnData={props.columnSet[1]}
            index={1}
            width={props.blockWidth}
            height={props.blockHeight}
            color="#f87171"
            dx={props.blockWidth + props.lineLength}
            dy={0}
            left={false}
            bottom={false}
            setColumnSet={props.setColumnSet}
            setPopupShow={props.setPopupShow}
            setCurrentIndex={props.setCurrentIndex}
            />

</>
        
    )
}