import { Component,createSignal,For,Accessor,Show,Setter,createMemo } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { OneTemplate } from "./OneTemplate"
import { ManyTemplate} from "./ManyTemplate"
import { Block } from "../module/Block"
import { HorizontalLine} from "../module/HorizontalLine"
import * as lodash from "lodash"

export const ColumnPanel:Component<{
    oneMode:Accessor<boolean>,
    manyMode:Accessor<boolean>,
    setPopupShow:Setter<boolean>,
    link:any,
    columnSet:any[],
    setColumnSet:SetStoreFunction<any[]>,
    setCurrentIndex:Setter<number>,
}> = (props) => {

    const blockWidth = 100
    const blockHeight = 50

    const lineLength = 60

    const colorSet = ["#34d399","#a78bfa","#e879f9"]



    return (
        //starting module
        <g>
            <Show when={props.oneMode()==true}>
                <OneTemplate
                columnSet={props.columnSet}
                setColumnSet={props.setColumnSet}
                setPopupShow={props.setPopupShow}
                setCurrentIndex={props.setCurrentIndex}
                blockWidth={blockWidth}
                blockHeight={blockHeight}
                link={props.link}
                lineLength={lineLength}/>
            </Show>
            <Show when={props.manyMode() == true}>
                <ManyTemplate
                link={props.link}
                setPopupShow={props.setPopupShow}
                columnSet={props.columnSet}
                setColumnSet={props.setColumnSet}
                setCurrentIndex={props.setCurrentIndex}
                blockWidth={blockWidth}
                blockHeight={blockHeight}
                lineLength={lineLength}/>
            </Show>
            <For each={lodash.range(2,props.columnSet.length)}>{
                (num,index) => (
                    <g style={{transform:`translate(${-(index()+1) * (blockWidth + lineLength)}px,0px)`}}>
                        <Block 
                        index={num}
                        width={blockWidth}
                        height={blockHeight}
                        color={colorSet[index()%colorSet.length]}
                        dx={0}
                        dy={0}
                        left={true}
                        bottom={false}
                        setColumnSet={props.setColumnSet}
                        setPopupShow={props.setPopupShow}
                        setCurrentIndex={props.setCurrentIndex}
                        columnData={props.columnSet[num]}/>
                        <HorizontalLine
                        length={lineLength-5}
                        dx={blockWidth}
                        dy={blockHeight/2}/>
                        </g>
                )
            }     
            </For>
        </g>
    )
}