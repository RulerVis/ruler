import { Component,For,Accessor,createMemo,createSignal,Setter,Show } from "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"
import * as d3 from "d3"
import * as lodash from "lodash"

import { calculateDensityMatrix } from "../data/calculateDensityMatrix"
import { clickMatrixCell } from "../interaction/clickEvent"
import { set } from "lodash"



export const Matrix:Component<{
    setOriginalData:Setter<any>,
    reactiveDataVisible:Accessor<boolean>,
    setReactiveDataVisible:Setter<boolean>,
    fieldName:any,
    width:number,
    originalCol:any,
    binsByCol:any,
    index:number,
    //-- filter part
    matrixFilter:any,
    setMatrixFilter:SetStoreFunction<any>,
    setFlagCollection:Setter<any>,
    scaleMode:Accessor<string>,
    zeroVisible:Accessor<boolean>
}> = (props) => {

    const minimal = Math.pow(Math.E, -5);

    const [preSelection,setPreSelection] = createSignal<any[]>([])

    createMemo(()=>{
        if(props.reactiveDataVisible() == false){
            setPreSelection([])
        }
    })


    const densityMatrix = createMemo(()=>{return calculateDensityMatrix(props.originalCol,props.binsByCol,preSelection())})

    const gridNum = ()=>{return props.binsByCol.length}

    const gridSize = createMemo(()=>(props.width - 2 * (gridNum() - 1)) / gridNum())

    const maxDensity = createMemo(() => {
        let maxDensity = 0
        for(let i=0;i<gridNum();i++){
            for(let j=0;j<gridNum();j++){
                if(densityMatrix()[i][j] > maxDensity){
                    maxDensity = densityMatrix()[i][j]
                }
            }
        }
        return maxDensity
    })

    const colorScale = createMemo(()=>{
        return d3.scaleLog().domain([minimal,maxDensity()]).range([minimal,1])
    })

    const fillColor = (mode:string,value:number) => {
        if(mode == "mode1")
        {
            if(maxDensity() == 0) return "#FFF"
            return d3.interpolateGreys(value/maxDensity())
        }
        else if(mode == "mode2")
        {
            if(maxDensity() == 0) return "#FFF"
            return d3.interpolateGreys(value==0 ? 0 : colorScale()(value))
        }
        else if(mode == "mode3")
        {
            if(maxDensity() == 0) return "#FFF"
            return d3.interpolatePiYG(value/maxDensity())
        }
        else if(mode == "mode4")
        {
            if(maxDensity() == 0) return "#FFF"
            return d3.interpolatePiYG(value/maxDensity())
        }

    }

    





 

 

    return (
        <g>
            <For each={lodash.range(0,gridNum())}>{
                (rowIndex) => (
                    <g style={{transform:`translate(0px,${rowIndex * (gridSize()+2)}px)`}}>
                        <For each={lodash.range(0,gridNum())}>{
                            (colIndex)=>(
                                <>
                                    <rect 
                                    class="matrix-cell"
                                    width={gridSize()}
                                    height={gridSize()}
                                    stroke="gray" 
                                    stroke-opacity="0.8"
                                    stroke-width="0.1"
                                    x={colIndex * (gridSize()+2)}
                                    y="0"
                                    style = {{fill:maxDensity()>0? fillColor(props.scaleMode(),densityMatrix()[rowIndex][colIndex]):fillColor(props.scaleMode(),minimal)}}
                                    onClick={(event:MouseEvent)=>{
                                        props.setReactiveDataVisible(true)
                                        clickMatrixCell(event,props.binsByCol,props.matrixFilter,props.setMatrixFilter,props.setFlagCollection,props.fieldName,rowIndex,colIndex,props.setOriginalData,preSelection())
                                    }}
                                    >
                                        <title style={{"font-weight":"bold","font-size":"18px"}} >{`scenarioNum: ${densityMatrix()[rowIndex][colIndex]}\ncurrentRow: ${props.binsByCol[colIndex].key}\nnextRow: ${props.binsByCol[rowIndex].key}`}</title>
                                    </rect>
                                    <Show when={densityMatrix()[rowIndex][colIndex] == 0}>
                                        <line
                                        x1={colIndex * (gridSize()+2)}
                                        y1="0"
                                        x2={colIndex * (gridSize()+2) + gridSize()}
                                        y2={gridSize()}
                                        stroke="#E15759"
                                        stroke-width = "2"
                                        />
                                    </Show>

                                </>
                                
                            )
                        }
                        </For>
                    </g>
                )
            }
            </For>
   
            
            
            <g>
                <For each={props.binsByCol}>{
                    (bin,index) => (
                        <text
                        class="cursor-pointer"
                        x={index() * (gridSize()+2) + gridSize()/2}
                        y="-5"
                        style={{
                          transform: 'rotate(-30deg)',
                          "transform-origin": `${index() * (gridSize()+2) + gridSize()/2}px 0`,
                          "font-size":gridNum()>=15?"4px":"6px"
                        }}
                        onClick={()=>{
                            setPreSelection((selection:any[])=>{
                            let newSelection = selection.slice()
                            newSelection.push(index())
                            return newSelection
                        })
                        }}
                      >
                        {bin["key"]}
                      </text>
                    )
                }
                </For>
                <For each={preSelection()}>{
                    (selection,selectionIndex) => (
                        <g style={{transform:`translate(0px,${(selectionIndex()+1) * (-20)}px)`}}>
                            <For each={props.binsByCol}>{
                                (bin,index) => (
                                    <text
                                    x={index() * (gridSize()+2) + gridSize()/2}
                                    y="-5"
                                    fill={preSelection()[selectionIndex()] == index()?"#60a5fa":"black"}
                                    style={{
                                    transform: 'rotate(-30deg)',
                                    "transform-origin": `${index() * (gridSize()+2) + gridSize()/2 }px 0`,
                                    "font-size":"6px",
                                    "font-weight":"bold"
                                    
                                                                    
                                    }}
                                    onClick={()=>{
                                        setPreSelection((selection:any[])=>{
                                        let newSelection = selection.slice()
                                        newSelection.push(index())
                                        return newSelection
                                    })
                                    }}
                                >
                                    {bin["key"]}
                                </text>
                                )
                            }
                            </For>
                        </g>
                    ) 
                }
                </For>   
            </g>
        </g>
    )   
}


