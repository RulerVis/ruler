import { findIndex } from "lodash";
import { Component,For,createSignal,createMemo,Accessor,Setter } from "solid-js"



const isArrayInArray = (arr: any[][], target: any[]): boolean => {
    return arr.some((subArr) => {
      return subArr.length === target.length && subArr.every((val, index) => val === target[index]);
    });
}



export const TableRow:Component<{
    reactiveData:Accessor<any>,
    reactiveDataVisible:boolean,
    rowData:any,
    index:number,
    selectIndex:number,
    rowFlag:any
}>=(props) => {

    return (
        <div class="h-10 flex flex-row single-row" id={"select-row-" + props.selectIndex.toString()}>
            <For each={props.rowData}>{
                (cellData,index) => (
                    <div class="self-center pt-2 pb-2 mr-5px"  style={{"background-color":(isArrayInArray(props.reactiveData(),props.rowData) && props.reactiveDataVisible && props.rowFlag)?"#EDC948":(props.index%2==0?"#fff":"#f5f5f5")}}>
                        <div class={"w-295px pl-2 font-medium"}>{cellData}</div>
                    </div>  
                )
            }
            </For>
        </div>
    )
}

