import { Component,For,Show,createMemo,createSignal,Accessor,Setter } from "solid-js"
import { createStore,SetStoreFunction } from "solid-js/store"
import * as d3 from "d3"
import { WeightBar } from "./WeightBar"
import { BrushBar } from "./BrushBar"
import { Matrix } from "./Matrix"

import { computeWeightDistribution } from "../data/aggregation"
import { computeSelectedWeightDistribution } from "../data/aggregation"
import { calculateMaxCount } from "../data/calculateMinMax"

import { clickLine } from "../interaction/clickEvent"

export const TopGraph:Component<{
    index:number,
    colNum:number,
    gWidth:number,
    fieldName:any,
    originalCol:any,
    binsByCol:any,
    nextBinsByCol:any,
    aggregatedLines:Accessor<any>,
    // --set part
    setOriginalData:Setter<any>,
    reactiveDataVisible:Accessor<boolean>,
    setReactiveDataVisible:Setter<boolean>,
    selectedAreaVisible:Accessor<boolean>,
    setSelectedAreaVisible:Setter<boolean>
    // --filter part
    barFilter:any,
    setBarFilter:SetStoreFunction<any>,
    lineFilter:any,
    setLineFilter:SetStoreFunction<any>,
    matrixFilter:any,
    setMatrixFilter:SetStoreFunction<any>,
    setFlagCollection:Setter<any>,
    scaleMode:Accessor<string>,
    zeroVisible:Accessor<boolean>

}> = (props) => {

    const maxBarWidth = 100
    const maxDegreeBarWidth = 50

    const weightBarWidth = 20
    const weightBarSpacing = 3

    const minWeightHeight = 0
    const maxWeightHeight = 50

    const linesByCol = createMemo(()=>props.aggregatedLines().filter((l:any) => l.leftColIndex == props.index))
    const maxLineCount = createMemo(()=>calculateMaxCount(linesByCol()))
    const [minSelectedLineCount,setMinSelectedLineCount] = createSignal<number>(-1)
    const [maxSelectedLineCount,setMaxSelectedLineCount] = createSignal<number>(0)
    createMemo(()=>{
        if(props.selectedAreaVisible() == false) setMaxSelectedLineCount(0)
    })

    const weightDistribution = createMemo(()=>computeWeightDistribution(linesByCol()))
    const selectedWeightDistribution = createMemo(()=>computeSelectedWeightDistribution(linesByCol(),minSelectedLineCount(),maxSelectedLineCount(),weightDistribution()))
    createMemo(()=>{
        if(maxSelectedLineCount()>0 && minSelectedLineCount()>=0){
            console.log("it happened")
            let newLineData = linesByCol().filter((d:any)=>(d.count>0)).filter((d:any) => (d.count >= minSelectedLineCount() && d.count <= maxSelectedLineCount()))
            for(let i=0;i<newLineData.length;i++){
                clickLine(newLineData[i],props.binsByCol,props.nextBinsByCol,props.barFilter,props.lineFilter,props.setLineFilter,props.setOriginalData,props.fieldName)
            }
            if(newLineData.length != 0){
                props.setReactiveDataVisible(true)
            }
            
        }
    })

    const maxWeightCount = createMemo(()=>calculateMaxCount(weightDistribution()))
    const weightHeightScale = createMemo(()=>d3.scaleLinear().domain([0,maxWeightCount()]).range([minWeightHeight, maxWeightHeight]))




    return (
        <g>
            <g style={{transform:`translate(${props.index * props.gWidth + 2}px, ${180 - maxBarWidth }px)`}}>
                <Matrix
                setOriginalData={props.setOriginalData}
                reactiveDataVisible={props.reactiveDataVisible}
                setReactiveDataVisible={props.setReactiveDataVisible}
                fieldName={props.fieldName}
                width={maxBarWidth}
                originalCol={props.originalCol}
                binsByCol={props.binsByCol}
                index={props.index}
                //-- filter part
                matrixFilter={props.matrixFilter}
                setMatrixFilter={props.setMatrixFilter}
                setFlagCollection={props.setFlagCollection}
                scaleMode={props.scaleMode}
                zeroVisible={props.zeroVisible}
                />
            </g>z
            {/* here hide it temporarily */}
            <Show when={2<1}> 
                <g  style={{transform:`translate(${props.index * props.gWidth + maxBarWidth + maxDegreeBarWidth}px, 0px)`}}>
                    <For each={weightDistribution()}>{
                        (weightCount,index) => (
                            <WeightBar
                            weightCount={weightCount}
                            weightHeightScale={weightHeightScale()}
                            weightBarWidth={weightBarWidth}
                            weightBarSpacing={weightBarSpacing}
                            index={index()}
                            selected={false}
                            />

                        )
                    }
                    </For>
                    <Show when={props.selectedAreaVisible()}>                    
                        <For each={selectedWeightDistribution()}>{
                            (weightCount,index) => (
                                <WeightBar
                                weightCount={weightCount}
                                weightHeightScale={weightHeightScale()}
                                weightBarWidth={weightBarWidth}
                                weightBarSpacing={weightBarSpacing}
                                index={index()}
                                selected={true}
                                />
                            )
                        }
                        </For>
                    </Show>
                    <BrushBar
                    selectedAreaVisible={props.selectedAreaVisible}
                    setSelectedAreaVisible={props.setSelectedAreaVisible}
                    setMinSelectedLineCount={setMinSelectedLineCount}
                    setMaxSelectedLineCount={setMaxSelectedLineCount}
                    weightBarWidth={weightBarWidth}
                    weightBarSpacing={weightBarSpacing}
                    maxLineCount={maxLineCount}
                    index={props.index}
                    />
                </g>
            </Show>
        </g>
    )
}