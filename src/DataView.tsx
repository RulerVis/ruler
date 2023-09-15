import { Component,createSignal,createMemo,Accessor,Setter, onCleanup, Show,onMount} from "solid-js"
import { createStore, SetStoreFunction} from "solid-js/store"
import { Histogram } from "./histograms/Histogram" 
import { Table } from "./table/Table"
import { Footer } from "./Footer"

import { ObjectToList} from "./data/generateSample"
import { generateSample } from './data/generateSample'
import { dataGenerator } from "./data/generator"

import { initBarFilter } from "./filter/initFilter"
import { initLineFilter } from "./filter/initFilter"
import { initMatrixFilter } from "./filter/initFilter"
import { resetData } from "./rule/resetData"

import { initFieldsSelection } from "./init/initFieldsSelection"

import { DropDownMenu } from "./DropDownMenu"
import { ColorScaleLegend } from "./ColorLegend"

import { dataset, setDataset } from "./dataOption"
import Scrollbars from 'solid-custom-scrollbars'



export const DataView:Component<{
    setRuleCollection:Setter<any[]>,
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    data:any,
    setData:Setter<any>,
    fields:Accessor<any[]>,
    setFields:Setter<any[]>,
    fieldsSelection:any,
    setFieldsSelection:SetStoreFunction<any>,
    reactiveDataVisible:Accessor<boolean>,
    setReactiveDataVisible:Setter<boolean>,
    flagCollection:Accessor<any>,
    setFlagCollection:Setter<any>,
    // --svg data
    bins:Accessor<any>,
    binGroupsByCol:Accessor<any>,
    aggregatedLines:Accessor<any>,
    // --rank mode
    rankMode:any[],
    setRankMode:SetStoreFunction<any[]>,


}> = (props) => {

    
    const allData = generateSample()
    
    const [unusedFields,setUnusedFields] = createSignal<any[]>([])

    createMemo(()=>{
        props.setFieldsSelection(initFieldsSelection(props.fields(),allData))
    })

    const colNum = createMemo(()=>props.fields().length)

    
    createMemo(()=>{
        props.setData(ObjectToList(allData,props.fields(),props.fieldsSelection))
    })

    const rowNum = createMemo(()=>props.data().length)
    


    //bunch of filter
    const [barFilter,setBarFilter] = createStore<any>(initBarFilter(props.fields()))
    const [lineFilter,setLineFilter] = createStore<any>(initLineFilter(props.fields()))
    createMemo(()=>{setLineFilter(initLineFilter(props.fields()))})
    const [matrixFilter,setMatrixFilter] = createStore<any>(initMatrixFilter(props.fields()))

    const tableData = props.data() // static data for table

    const [reactiveData,setReactiveData] = createSignal(ObjectToList(props.originalData,props.fields(),props.fieldsSelection))
    //this function should be changed into fields-dependent
    createMemo(()=>{
        setReactiveData(ObjectToList(props.originalData(),props.fields(),props.fieldsSelection))
    })

   

    const [selectedAreaVisible,setSelectedAreaVisible] = createSignal<boolean>(false)

    const [scaleMode,setScaleMode] = createSignal<string>("mode1")

    const [height,setHeight] = createSignal<number>(400)

    const [zeroVisible,setZeroVisible] = createSignal<boolean>(false)

    const [tableHeight,setTableHeight] = createSignal<number>(500)


      



    const adjustTableHeight = () => {

        let overflowViewHeight = document.getElementById('OverflowView')?.clientHeight || 0;
        let histogramHeight = document.getElementById('VIS')?.clientHeight || 0;
        console.log("adjust")
        console.log(overflowViewHeight)
        console.log(histogramHeight)
        
        console.log(overflowViewHeight - histogramHeight)
        setTableHeight(overflowViewHeight - histogramHeight);
    }

    window.addEventListener("resize", adjustTableHeight)

    onCleanup(()=>{
        window.removeEventListener('resize', adjustTableHeight);
    })


    return (
        <div class="w-full h-full bg-light-50 flex flex-col" id="DATAVIEW">
            <div class="h-13 flex flex-row" id="HEADER">
                <svg>
                    <path d="M 0 0 L 200 0 L 150 60 L 0 60" fill="#e5e5e5"></path>
                    <text x="40" y="30" class="font-semibold" color="white" fill="#76B7B2" font-size="24">Ruler</text>
                </svg>
                <div class="flex-1 flex flex-row mt-4 text-gray-400 text-center">
                    {/* <div class="min-w-40 mr-10 h-10 border-2 border-gray-200 flex rounded-sm items-center">
                        <input type="file" id="file-input" class="hidden"/>
                        <label for="file-input" class="cursor-pointer px-2 ">
                            Choose File
                        </label>
                    </div> */}
                    <div class="w-40 mr-10 h-10 border-2 border-gray-200 flex rounded-md">
                        <DropDownMenu
                        options={[
                            { value: "dataset1", label: "airpollution.csv" },
                            { value: "dataset2", label: "trajectory.csv" },
                            { value: "dataset3", label: "houseprice.csv" },

                        ]}
                        datasetMode={dataset}
                        setDatasetMode={setDataset}
                        />
                    </div>
                    <div class="w-80 mr-10 h-10 border-2 border-gray-200 flex rounded-md">
                        <DropDownMenu
                        options={[
                            { value: "mode1", label: "Scale:linear; Color:sequential scheme" },
                            { value: "mode2", label: "Scale:log; Color:sequential scheme" },
                            { value: "mode3", label: "Scale:linear; Color:diverging scheme" },
                            { value: "mode4", label: "Scale:log ; Color:diverging scheme" }
                        ]}
                        currentMode={scaleMode}
                        setCurrentMode={setScaleMode}
                        />
                    </div>

               
                    <div class="w-25 h-10 text-center pt-2 rounded-lg cursor-pointer text-white border-1.5px" style={{"background-color":"#76B7B2","border-color":"#76B7B2","box-shadow": "0px 2px 2px 0px #0000001A"}}
                    onClick={()=>{props.setRuleCollection((value) => {
                        let result = value.slice()
                        result.push({barFilter:JSON.parse(JSON.stringify(barFilter)),lineFilter:JSON.parse(JSON.stringify(lineFilter)),matrixFilter:JSON.parse(JSON.stringify(matrixFilter)),len:props.originalData().length,data:props.originalData(),type:"interaction"})
                        console.log("all rules")
                        console.log(result)
                        return result})}}>
                        Rule
                    </div>
                    <div class="w-25 h-10 ml-5 mr-4 text-center pt-2 rounded-lg cursor-pointer border-1.5px" style={{"color":"#76B7B2","border-color":"#76B7B2","box-shadow": "0px 2px 2px 0px #0000001A"}}
                    onClick={()=>{resetData(setZeroVisible,setHeight,props.setOriginalData,props.setReactiveDataVisible,setSelectedAreaVisible,props.setFields,setUnusedFields,setBarFilter,setLineFilter,setMatrixFilter,props.setFlagCollection,props.fields,setScaleMode)}}>
                        Reset
                    </div>
                    <div class="flex-1"></div>
                    {/* <div class="mr-3 mt-3 cursor-pointer"
                    onClick={()=>setZeroVisible((value)=>(!value))}>
                        <Show when={zeroVisible() == true}> 
                            <i class="fa-solid fa-eye"></i>
                        </Show>
                        <Show when={zeroVisible() == false}>
                            <i class="fa-solid fa-eye-slash"></i>   
                        </Show>
                    </div> */}
                    <div class="mr-3">
                        <ColorScaleLegend min={0} max={100} scaleMode={scaleMode}/>
                    </div>
                </div>
            </div>
            
            <div class="mb-2px flex-1 h-full w-full overflow-x-scroll overflow-y-auto flex flex-col" id="OverflowView">
                    <Histogram 
                    fields={props.fields()}
                    fieldsSelection={props.fieldsSelection}
                    staticData={props.data}
                    colNum={colNum()}
                    // --reactive part
                    reactiveDataVisible={props.reactiveDataVisible}
                    setReactiveDataVisible={props.setReactiveDataVisible}
                    reactiveData={reactiveData}
                    originalData={props.originalData}
                    setOriginalData={props.setOriginalData}
                    //--svg data
                    bins={props.bins} 
                    binGroupsByCol={props.binGroupsByCol}
                    aggregatedLines={props.aggregatedLines}
                    //--filter part
                    barFilter = {barFilter}
                    setBarFilter = {setBarFilter}
                    lineFilter={lineFilter}
                    setLineFilter={setLineFilter}
                    matrixFilter={matrixFilter}
                    setMatrixFilter={setMatrixFilter}
                    setFlagCollection={props.setFlagCollection}
                    selectedAreaVisible={selectedAreaVisible}
                    setSelectedAreaVisible={setSelectedAreaVisible}
                    //-- scaleMode
                    scaleMode={scaleMode}
                    zeroVisible={zeroVisible}
                    // -- height
                    height = {height}
                    setHeight = {setHeight}
                    />
                    <div class="font-semibold border-gray-300 overflow overflow-y-scroll min-h-200px" style={{width:`${props.fields().length * 300 + 100}px`,height: `${tableHeight()}px` }} id="tableContainer">
                        <Table 
                        data = {props.data}
                        reactiveData={reactiveData}
                        reactiveDataVisible={props.reactiveDataVisible}
                        fields={props.fields}
                        setFields={props.setFields}
                        setFieldsSelection={props.setFieldsSelection}
                        setUnusedFields={setUnusedFields}
                        flagCollection={props.flagCollection}
                        // -- rank mode
                        rankMode = {props.rankMode}
                        setRankMode = {props.setRankMode}
                        /> 
                    </div> 
            </div>  

          
            <Footer
            rowNum={rowNum()}
            colNum={colNum()}
            reactiveData={reactiveData}
            reactiveDataVisible={props.reactiveDataVisible}
            selectionLength={props.originalData().length}
            unusedFields={unusedFields()}
            fields={props.fields}
            setFields={props.setFields}
            setUnusedFields={setUnusedFields}
            />
        </div>
    )
}