import { Component,For,Show,Accessor,Setter,createMemo, createSignal } from "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"
import * as d3 from "d3"
import _ from "lodash"
import { Line } from "./Line"
import { Bar } from "./Bar"
import { LeftDegreeBar } from "./LeftDegreeBar"
import { RightDegreeBar } from "./RightDegreeBar"
import { SeparateBar } from "./SeparateBar"


import { calculateDegree } from "../data/calculateDegree"
import { calculateMaxCount } from "../data/calculateMinMax"


export const StaticFlow:Component<{
    height:Accessor<number>,
    fieldName:any,
    nextFieldName:any,
    colIndex:number,
    originalCol:any,
    binsByCol:any,
    nextBinsByCol:any,
    aggregatedLines:Accessor<any>,
    colNum:number,
    index:number,
    gWidth:number,
    currentBinLength:number,
    nextBinLength:number,
    maxDegree:Accessor<number>,
    // --reactive part
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    setReactiveDataVisible:Setter<boolean>,
    setBarWidthScale:SetStoreFunction<any>,
    setLineWidthScale:SetStoreFunction<any>,
    setDegreeSet:SetStoreFunction<any>,
    // --filter part
    barFilter:any,
    setBarFilter:SetStoreFunction<any>,
    lineFilter:any,
    setLineFilter:SetStoreFunction<any>,
    // --scale mode
    scaleMode:Accessor<string>
}> = (props) => {

    //const height = 300
    const maxBarWidth = 100
    //const barSpacing = 4
    const barSpacing = () => {
        if(props.binsByCol.length > 7) return 8
        else return (10-props.binsByCol.length) * 6
    }
    const barHeight = createMemo(()=>((props.height() - barSpacing() * (props.binsByCol.length - 1)) / props.binsByCol.length))

    const nextBarSpacing = () => {
        if(props.nextBinsByCol != undefined){
            if(props.nextBinsByCol.length > 7) return 8
            else return (10-props.nextBinsByCol.length) * 6
        }
        else return 0
    }


    const maxDegreeBarWidth = 40
    //const degreeBarSpacing = 12
    const degreeBarSpacing = () => {
        if(props.binsByCol.length <= 10) return barSpacing() + 14
        else if(props.binsByCol.length > 10 && props.binsByCol.length <= 20) return barSpacing() + 8
        else return barSpacing() + 6 
    }
    const nextDegreeBarSpacing = () => {
        if(props.nextBinsByCol != undefined){
            if(props.nextBinsByCol.length <= 10) return nextBarSpacing() + 12
            else if(props.nextBinsByCol.length > 10 && props.nextBinsByCol.length <= 20) return nextBarSpacing() + 8
            else return nextBarSpacing() + 6 
        }
        else return 0
    }

    const minLineWidth = 0
    const maxLineWidth = 4

    const minimal = Math.pow(Math.E, -5);
 
    const maxBinValue = createMemo(()=>calculateMaxCount(props.binsByCol))
    
    const barWidthScale = createMemo<d3.ScaleLinear<number,number> | d3.ScaleLogarithmic<number,number>>(()=>{
        // console.log("check mode")
        // console.log(props.scaleMode())
        if(props.scaleMode() == "mode1" || props.scaleMode() == "mode3"){
            props.setBarWidthScale(
                (scale:any) => scale.index == props.index,
                produce((scale:any)=>{scale.scale = d3.scaleLinear().domain([0, maxBinValue()]).range([0, maxBarWidth])})
            )
            return d3.scaleLinear().domain([0, maxBinValue()]).range([0, maxBarWidth])
        }
        else if(props.scaleMode() == "mode2" || props.scaleMode() == "mode4"){
            props.setBarWidthScale(
                (scale:any) => scale.index == props.index,
                produce((scale:any)=>{scale.scale = d3.scaleLog().domain([minimal, maxBinValue()]).range([minimal, maxBarWidth])})
            )
            return d3.scaleLog().domain([minimal, maxBinValue()]).range([minimal, maxBarWidth])
        }
        else{
            return d3.scaleLinear().domain([0,0]).range([0,0])
        }

    })
   
    const degreeBarWidthScale = createMemo(()=>d3.scaleLinear().domain([0, props.maxDegree()]).range([0, maxDegreeBarWidth]))

    const linesByCol = createMemo(()=>props.aggregatedLines().filter((l:any) => l.leftColIndex == props.index))
    const degree = createMemo(()=>{
        let result = calculateDegree(linesByCol(),props.index)
        props.setDegreeSet(
            (item:any) => item.index == props.index,
            produce((item:any)=>{item.degree = result})
        )
        return result
    })
    const nextBarHeight = createMemo(()=>(props.height() - nextBarSpacing() * (degree().rightDegree.length - 1)) / degree().rightDegree.length)
    const leftDegreeBarHeight = createMemo(() => {return barHeight() + barSpacing() - degreeBarSpacing()})
    const rightDegreeBarHeight = createMemo(() => {return nextBarHeight() + nextBarSpacing() - nextDegreeBarSpacing()})
    
    
    
    const maxLineCount = createMemo(()=>calculateMaxCount(linesByCol()))

    const lineWidthScale = createMemo<d3.ScaleLinear<number,number> | d3.ScaleLogarithmic<number,number>>(() =>{
        if(props.scaleMode() == "mode1" || props.scaleMode() == "mode3"){
            props.setLineWidthScale(
                (scale:any) => scale.index == props.index,
                produce((scale:any)=>{scale.scale = d3.scaleLinear().domain([minimal,maxLineCount()]).range([0.5, maxLineWidth])})   
            )
            return d3.scaleLinear().domain([minimal,maxLineCount()]).range([0.5, maxLineWidth]) 
        }
        else{
            props.setLineWidthScale(
                (scale:any) => scale.index == props.index,
                produce((scale:any)=>{scale.scale = d3.scaleLog().domain([minimal,maxLineCount()]).range([0.5, maxLineWidth])})   
            )
            return d3.scaleLog().domain([minimal,maxLineCount()]).range([0.5, maxLineWidth]) 
        }

    })


    return (
        <g>
            <g>
                <g style={{transform:`translate(${props.index * props.gWidth}px, 0px)`}}>
                    <For each={props.binsByCol}>{
                        (barData,index) => (
                            <Bar
                            fieldName={props.fieldName}
                            barData={barData}
                            barHeight={barHeight()}
                            barWidthScale={barWidthScale}
                            barSpacing={barSpacing()}
                            binsNum={props.binsByCol.length}
                            //-- reactive part
                            originalData={props.originalData}
                            setOriginalData={props.setOriginalData}
                            setReactiveDataVisible={props.setReactiveDataVisible}
                            setBarWidthScale={props.setBarWidthScale}
                            //-- filter part
                            barFilter={props.barFilter}
                            setBarFilter={props.setBarFilter}
                            lineFilter={props.lineFilter}
                            setLineFilter={props.setLineFilter}/>
                        )
                    }
                    </For>
                </g>
                <Show when={props.index!=props.colNum-1}>
                    <g style={{transform:`translate(${props.index * props.gWidth}px, 0px)`}}>
                        <For each={linesByCol()}>{
                            (lineData,index) => (
                                <Line
                                fieldName={props.fieldName}
                                nextFieldName={props.nextFieldName}
                                lineData={lineData}
                                lineWidthScale={lineWidthScale()}
                                barHeight={barHeight()}
                                nextBarHeight={nextBarHeight()}
                                barSpacing={barSpacing()}
                                nextBarSpacing={nextBarSpacing()}
                                binsByCol={props.binsByCol}
                                nextBinsByCol={props.nextBinsByCol}
                                gWidth={props.gWidth}
                                maxBarWidth={maxBarWidth}
                                leftDegree={degree().leftDegree}
                                rightDegree={degree().rightDegree}
                                degreeBarWidthScale={degreeBarWidthScale()}
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
                        <For each={degree().leftDegree}>{
                            (degreeData,index) => (
                                <LeftDegreeBar
                                degreeData={degreeData}
                                degreeBarWidthScale={degreeBarWidthScale()}
                                degreeBarHeight={leftDegreeBarHeight()}
                                degreeBarSpacing={degreeBarSpacing()}
                                maxBarWidth={maxBarWidth}
                                barHeight={barHeight()}
                                />
                            )
                        }
                        </For>
                        <For each={degree().rightDegree}>{
                            (degreeData,index) => (
                                <RightDegreeBar
                                degreeData={degreeData}
                                degreeBarWidthScale={degreeBarWidthScale()}
                                degreeBarHeight={rightDegreeBarHeight()}
                                degreeBarSpacing={nextDegreeBarSpacing()}
                                gWidth={props.gWidth}
                                maxBarWidth={maxBarWidth}
                                barHeight={nextBarHeight()}/>
                            )
                        }
                        </For>
                        <SeparateBar
                        maxBarWidth={maxBarWidth}
                        gWidth={props.gWidth}
                        height={props.height()}/>

                    </g>
                </Show>
            </g>
    
        </g>

    )
}