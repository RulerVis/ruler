import { Component,For,Show,Accessor,Setter,createMemo } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import * as d3 from "d3"
import _ from "lodash"
import { ReactiveBar} from "./ReactiveBar"
import { ReactiveLine} from "./ReactiveLine"
import { ReactiveLeftDegreeBar } from "./ReactiveLeftDegreeBar"
import { ReactiveRightDegreeBar } from "./ReactiveRightDegreeBar"
import { ReactiveMatrix } from "./ReactiveMatrix" 

import { calculateDegree } from "../../data/calculateDegree"
import { calculateDensityMatrix } from "../../data/calculateDensityMatrix"


export const ReactiveFlow:Component<{
    height:Accessor<number>
    fieldName:any,
    nextFieldName:any,
    colIndex:number,
    reactiveBinsByCol:any,
    nextReactiveBinsByCol:any,
    reactiveAggregatedLines:Accessor<any>,
    originalCol:any,
    colNum:number,
    index:number,
    gWidth:number,
    // -- reactive part
    reactiveDataVisible:Accessor<boolean>,
    barWidthScale:d3.ScaleLinear<number,number>,
    lineWidthScale:d3.ScaleLinear<number,number>,
    degreeData:any,
    degreeBarWidthScale:d3.ScaleLinear<number,number>,
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    setReactiveDataVisible:Setter<boolean>,
    //--reactive part
    barFilter:any,
    setBarFilter:SetStoreFunction<any>,
    lineFilter:any,
    setLineFilter:SetStoreFunction<any>

}> = (props) => {



    const maxBarWidth=100
    //const barSpacing = 4
    const barSpacing = () => {
        if(props.reactiveBinsByCol.length > 7) return 8
        else return (10-props.reactiveBinsByCol.length) * 6
    }
    const barHeight = createMemo(()=>{ 
        return (props.height() - barSpacing() * (props.reactiveBinsByCol.length - 1)) / props.reactiveBinsByCol.length})

    const nextBarSpacing = () => {
        if(props.nextReactiveBinsByCol != undefined){
            if(props.nextReactiveBinsByCol.length > 7) return 8
            else return (10-props.nextReactiveBinsByCol.length) * 6
        }
        else return 0
    }
    
    //const degreeBarSpacing = 12
    const degreeBarSpacing = () => {
        if(props.reactiveBinsByCol.length <= 10) return barSpacing() + 14
        else if(props.reactiveBinsByCol.length > 10 && props.reactiveBinsByCol.length <= 20) return barSpacing() + 8
        else return barSpacing() + 6 
    }
    const nextDegreeBarSpacing = () => {
        if(props.nextReactiveBinsByCol != undefined){
            if(props.nextReactiveBinsByCol.length <= 10) return nextBarSpacing() + 12
            else if(props.nextReactiveBinsByCol.length > 10 && props.nextReactiveBinsByCol.length <= 20) return nextBarSpacing() + 8
            else return nextBarSpacing() + 6 
        }
        else return 0
    }
    const reactiveLinesByCol = createMemo(()=>(props.reactiveAggregatedLines().filter((l:any) => l.leftColIndex == props.index)))
    const degree = createMemo(()=>calculateDegree(reactiveLinesByCol(),props.index))
    
    const nextBarHeight = createMemo(()=>(props.height() - nextBarSpacing() * (degree().rightDegree.length - 1)) / degree().rightDegree.length)
    const leftDegreeBarHeight = createMemo(() => {return barHeight() + barSpacing() - degreeBarSpacing()})
    const rightDegreeBarHeight = createMemo(() => {return nextBarHeight() + nextBarSpacing() - nextDegreeBarSpacing()})



    


    return (
        <g>
            <g style={{transform:`translate(${props.index * props.gWidth}px, 0px)`}}>
                <For each={props.reactiveBinsByCol}>{
                    (barData,index) => (
                        <ReactiveBar
                        barData={barData}
                        binsNum={props.reactiveBinsByCol.length}
                        barHeight={barHeight()}
                        barWidthScale={props.barWidthScale}
                        barSpacing={barSpacing()}
                        fieldName={props.fieldName}
                        originalData={props.originalData}
                        setOriginalData={props.setOriginalData}
                        setReactiveDataVisible={props.setReactiveDataVisible}
                        //-- filter part
                        barFilter={props.barFilter}
                        setBarFilter={props.setBarFilter}
                        lineFilter={props.lineFilter}
                        setLineFilter={props.setLineFilter}
                        />
                    )
                }
                </For>  
            </g>
            <Show when={props.index!=props.colNum-1}>
                    <g style={{transform:`translate(${props.index * props.gWidth}px, 0px)`}}>
                        <For each={reactiveLinesByCol()}>{
                            (lineData,index) => (
                                <ReactiveLine
                                fieldName={props.fieldName}
                                nextFieldName={props.nextFieldName}
                                lineData={lineData}
                                lineWidthScale={props.lineWidthScale}
                                barHeight={barHeight()}
                                nextBarHeight={nextBarHeight()}
                                barSpacing={barSpacing()}
                                nextBarSpacing={nextBarSpacing()}
                                binsByCol={props.reactiveBinsByCol}
                                nextBinsByCol={props.nextReactiveBinsByCol}
                                gWidth={props.gWidth}
                                maxBarWidth={maxBarWidth}
                                leftDegree={props.degreeData.leftDegree}
                                rightDegree={props.degreeData.rightDegree}
                                degreeBarWidthScale={props.degreeBarWidthScale}
                                setOriginalData={props.setOriginalData}
                                //-- filter part
                                barFilter = {props.barFilter}
                                setBarFilter = {props.setBarFilter}
                                lineFilter={props.lineFilter}
                                setLineFilter={props.setLineFilter}
                                />
                            )
                        }
                        </For>
                        <For each={degree().leftDegree}>{
                            (degreeData,index) => (
                                <ReactiveLeftDegreeBar
                                degreeData={degreeData}
                                degreeBarWidthScale={props.degreeBarWidthScale}
                                degreeBarHeight={leftDegreeBarHeight()}
                                degreeBarSpacing={degreeBarSpacing()}
                                maxBarWidth={maxBarWidth}
                                barHeight={barHeight()}
                                reactiveDataVisible={props.reactiveDataVisible}/>
                            )
                        }
                        </For>
                        <For each={degree().rightDegree}>{
                            (degreeData,index) => (
                                <ReactiveRightDegreeBar
                                degreeData={degreeData}
                                degreeBarWidthScale={props.degreeBarWidthScale}
                                degreeBarHeight={rightDegreeBarHeight()}
                                degreeBarSpacing={nextDegreeBarSpacing()}
                                gWidth={props.gWidth}
                                maxBarWidth={maxBarWidth}
                                barHeight={nextBarHeight()}
                                reactiveDataVisible={props.reactiveDataVisible}/>
                            )
                        }
                        </For>
                    </g>
                </Show>

        </g>

    )
}