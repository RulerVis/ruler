import { index } from "d3";
import { create } from "lodash";
import { Component,For,Accessor,createMemo,createSignal } from "solid-js"
import { TableRow } from "./TableRow"

const  arrayEquals = (a: any[], b: any[]): boolean => {
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; ++i) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }


const computeIndexArray = (reactiveData:any,data:any,flagCollection:any) => {
    // console.log(reactiveData.length)
    // console.log(data.length)
    let indexArray=[]
    let lastIndex = 0
    let j=0
    for(let i=0;i<data.length;i++){
        if(flagCollection[i] == 0){
            indexArray.push(-1)
        }
        else{
            for(j=lastIndex;j<reactiveData.length;j++){
                if(arrayEquals(data[i],reactiveData[j])){
                    indexArray.push(j)
                    // console.log("indexArray")
                    // console.log(indexArray)
                    // console.log("j")
                    // console.log(j)
                    lastIndex = j + 1
                    break
                } 
            } 
            if(j==reactiveData.length) indexArray.push(-1)  
        }
        
    }
    // console.log("indexArray")
    // console.log(indexArray)

    return indexArray
}

export const TableBody:Component<{
    data:any,
    reactiveData:Accessor<any>,
    reactiveDataVisible:boolean,
    flagCollection:Accessor<any>
}>=(props) => {

    const indexArray = createMemo(()=>(computeIndexArray(props.reactiveData(),props.data,props.flagCollection())))


    return (
        <div class="w-full flex flex-col">
            <For each={props.data}>{
                (rowData,index) => (
                    <TableRow
                    reactiveData={props.reactiveData}
                    reactiveDataVisible={props.reactiveDataVisible}
                    rowData={rowData}
                    index={index()}
                    selectIndex={indexArray()[index()]}
                    rowFlag={props.flagCollection()[index()]}
                    />
                )
            }
            </For>
        </div>
    )
}