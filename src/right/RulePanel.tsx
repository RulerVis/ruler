import { Component,For,createSignal,Accessor,createMemo,Show,Setter } from "solid-js"
import { createStore,produce,SetStoreFunction } from "solid-js/store"
import { generateSample } from "../data/generateSample"

import { ColumnPanel } from "./column/ColumnPanel"
import { RowPanel} from "./row/RowPanel"

import { ModeSelection } from "./ModeSelection"
import { PopupWindow } from "./popup/PopupWindow"

import { SetupWindow } from "./setup/SetupWindow"

import { filterOneToOne } from "../filter/ruleFilter"
import { filterOneToMany } from "../filter/ruleFilter"
import { filterSequence } from "../filter/ruleFilter"

import { addRule } from "./addRule"


export const RulePanel:Component<{
    fields:Accessor<any>,
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    setReactiveDataVisible:Setter<boolean>,
    setFlagCollection:Setter<any>,
    ruleCollection:Accessor<any[]>,
    setRuleCollection:Setter<any[]>
    // --svg data
    bins:Accessor<any>,
    binGroupsByCol:Accessor<any>,
    aggregatedLines:Accessor<any>,
    //
    oneMode:Accessor<boolean>,
    setOneMode:Setter<boolean>,
    columnMode:Accessor<boolean>,
    setColumnMode:Setter<boolean>,
    columnSet:any[],
    setColumnSet:SetStoreFunction<any[]>,
    rowMode:Accessor<boolean>,
    setRowMode:Setter<boolean>,
    rowSet:any,
    setRowSet:SetStoreFunction<any[]>,
    ruleIndex:Accessor<number>,
    setRuleIndex:Setter<number>

}> = (props) => {



    const [popupShow,setPopupShow] = createSignal<boolean>(false)
    const [setupShow,setSetupShow] = createSignal<boolean>(false)
    
    
   
    
    const [manyMode,setManyMode] = createSignal<boolean>(false)

    // -- column-level
   
    const [currentIndex,setCurrentIndex] = createSignal<number>(-1)
    const [link,setLink] = createStore<any>({"leftColumns":[]})

    // -- row-level

    const [variance,setVariance] = createStore<any>({})
    const [rowIndex,setRowIndex] = createSignal(-1)
    const [columnIndex,setColumnIndex] = createSignal(-1)



    createMemo(()=>{
        console.log("check link")
        console.log(JSON.parse(JSON.stringify(link)))
    })


    const colorSet = ["#3b82f6","#f87171","#a78bfa","#34d399"]

    return (
        <div class="h-1/2 bg-light-50 mb-2 flex flex-col">
            <div class="flex-1 flex flex-col" id="board">
                <div class="w-full h-10 flex flex-row">
                    <svg>
                        <path d="M 0 0 L 140 0 L 100 60 L 0 60" fill="#e5e5e5"></path>
                        <text x="60" y="20" class="font-semibold" color="white" fill="#76B7B2" font-size="18" text-anchor="middle" dominant-baseline="middle">Search</text>
                    </svg>
                    <div class="flex-1"></div>
                    <ModeSelection
                    oneMode={props.oneMode}
                    manyMode={manyMode}
                    rowMode={props.rowMode}
                    setRowMode={props.setRowMode}
                    setColumnMode={props.setColumnMode}
                    setOneMode={props.setOneMode}
                    setManyMode={setManyMode}/>
                </div>
                <div class="w-full flex-1">
                    <div class="w-full h-full mx-2" id="node-level">
                        <svg class="w-full h-full">
                            <Show when={props.columnMode() == true}>
                                <g style={{transform:`translate(400px,200px)`}}>
                                    <ColumnPanel
                                    oneMode={props.oneMode}
                                    manyMode={manyMode}
                                    link={link}
                                    columnSet={props.columnSet}
                                    setColumnSet={props.setColumnSet}
                                    setPopupShow={setPopupShow}
                                    setCurrentIndex={setCurrentIndex}/>
                                </g>
                            </Show>
                            <Show when={props.rowMode() == true}>
                                <g style={{transform:`translate(200px,150px)`}}>
                                    <RowPanel
                                    setSetupShow={setSetupShow}
                                    setColumnIndex={setColumnIndex}
                                    setRowIndex={setRowIndex}
                                    rowSet={props.rowSet}
                                    setRowSet={props.setRowSet}
                                    variance={variance}
                                    />
                                </g>
                            </Show>
                        </svg>
                    </div>
           
                </div>
                <Show when={popupShow()==true}>
                    <PopupWindow
                    setPopupShow={setPopupShow}
                    columnSet={props.columnSet}
                    setColumnSet={props.setColumnSet}
                    link={link}
                    setLink={setLink}
                    currentIndex={currentIndex()}
                    fields={props.fields}/>
                </Show>
                <Show when={setupShow()==true}>
                    <SetupWindow
                    setSetupShow={setSetupShow}
                    columnIndex={columnIndex()}
                    rowIndex={rowIndex()}
                    rowSet={props.rowSet}
                    setRowSet={props.setRowSet}
                    variance={variance}
                    setVariance={setVariance}
                    fields={props.fields}/>
                </Show>
            </div>
            <div class="h-1/10 mb-4">
                <div class="flex flex-row-reverse  items-center h-full ">
                    <div class="p-1 px-5 border-1.5px rounded-lg cursor-pointer mr-8" style={{"color":"#76B7B2","border-color":"#76B7B2","box-shadow": "0px 2px 2px 0px #0000001A"}}
                        onClick={()=>{
                            props.setOriginalData(generateSample())
                            props.setReactiveDataVisible(false)
                            props.setRowMode(false)
                            props.setColumnMode(false)
                            props.setOneMode(false)
                            setManyMode(false)
                            props.setColumnSet([{"values":[]},{"values":[]}])
                            setVariance(
                                produce((variance:any)=>{
                                    variance.operator = ""
                                    variance.value = ""
                                })
                            )
                            props.setRowSet([{"values":[[{},{}]]}])
                            setLink(
                                produce((link:any)=>{
                                    link.leftColumns = []
                                    link.rightColumn = ""
                                    link.value = ""
                                    link.operator = ""
                                    link.type = ""
                                })
                            )
                            props.setRuleIndex(-1)
                        }}>Clear</div>
                        <div class="p-1 px-5 cursor-pointer border-1.5px rounded-lg text-white mr-8" style={{"background-color":"#76B7B2","border-color":"#76B7B2","box-shadow": "0px 2px 2px 0px #0000001A"}}
                        onClick={()=>{addRule(props.ruleIndex,props.setRuleCollection,props.originalData,props.columnSet,link,props.rowSet,variance,props.oneMode,manyMode,props.rowMode)}}>Rule</div>

                        <div class="p-1 px-5 rounded-md cursor-pointer mr-8" style={{"color":"#3b82f6","font-weight":"bold"}}
                        onClick={()=>{
                            if(props.oneMode() == true) {
                                filterOneToOne(props.setOriginalData,props.columnSet,link) 
                                props.setReactiveDataVisible(true)
                            }
                            else if(manyMode() == true){
                                filterOneToMany(props.setOriginalData,props.columnSet,link,setLink) 
                                props.setReactiveDataVisible(true)
                            }
                            else if(props.rowMode() == true){
                                filterSequence(props.setOriginalData,props.setFlagCollection,props.rowSet,variance)
                                props.setReactiveDataVisible(true)
                            }
                        }}>Search</div>
                </div>
                
            </div>
        </div>
    )
}