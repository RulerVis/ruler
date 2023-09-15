import { Component,Setter,For,createSignal,Show,Accessor } from  "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"
import * as lodash from "lodash"

import { FieldSelection } from "../popup/FieldSelection"
import { ValueInput } from "../popup/ValueInput"
import { OperatorSelection } from "../popup/OperatorSelection"
import { variance } from "d3"



export const SetupWindow:Component<{
    setSetupShow:Setter<boolean>,
    columnIndex:number,
    rowIndex:number,
    rowSet:any[],
    setRowSet:SetStoreFunction<any[]>,
    variance:any,
    setVariance:SetStoreFunction<any>,
    fields:Accessor<any>
}> = (props) => {



    return (
        <div class="absolute top-1/8 right-1/30 w-300px h-auto max-h-300px bg-light-100 z-100000 border-4  border-gray-200 rounded-lg flex flex-col overflow-scroll">
            <div class="w-full">
                <div class="ml-1 mb-1 mt-3 font-bold mx-2px flex flex-row">
                    <div class="ml-2">Setting</div>
                    <div class="flex-1"></div>
                    <i class="fa-solid fa-check mt-1 mr-2 cursor-pointer" 
                    onClick={()=>{
                       
                        if(props.columnIndex >= 0){
                            let field = (document.getElementById("ColumnName") as HTMLSelectElement)?.value
                            let value = (document.getElementById("Value") as HTMLInputElement)?.value
                            let operator = (document.getElementById("Operator") as HTMLSelectElement)?.value
                            props.setRowSet(
                                (fieldRowData:any,index:number) => index == props.columnIndex,
                                produce((fieldRowData:any)=>{
                                    fieldRowData.fieldName = field
                                    fieldRowData.values[0][props.rowIndex].value = value
                                    fieldRowData.values[0][props.rowIndex].operator = operator
                                })
                            )
                            console.log("rowSet")
                            console.log(JSON.parse(JSON.stringify(props.rowSet)))
                        }
                        else if(props.columnIndex == -1){
                            let field = (document.getElementById("ColumnName") as HTMLSelectElement)?.value
                            let value = (document.getElementById("Variance") as HTMLInputElement)?.value
                            let operator = (document.getElementById("Operator") as HTMLSelectElement)?.value
                            props.setRowSet(
                                (fieldRowData:any,index:number) => index == 0,
                                produce((fieldRowData:any)=>{
                                    fieldRowData.fieldName = field
                                })
                            )
                            props.setVariance(produce((variance:any)=>{
                                variance.value = value
                                variance.operator = operator
                            }
                            ))


                        }
                        props.setSetupShow(false)
                        }}></i>
                    <i class="fa-solid fa-xmark mt-1 mr-2 cursor-pointer"
                    onClick={()=>{props.setSetupShow(false)}}></i>
                </div>
                <div class="mx-2px h-1 bg-gray-200"></div> 
                <Show when={props.columnIndex>=0}>
                    <FieldSelection
                    title="ColumnName"
                    fields={props.fields()}
                    defaultValue={props.rowSet[props.columnIndex]?.fieldName??""}/>
                    <ValueInput
                    title={"Value"}
                    defaultValue={props.rowSet[props.columnIndex].values[0][props.rowIndex]?.value??""}/>
                    <OperatorSelection 
                    title={"Operator"}
                    defaultValue={props.rowSet[props.columnIndex].values[0][props.rowIndex]?.operator??""}
                    option="block"/>

                </Show>  
                <Show when={props.columnIndex==-1}>
                    <FieldSelection
                    title="ColumnName"
                    fields={props.fields()}
                    defaultValue={props.rowSet[0]?.fieldName??""}/>
                    <ValueInput
                    title={"Variance"}
                    defaultValue={props.variance?.value??""}/>
                    <OperatorSelection 
                    title={"Operator"}
                    defaultValue={props.variance?.operator??""} 
                    option="ManyLink"/>
                </Show> 
            </div>
        </div>
    )
}