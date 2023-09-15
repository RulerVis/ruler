import { Component,For,Accessor,Setter,createMemo,Show,createSignal } from "solid-js"
import  _ from "lodash"
import * as lodash from "lodash"
import * as d3 from "d3"
import { SetStoreFunction,createStore } from "solid-js/store"
import { TopGraph } from "./TopGraph"
import { StaticFlow } from "./StaticFlow"
import { ReactiveFlow } from "./reactive/ReactiveFlow"

import { computeBins,computeReactiveBins } from '../data/aggregation'
import { mergeBins } from "../data/mergeBins"
import { computeAggregatedLines } from "../data/aggregation" 
import { calculateMaxDegree } from "../data/calculateDegree"

import { initScale } from "../init/initScale"
import { initDegree } from "../init/initDegree"

export const Histogram:Component<{
    fields:any,
    fieldsSelection:any[],
    staticData:Accessor<any>,
    colNum:number,
    // --reactive part
    reactiveDataVisible:Accessor<boolean>,
    setReactiveDataVisible:Setter<boolean>,
    reactiveData:Accessor<any>,
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    // --filter part
    barFilter:any,
    setBarFilter:SetStoreFunction<any>,
    lineFilter:any,
    setLineFilter:SetStoreFunction<any>,
    matrixFilter:any,
    setMatrixFilter:SetStoreFunction<any>,
    setFlagCollection:Setter<any>,
    selectedAreaVisible:Accessor<boolean>,
    setSelectedAreaVisible:Setter<boolean>,
    // --svg data
    bins:Accessor<any>,
    binGroupsByCol:Accessor<any>,
    aggregatedLines:Accessor<any>,
    // --scale mode
    scaleMode:Accessor<string>,
    zeroVisible:Accessor<boolean>,
    // -- height
    height:Accessor<number>,
    setHeight:Setter<number>
}>=(props) => {
    const gWidth = 300
    



    const maxBinsNum = createMemo(()=>{
        let max = 0
        const array:any[] = Object.values(props.binGroupsByCol())
        for(let i=0;i<array.length;i++){
            if(array[i].length > max){
                max = array[i].length
            }
        }
        // console.log("max")
        // console.log(max)
        return max
    })

    createMemo(()=>{
        //if(maxBinsNum() >=12 ) setHeight(500)
        if(maxBinsNum() >=25 ) props.setHeight(500)
        if(maxBinsNum() < 25) props.setHeight(400)
    })
    
    const maxDegree  = createMemo(()=>calculateMaxDegree(props.binGroupsByCol()))

    const bins2 = createMemo(() => computeReactiveBins(props.reactiveData(),props.fieldsSelection))
    const reactiveBins = createMemo(() => mergeBins(props.bins(),bins2()))
    const reactiveBinGroupsByCol = createMemo(()=>_.groupBy(reactiveBins(), "colIndex"))
    const reactiveAggregatedLines = createMemo(()=>computeAggregatedLines(props.reactiveData(),props.binGroupsByCol(),props.colNum))

    const [barWidthScale,setBarWidthScale] = createStore(initScale(props.reactiveData()[0].length))
    const [lineWidthScale,setlineWidthScale] = createStore(initScale(props.reactiveData()[0].length-1))

    const [degreeSet,setDegreeSet] = createStore(initDegree(props.reactiveData()[0].length))
    const [degreeBarWidthScale,setDegreeBarWidthScale] = createSignal(d3.scaleLinear().domain([0,maxDegree()]).range([0,40]))
    createMemo(()=>{
        setDegreeBarWidthScale(()=>d3.scaleLinear().domain([0,maxDegree()]).range([0,40]))
        console.log("binGroupsByCol")
        console.log(props.binGroupsByCol())
    })
    


    return (
        <div style={{width:`${props.fields.length * 300}px`}} id="VIS">
            <div>
                <svg width={`${props.fields.length * 300}`} height="210px" >
                    <For each={lodash.range(0,props.staticData()[0].length)}>{
                        (num,index) => (
                            <TopGraph
                            index={index()}
                            colNum={props.colNum}
                            gWidth={gWidth}
                            fieldName={props.fields[index()]}
                            originalCol = {props.staticData().map((d:any[]) => d[index()])}
                            binsByCol = {props.binGroupsByCol()[num]}
                            nextBinsByCol = {num<=props.staticData()[0].length-1?props.binGroupsByCol()[num+1]:{}}
                            aggregatedLines = {props.aggregatedLines}
                            // --set part
                            setOriginalData={props.setOriginalData}
                            reactiveDataVisible={props.reactiveDataVisible}
                            setReactiveDataVisible={props.setReactiveDataVisible}
                            selectedAreaVisible={props.selectedAreaVisible}
                            setSelectedAreaVisible={props.setSelectedAreaVisible}
                            //-- filter part
                            barFilter={props.barFilter}
                            setBarFilter={props.setBarFilter}
                            lineFilter={props.lineFilter}
                            setLineFilter={props.setLineFilter}
                            matrixFilter={props.matrixFilter}
                            setMatrixFilter={props.setMatrixFilter}
                            setFlagCollection={props.setFlagCollection}
                            // --scale mode
                            scaleMode={props.scaleMode}
                            zeroVisible={props.zeroVisible}

                            />
                        )
                    }
                    </For>
                </svg>
            </div>
            <div class="h-420px overflow-scroll">
                <svg width={`${props.fields.length * 300}`} height={props.height()}>
                    <For each={lodash.range(0,props.staticData()[0].length)}>{
                        (num,index) => (                       
                            <StaticFlow
                            height={props.height}
                            fieldName={props.fields[index()]}
                            nextFieldName={num<=props.staticData()[0].length-1?props.fields[index()+1]:""}
                            colIndex={index()}
                            originalCol = {props.staticData().map((d:any[]) => d[index()])}
                            binsByCol = {props.binGroupsByCol()[num]}
                            nextBinsByCol = {num<=props.staticData()[0].length-1?props.binGroupsByCol()[num+1]:{}}
                            aggregatedLines = {props.aggregatedLines}
                            colNum = {props.colNum}
                            index = {num}
                            gWidth = {gWidth}
                            currentBinLength = {props.binGroupsByCol()[num].length}
                            nextBinLength = {props.binGroupsByCol()[num+1].length}
                            maxDegree = {maxDegree}
                            // --reactive part
                            originalData={props.originalData}
                            setOriginalData={props.setOriginalData}
                            setReactiveDataVisible={props.setReactiveDataVisible}
                            setBarWidthScale={setBarWidthScale}
                            setLineWidthScale={setlineWidthScale}
                            setDegreeSet={setDegreeSet}
                            // --filter part
                            barFilter={props.barFilter}
                            setBarFilter={props.setBarFilter}
                            lineFilter={props.lineFilter}
                            setLineFilter={props.setLineFilter}
                            // -- scale mode
                            scaleMode={props.scaleMode}
                            />
                    )
                    }
                    </For>
                    <Show when={props.reactiveDataVisible()}>
                        <For each={lodash.range(0,props.reactiveData().length!=0?props.reactiveData()[0].length:0)}>{
                            (num,index) => (
                                <ReactiveFlow
                                height={props.height}
                                fieldName={props.fields[index()]}
                                nextFieldName={num<=props.reactiveData()[0].length-1?props.fields[index()+1]:""}
                                colIndex={index()}
                                reactiveBinsByCol = {reactiveBinGroupsByCol()[num]}
                                nextReactiveBinsByCol = {num<=props.reactiveData()[0].length-1?reactiveBinGroupsByCol()[num+1]:{}}
                                reactiveAggregatedLines = {reactiveAggregatedLines}
                                originalCol = {props.reactiveData().map((d:any[]) => d[index()])}
                                colNum = {props.colNum}
                                index={index()}
                                gWidth = {gWidth}
                                reactiveDataVisible = {props.reactiveDataVisible}
                                barWidthScale = {barWidthScale[index()]["scale"]}
                                lineWidthScale = {lineWidthScale[index()]["scale"]}
                                degreeData={degreeSet[index()]["degree"]}
                                degreeBarWidthScale={degreeBarWidthScale()}
                                originalData={props.originalData}
                                setOriginalData={props.setOriginalData}
                                setReactiveDataVisible={props.setReactiveDataVisible}
                                // --filter part
                                barFilter={props.barFilter}
                                setBarFilter={props.setBarFilter}
                                lineFilter={props.lineFilter}
                                setLineFilter={props.setLineFilter}

                                />
                        )
                        }
                        </For>
                    </Show>
                </svg>  
            </div>
        </div>
    )
}