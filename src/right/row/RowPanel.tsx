import { Component,For,Show,createMemo,Setter } from "solid-js"
import { SetStoreFunction } from "solid-js/store"

import { Block } from "../module/Block"
import { VerticalLine } from "../module/VerticalLine" 
import { HorizontalLine } from "../module/HorizontalLine"

export const RowPanel:Component<{
    setSetupShow:Setter<boolean>,
    setColumnIndex:Setter<number>,
    setRowIndex:Setter<number>,
    rowSet:any,
    setRowSet:SetStoreFunction<any[]>,
    variance:any

}> = (props) => {

    const blockWidth = 100
    const blockHeight = 50

    const lineLength = 30

    const colorSet = [["#059669","#10b981","#34d399","#6ee7b7"],["#2563eb","#3b82f6","#60a5fa","#93c5fd"]]

    const topContent = createMemo(()=>{
        let content = "variance "
        content = content + props.variance?.operator??""
        content = content + " "
        content = content + props.variance?.value??""
        return content
    })

    

    const rowNum = createMemo(()=>{ 
        console.log("rowNum")
        console.log(props.rowSet[0].values[0].length)
        return props.rowSet[0].values[0].length})

    return (
        <g>
            <Show when={props.rowSet.length ==1}>
                <foreignObject x={ 0} y={ -25} width={20} height={20} class="cursor-pointer" 
                onClick={()=>{
                    props.setSetupShow(true)
                    props.setColumnIndex(-1)
                }}
                >
                        <i class="fas fa-gear" style={{ color: "#000", "font-size":"10px"}}></i>
                </foreignObject>
            </Show>
            <Show when={props.rowSet.length == 1 && props.variance?.value != undefined && props.variance?.value != ""}>
                <text 
                dominant-baseline="middle"
                x={15}
                y={-10}
                font-size="10px"
                fill="#fbbf24">
                    {topContent()}
                </text>

            </Show>
            <For each={props.rowSet}>{
                (fieldRowData,columnIndex) => (
                    <g style={{transform:`translate(${columnIndex() * (blockWidth + lineLength)}px, 0px)`}}>
                        <For each={fieldRowData.values[0]}>{
                            (rowUnit,rowIndex) => (
                                <g style={{transform:`translate(0px, ${rowIndex() * (blockHeight + lineLength)}px)`}} >
                                    <Block
                                    setColumnIndex={props.setColumnIndex}
                                    setRowIndex={props.setRowIndex}
                                    columnIndex={columnIndex()}
                                    rowIndex={rowIndex()}
                                    width={blockWidth}
                                    height={blockHeight}
                                    color={colorSet[columnIndex()][rowIndex()%colorSet[0].length]}
                                    dx={0}
                                    dy={0}
                                    left={false}
                                    bottom={rowIndex() == fieldRowData.values[0].length-1}
                                    right={rowIndex() == 0}
                                    setRowSet={props.setRowSet}
                                    setSetupShow={props.setSetupShow}
                                    rowNum={rowNum}
                                    columnData={props.rowSet[columnIndex()]}
                                    rowData={props.rowSet[columnIndex()].values[0][rowIndex()]}
                                    type="row"
                                    />
                                    <Show when={props.rowSet.length == 1 && rowIndex()<fieldRowData.values[0].length-1}>
                                        <VerticalLine
                                        length={lineLength}
                                        dx={blockWidth/2}
                                        dy={blockHeight}
                                        />
                                    </Show>
                                    <Show when={props.rowSet.length > 1 && columnIndex() < props.rowSet.length-1}>
                                        <HorizontalLine
                                        length={lineLength}
                                        dx={blockWidth + columnIndex() * (blockWidth + lineLength)}
                                        dy={blockHeight/2}/>
                                    </Show>
                                    <Show when={props.rowSet.length > 1 && rowIndex()<fieldRowData.values[0].length-1 && columnIndex() < props.rowSet.length-1}>
                                        <VerticalLine
                                        length={lineLength + blockHeight}
                                        dx={blockWidth + lineLength/2 + columnIndex() * (blockWidth + lineLength)}
                                        dy={blockHeight/2}
                                        />
                                    </Show>
                                </g>   
                            )   
                        }
                        </For>
                    </g>
                )
            }
            </For>
        </g>
    )
}