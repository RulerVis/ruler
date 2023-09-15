import { Component,Setter,For,createSignal,Show,Accessor } from  "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"
import * as lodash from "lodash"

import { FieldSelection } from "./FieldSelection"
import { ValueInput } from "./ValueInput"
import { OperatorSelection } from "./OperatorSelection"

export const PopupWindow:Component<{
    setPopupShow:Setter<boolean>,
    columnSet:any[],
    setColumnSet:SetStoreFunction<any[]>,
    link:any,
    setLink:SetStoreFunction<any>,
    currentIndex:number,
    fields:Accessor<any>

    

}> = (props) => {

    const [selectedIndex,setSelectedIndex] = createSignal<number>(-1)

    const typeList = ["cardinality","quantity","variance"]

    return (
        <div class="absolute top-1/8 right-1/30 w-300px h-auto max-h-300px bg-light-100 z-100000 border-4  border-gray-200 rounded-lg flex flex-col overflow-scroll">
            <div class="w-full">
                <div class="ml-1 mb-1 mt-3 font-bold mx-2px flex flex-row">
                    <div class="ml-2">Setting</div>
                    <div class="flex-1"></div>
                    <i class="fa-solid fa-check mt-1 mr-2 cursor-pointer" 
                    onClick={()=>{
                        //one-to-many template
                        if(props.currentIndex == -1){
                            let field1 = document.getElementById("LeftColumn") as HTMLSelectElement
                            props.setColumnSet(
                                (columnData:any,index:number) => index == 0,
                                produce((columnData:any)=>{
                                    columnData.fieldName = field1?.value
                                })
                            )
                            let field2 = document.getElementById("RightColumn") as HTMLSelectElement
                            props.setColumnSet(
                                (columnData:any,index:number) => index == 1,
                                produce((columnData:any)=>{
                                    columnData.fieldName = field2?.value
                                })
                            )
                            const operator = (document.getElementById("Operator") as HTMLSelectElement)?.value
                            const type = (document.getElementById("Type") as HTMLSelectElement)?.value
                            const value = (document.getElementById("Value") as HTMLSelectElement)?.value

                            props.setLink(
                                produce((link:any)=>{
                                    link.leftColumns.push(field1?.value)
                                    link.rightColumn = field2?.value
                                    link.operator = operator
                                    link.type = type
                                    link.value = value
                                })
                            )

                            console.log("link")
                            console.log(JSON.parse(JSON.stringify(props.link)))   
                        }
                        //one-to-one template
                        else if(props.currentIndex == -2){
                            let field1 = document.getElementById("LeftColumn") as HTMLSelectElement
                            props.setColumnSet(
                                (columnData:any,index:number) => index == 0,
                                produce((columnData:any)=>{
                                    columnData.fieldName = field1?.value
                                })
                            )
                            let field2 = document.getElementById("RightColumn") as HTMLSelectElement
                            props.setColumnSet(
                                (columnData:any,index:number) => index == 1,
                                produce((columnData:any)=>{
                                    columnData.fieldName = field2?.value
                                })
                            )
                            let operator = (document.getElementById("Operator") as HTMLSelectElement)?.value
                            props.setLink(
                                produce((link:any)=>{
                                    link.leftColumns.push(field1?.value)
                                    link.rightColumn = field2?.value
                                    link.operator = operator
                                    link.type = "nodes-nodes"
                                })
                            )
                            console.log("link")
                            console.log(JSON.parse(JSON.stringify(props.link))) 
                        }
                        else if(props.currentIndex >= 0){
                            //setting for block
                            let field = document.getElementById("ColumnName") as HTMLSelectElement
                            props.setColumnSet(
                                (columnData:any,index:number) => index == props.currentIndex,
                                produce((columnData:any)=>{
                                    columnData.fieldName = field?.value
                                })
                            )
                            for(let i=0;i<props.columnSet[props.currentIndex].values.length;i++){
                                let value = document.getElementById("Value" + (i+1).toString()) as HTMLInputElement
                                let operator = document.getElementById("Operator" + (i+1).toString()) as HTMLSelectElement
                                props.setColumnSet(
                                    (columnData:any,index:number) => index == props.currentIndex,
                                    produce((columnData:any)=>{
                                        let item:any={}
                                        item.value = value?.value
                                        item.operator = operator?.value
                                        columnData.values[i]=item
                                    })
                                )   
                            }
                            console.log("check columnSet")
                            console.log(JSON.parse(JSON.stringify(props.columnSet)))    
                        }
                        props.setPopupShow(false) 
                    }}></i>
                    <i class="fa-solid fa-xmark mt-1 mr-2 cursor-pointer" onClick={()=>props.setPopupShow(false)}></i>
                </div>
                <div class="mx-2px h-1 bg-gray-200"></div>
                <Show when={props.currentIndex>=0}>
                    <FieldSelection
                    title="ColumnName"
                    fields={props.fields()}
                    defaultValue={props.columnSet[props.currentIndex].fieldName}/>
                    <For each={props.columnSet[props.currentIndex].values}>{
                        (item,index) => (
                            <>
                                <ValueInput
                                title={"Value" + (index()+1).toString()}
                                defaultValue={item?.value??""}/>
                                <OperatorSelection 
                                title={"Operator" + (index()+1).toString()}
                                defaultValue={item?.operator??""}
                                option="block"/>
                                <Show when={index()<props.columnSet[props.currentIndex].values.length-1}>
                                    <div style="margin: 10px 0; display: flex; align-items: center;">
                                        <hr style="flex: 1; margin: 0 10px; border: 1px solid gray;"/>
                                        <div style="font-size: 12px; color: gray;">or</div>
                                        <hr style="flex: 1; margin: 0 10px; border: 1px solid gray;"/>
                                    </div>
                                </Show>
                            </>
                        )
                    }
                    </For>
                    <div class="flex flex-row">
                        <i class="ml-3 mb-2 fa-solid fa-circle-plus"
                        onClick={()=>{
                            props.setColumnSet(
                                (columnData:any,index:number) => index == props.currentIndex,
                                produce((columnData:any)=>{
                                    columnData.values.push({})
                                })
                            )
                        }}></i>
                        <i class="ml-3 mb-2 fa-solid fa-circle-minus"
                        onClick={()=>{
                            props.setColumnSet(
                                (columnData:any,index:number) => index == props.currentIndex,
                                produce((columnData:any)=>{
                                    columnData.values.pop()
                                })
                            )
                        }}></i>
                    </div>
                </Show>
                <Show when={props.currentIndex == -1}>
                    <FieldSelection
                    title="LeftColumn"
                    fields={props.fields()}
                    defaultValue={props.columnSet[0].fieldName}
                    />
                    <FieldSelection
                    title="RightColumn"
                    fields={props.fields()}
                    defaultValue={props.columnSet[1].fieldName}/>
                    <FieldSelection
                    title="Type"
                    fields={typeList}
                    defaultValue={props.link?.type??""}/>
                    <ValueInput
                    title="Value"
                    defaultValue={props.link?.value??""}/>
                    <OperatorSelection
                    title="Operator"
                    defaultValue={props.link?.operator??""}
                    option="ManyLink"/>
                </Show>
                <Show when={props.currentIndex == -2}>
                    <FieldSelection
                    title="LeftColumn"
                    fields={props.fields()}
                    defaultValue={props.columnSet[0].fieldName}/>
                    <FieldSelection
                    title="RightColumn"
                    fields={props.fields()}
                    defaultValue={props.columnSet[1].fieldName}/>
                    <OperatorSelection
                    title="Operator"
                    defaultValue={props.link.operator}
                    option="OneLink"/>
                </Show>
                
            </div>
        </div>
    )
}