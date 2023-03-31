import { Component,For,Accessor,Setter,Switch, Match,createMemo} from "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"



export const TableHead:Component<{
    data:Accessor<any>,
    fields:Accessor<any>,
    setFields:Setter<string[]>,
    setFieldsSelection:SetStoreFunction<any>,
    setUnusedFields:Setter<string[]>,
    // --rank mode
    rankMode:any[],
    setRankMode:SetStoreFunction<any[]>

}>=(props) => {

    // createMemo(()=>{
    //     console.log("check mode")
    //     console.log(JSON.parse(JSON.stringify(props.rankMode)))

    // })

    
    return (
        <div class="w-full h-10 flex flex-row sticky top-0">
            <For each={props.fields()}>{
                (field,index) => (
                    <div class="bg-neutral-100 pt-2 mr-5px" style={{"box-shadow": "0px 2px 2px 0px #0000001A"}}>
                        <div class="w-295px pl-2 flex">
                            <div>{field}</div>
                            <div class="flex-1"></div>
                            <div class="mr-4 h-6 flex flex-row">
                                <input 
                                id={"input-"+index().toString()}
                                class="text-center border-2 border-neutral-200 rounded-md input"
                                size="1"
                                style={{"background-color":"#f5f5f5",color:"#60a5fa","font-weight":"bold"}}/>
                                
                            </div>
                            <div class="mr-4 cursor-pointer"
                            onClick={()=>{
                                let element = document.getElementById("input-"+index().toString()) as HTMLInputElement
                                let num = Number(element?.value)
                                props.setFieldsSelection(
                                    (fieldSelection:any) => fieldSelection.name == field,
                                    produce((fieldSelection:any)=>{
                                        if(fieldSelection.type == "quantitative"){
                                            fieldSelection.binNum = num
                                        }
                                    })
                                )
                            }}>
                                <i class="fa-regular fa-circle-check "></i>
                            </div>
                            <div class="mr-4 cursor-pointer"
                            onClick={()=>{
                                props.setFieldsSelection(
                                    (fieldSelection:any) => fieldSelection.name == field,
                                    produce((fieldSelection:any)=>{
                                        if(fieldSelection.adjust == true){
                                            if(fieldSelection.type == "nominal") fieldSelection.type = "quantitative"
                                            else if(fieldSelection.type == "quantitative") fieldSelection.type = "nominal"
                                        }
                                    })

                                )
                            }}>
                                <i class="fas fa-sort fa-xs"></i>
                            </div>
                            <div class="mr-4 cursor-pointer">
                                <Switch>
                                    <Match when={JSON.parse(JSON.stringify(props.rankMode)).filter((item:any)=>(item.name == field))[0]["mode"]=="default" || JSON.parse(JSON.stringify(props.rankMode)).filter((item:any)=>(item.name == field))[0]["mode"]=="down"}>
                                        <i class="fas fa-arrow-up-wide-short fa-xs"
                                        onClick={()=>{
                                            props.setRankMode(
                                                (item:any) => item.name == field,
                                                produce((item:any)=>{
                                                    item.mode = "up"
                                                })
                                            )
                                        }}
                                        ></i>
                                    </Match>
                                    <Match when={JSON.parse(JSON.stringify(props.rankMode)).filter((item:any)=>(item.name == field))[0]["mode"]=="up"}>
                                        <i class="fas fa-arrow-down-short-wide fa-xs"
                                        onClick={()=>{
                                            props.setRankMode(
                                                (item:any) => item.name == field,
                                                produce((item:any)=>{
                                                    item.mode = "down"
                                                })
                                            )
                                        }}
                                        ></i>
                                    </Match>
                                </Switch>
                            </div>
                            <div class="mr-4 cursor-pointer"
                            onClick={()=>{
                                props.setFields((fields)=>(fields.filter((f:string)=>(f != field))))
                                props.setUnusedFields((f)=>{
                                    let result = f.slice()
                                    result.push(field)
                                    return result 
                                })
                                }}>
                                <i class="fas fa-xmark fa-xs"></i>
                            </div>
                            
                        </div>
                    </div>
                )
            }

            </For>

        </div>
    )
}

