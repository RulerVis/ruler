import { Component,createSignal,Accessor,Setter,For,createMemo,Show } from "solid-js"

import { scrollToRow } from "./interaction/scrollToRow"

import { moveField } from "./drag/moveField"

false&&moveField

export const Footer:Component<{
    rowNum:number,
    colNum:number,
    reactiveData:Accessor<any>,
    reactiveDataVisible:Accessor<boolean>,
    selectionLength:number,
    unusedFields:any[],
    fields:Accessor<any[]>,
    setFields:Setter<string[]>,
    setUnusedFields:Setter<string[]>
}> = (props) => {

    const [currentIndex,setCurrentIndex] = createSignal<number>(-1)
    createMemo(()=>{
        setCurrentIndex(props.reactiveData().length - props.reactiveData().length -1)
        let row = document.getElementById("select-row-0")
        row?.scrollIntoView({ behavior: "smooth",block:"center"})
    })

    return (
        <div id="FOOTER">
            <div class="flex mr-4 ml-2 " id="fieldContainer">
                <div class="flex items-center text-gray-400 text-xs min-w-30">Used Columns</div>
                <For each={props.fields()}>{
                    (field,index) => (
                        <>
                            <div class={"divider"+ index().toString() + " w-4 divider" } onDragOver={(event:DragEvent)=>{event.preventDefault()}}></div>
                            <div class="flex p-1 font-semibold rounded-md text-xs cursor-move" draggable={true} id={field} style={{"background-color":"#DDEBE8"}}
                            onDragOver={(event:DragEvent)=>{event.preventDefault()}}
                            use:moveField={{field:field,fields:props.fields,setFields:props.setFields}}>
                                {field}
                            </div>
                            <Show when={index() == props.fields().length -1}>
                                <div class="divider1000 w-4 divider"  onDragOver={(event:DragEvent)=>{event.preventDefault()}}></div>
                            </Show>
                        </>

                    )
                }
                </For>
                <div class="flex-1"></div>
                <div class="text-blue-600 font-semibold mr-4 text-sm">
                    {props.selectionLength} results found  
                </div>
                <div class="text-blue-600 font-semibold mr-4 cursor-pointer text-sm"
                onClick={(event:MouseEvent)=>scrollToRow(event,props.reactiveData,props.reactiveDataVisible,currentIndex,setCurrentIndex,-1)}>
                    {"<<"+ "Last"}
                </div>
                <div class="text-blue-600 font-semibold cursor-pointer text-sm"
                onClick={(event:MouseEvent)=>scrollToRow(event,props.reactiveData,props.reactiveDataVisible,currentIndex,setCurrentIndex,1)}>
                    {"Next" + ">>"}
                </div>
            </div>
            <div class="flex flex-row m-4 ml-2 mt-2">
                <div class="flex items-center text-gray-400 text-xs min-w-30">Unused Columns</div>
                <div class="flex flex-1">
                    <For each={props.unusedFields}>{
                        (unusedField,index) => (
                            <div class="flex ml-4 p-1 font-semibold bg-gray-100 rounded-md text-xs cursor-pointer"
                            onClick={()=>{
                                props.setFields((f)=>{
                                    let result = f.slice()
                                    result.push(unusedField)
                                    console.log("pushed")
                                    console.log(result)
                                    return result
                                })
                                props.setUnusedFields((f)=>(f.filter((t)=>(t!=unusedField))))
                            }}
                            >
                                {unusedField}
                            </div>
                        )
                    }
                    </For>
                </div>
                <div class="text-gray-400 text-sm">
                    {props.rowNum} rows {props.colNum} columns
                </div>
                
             </div>
        </div>
        
    )
}