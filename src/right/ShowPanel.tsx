import { Component,Accessor,Setter,For,createSignal,createMemo,onMount,Show } from "solid-js"
import { createStore,SetStoreFunction,produce} from "solid-js/store" 
import * as d3 from "d3"
import { ruleToNL } from "../rule/ruleToNL"
import { activateFineTune } from "../rule/transfrom/activateFineTune"
import { generateSample } from "../data/generateSample"

import { WarningNotification } from "./WarningNotification"

import { exportData } from "./exportData"

export const ShowPanel:Component<{
    ruleCollection:Accessor<any[]>,
    setRuleCollection:Setter<any[]>,
    //
    setOneMode:Setter<boolean>,
    setColumnMode:Setter<boolean>,
    setColumnSet:SetStoreFunction<any[]>,
    setRowMode:Setter<boolean>,
    setRowSet:SetStoreFunction<any[]>,
    setRuleIndex:Setter<number>

}> = (props) => {

    const backgroundHeight = 40
    const ruleBarHeight = 30
    const Spacing = 5

    const minRowNum = 0
    const maxRowNum = createMemo(()=>(generateSample().length))
    const [maxRuleBarWidth,setMaxRuleBarWidth] = createSignal<number>(0)
    

    const [notifVisible,setNotifVisible] = createSignal(false)

    const rowSum = createMemo(()=>{
        let sum = 0
        for(let i=0;i<props.ruleCollection().length;i++){
            sum = sum + props.ruleCollection()[i].len
        }
        return sum
    })


    return (
        <div class="h-1/2 bg-light-50" id="show-panel">
            <WarningNotification
            notifVisible={notifVisible}
            setNotifVisible={setNotifVisible}/>
            <div class="w-full">
                <div class="flex flex-row mr-10px h-10 mb-10">
                    <svg width={150}>
                        <path d="M 0 0 L 140 0 L 100 60 L 0 60" fill="#e5e5e5"></path>
                        <text x="60" y="20" class="font-semibold" color="white" fill="#76B7B2" font-size="18" text-anchor="middle" dominant-baseline="middle">Errors</text>
                    </svg>
                    <div class="flex-1"></div>
                </div>
                <div class="mx-5">
                    <For each={props.ruleCollection()}>{
                        (rule,index) => (
                            <div class="flex flex-col mb-3">
                                <div class="flex flex-row h-8 w-full mb-2 items-center">
                                    <div class="text-white bg-yellow-500 font-bold rounded-sm mr-2 h-full px-2 pt-1 text-center  w-30">
                                        <div>Error</div>
                                    </div>
                                    <div class="flex-1 mr-2 rounded-sm relative h-full" style={{"background-color":"#F5F5F5"}} id={"ruleBarTitle"+index().toString()}> 
                                        <div class="absolute top-0 left-0 rounded-sm h-full" style={{"width":`${rule.len/maxRowNum() * 100}%`,"background-color":"#ECBC8D"}}></div>
                                    </div>
                                    <div class="mt-3 w-20">
                                        <div class="ml-2 pb-3" style={{"font-size":"16px","font-weight":"bold"}}><div>{(rule.len/maxRowNum() * 100).toFixed(1).toString()}%</div></div>
                                    </div>
                                </div>
                                <div class="flex flex-row h-15 w-full items-center">
                                    <div class="flex-1 mr-2 rounded-sm h-full overflow-hidden" style={{"background-color":"#F5F5F5"}}>
                                        <div class="px-8 py-3" style={{"color":"#a3a3a3","font-size":"small"}}>{ruleToNL(rule)}</div>
                                    </div>
                                    <div class="mt-3 w-20 flex flex-row">
                                        <i class="fa-solid fa-wrench ml-2 cursor-pointer fa-lg" style="color: #60a5fa;" onClick={()=>{
                                            activateFineTune(setNotifVisible,props.setOneMode,props.setColumnMode,props.setColumnSet,props.setRowMode,props.setRowSet,rule)
                                            props.setRuleIndex(index())
                                        }}></i>  
                                        <i class="fa-solid fa-trash-can ml-2 cursor-pointer fa-lg mr-2" style="color: #f87171;" onClick={()=>{
                                            console.log("click here")
                                            props.setRuleCollection((set:any[])=>{
                                                let newSet = set.slice()
                                                newSet.splice(index(),1)
                                                console.log("newSet")
                                                console.log(newSet)
                                                return newSet
                                            })                                                               
                                        }}></i>
  
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    </For>
                    <Show when={props.ruleCollection().length >=1}>
                        <div class="flex flex-row h-8 w-full mb-4 items-center">
                            <div class="w-10">
                                <i class="fas fa-arrow-up-right-from-square ml-3 cursor-pointer" style="color: #000;" onClick={()=>{exportData(props.ruleCollection())}}></i>
                            </div>
                            <div class="text-white bg-red-500 font-bold rounded-sm mr-2 h-full px-2 pt-1 text-center w-20">
                                <div>Sum</div>
                            </div>
                            <div class="flex-1 mr-2 rounded-sm relative h-full" style={{"background-color":"#F5F5F5"}}> 
                                <div class="absolute top-0 left-0 rounded-sm h-full" style={{"width":`${rowSum()/maxRowNum() * 100}%`,"background-color":"#ECBC8D"}}></div>
                            </div>
                            <div class="mt-3 w-20">
                                <div class="ml-2 pb-3" style={{"font-size":"16px","font-weight":"bold"}}><div>{(rowSum()/maxRowNum()>1?1:rowSum()/maxRowNum() * 100).toFixed(1).toString()}%</div></div>
                            </div>
                        </div>

                    </Show>
 

                </div>


                {/* <div class="mx-5px" id="ruleBarTitle">
                    <svg class="w-full h-600px">
                        <g>
                            <rect class="w-full h-50px"
                            y="5"
                            style={{fill:"#e5e5e5"}}>
                            </rect>
                            <rect style={{transform:`translate(0px, 10px)`}} height="40" width={widthScale()(rowSum())} fill="#EDC948"></rect>
                            <text x="10" y="30" dominant-baseline="middle" fill="#76B7B2" style={{"font-weight":"bold","font-size":"18px"}}>Errors</text>
                            <foreignObject x="95%" y="15px" width="60px" height="60px" class="cursor-pointer">
                                    <i class="fas fa-arrow-up-right-from-square" style="color: #000;" onClick={()=>{exportData(props.ruleCollection())}}></i>
                            </foreignObject>
                        </g>
                        <g style={{transform:`translate(0px, 60px)`}}>
                            <For each={props.ruleCollection()}>{
                                (rule,index) => (
                                    <g style={{transform:`translate(0px, ${index() * (backgroundHeight + Spacing)}px)`}}>
                                        <rect height="40px" style={{"fill":index()%2==1 ? "#e5e5e5": "#fdfdfd"}}></rect>
                                        <rect style={{transform:`translate(0px, 5px)`}} height="30" width={widthScale()(props.ruleCollection()[index()].len)} fill="#EDC948"></rect>
                                        <foreignObject x="0" y="10" class="w-full overflow-x-scroll h-40px" >
                                            <div class="flex flex-row"
                                            onMouseOver={()=>{setIconVisible(
                                                produce((iconVisible:any[]) => {iconVisible[index()]=true})
                                            )}}
                                            onMouseLeave={()=>{setIconVisible(
                                                produce((iconVisible:any[]) => {iconVisible[index()]=false})
                                            )}}>
                                                <Show when={iconVisible[index()]==true}>
                                                    <div class="flex flex-row items-center ml-2">
                                                        <i class="fa-solid fa-trash-can ml-2 cursor-pointer" style="color: #fd0808;" onClick={()=>{
                                                            console.log("click here")
                                                            props.setRuleCollection((set:any[])=>{
                                                                let newSet = set.slice()
                                                                newSet.splice(index(),1)
                                                                console.log("newSet")
                                                                console.log(newSet)
                                                                return newSet
                                                            })
                                                            
                                                        }}></i>
                                                        <i class="fa-solid fa-wrench ml-2 cursor-pointer" style="color: #1e67e6;" onClick={()=>{
                                                    activateFineTune(setNotifVisible,props.setOneMode,props.setColumnMode,props.setColumnSet,props.setRowMode,props.setRowSet,rule)
                                                    props.setRuleIndex(index())
                                                }}></i>
                                                    </div>
                                                </Show>
                                                <div style={{"font-size": "16px","white-space":"nowrap"}} class="ml-10px">
                                                        {ruleToNL(rule)}
                                                </div>
                                                <div class="flex-1"></div>
                                            </div>      
                                        </foreignObject>
                                    </g>
                                )
                            }
                            </For>
                        </g>
                    </svg>
                </div> */}
            </div>

        </div>
    )
}

const initIconVisible = (ruleCollection:any[]) => {
    let set:boolean[] = []
    for(let i=0;i<ruleCollection.length;i++){
        set.push(false)
    }
    return set
}