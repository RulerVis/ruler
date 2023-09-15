import { Component,For,Accessor,createMemo,Setter } from "solid-js"
import * as d3 from "d3"
import * as lodash from "lodash"


export const ReactiveMatrix:Component<{
    fieldName:any,
    width:number,
    gridNum:number
    reactiveBinsByCol:any,
    densityMatrix:any,
    maxDensity:any

}> = (props) => {

    const gridSize = createMemo(()=>(props.width - 2 * (props.gridNum - 1)) / props.gridNum)




    return (
        <g>
            <For each={lodash.range(0,props.gridNum)}>{
                (rowIndex) => (
                    <g style={{transform:`translate(0px,${rowIndex * (gridSize()+2)}px)`}}>
                        <For each={lodash.range(0,props.gridNum)}>{
                            (colIndex)=>(
                                <rect 
                                width={gridSize()}
                                height={gridSize()}
                                stroke="gray" 
                                stroke-opacity="0.8"
                                stroke-width="0.1"
                                x={colIndex * (gridSize()+2)}
                                y="0"
                                style = {{fill:d3.interpolateGreys(props.densityMatrix[rowIndex][colIndex]/props.maxDensity.max)}}
                                
                                
                             
                                >
                                </rect>
                            )
                        }
                        </For>
                    </g>
                )
            }
            </For>
            {/* <g>
                <For each={props.reactiveBinsByCol}>{
                    (bin,index) => (
                        <text
                        x={index() * (gridSize()+2) + gridSize()/2}
                        y="-5"
                        style={{
                          transform: 'rotate(-45deg)',
                          "transform-origin": `${index() * (gridSize()+2) + gridSize()/2}px 0`,
                          "font-size":"8px"
                        }}
                      >
                        {bin["key"]}
                      </text>
                    )
                }
                </For>
            </g> */}
        </g>
    )
    
}