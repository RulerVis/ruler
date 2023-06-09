import { Component, createSignal,createMemo,onMount} from 'solid-js'
import { createStore } from "solid-js/store"
import  _  from "lodash"
import { DataView } from "./DataView"
import { RuleView } from "./RuleView"

import { generateSample } from './data/generateSample'
import { initFieldsSelection } from "./init/initFieldsSelection"
import { ObjectToList } from './data/generateSample'
import { computeBins } from './data/aggregation'
import { computeAggregatedLines } from './data/aggregation'
import { initFlag } from "./init/initFlag"
import { initRankMode } from './rank/initRankMode'



 export const Ruler: Component<{
  
}> = (props) => {
  // setTimeout(()=>{console.log(props.key)},0)

  const [originalData,setOriginalData]=createSignal(generateSample())

  const allData = generateSample()

  const [fields,setFields] = createSignal(Object.keys(originalData()[0])) //selected fields

  const [fieldsSelection,setFieldsSelection] = createStore(initFieldsSelection(fields(),allData)) //expanded version of fields -- with type

  const [data,setData] = createSignal(ObjectToList(allData,fields(),fieldsSelection)) //this is data is for static layout, only affected by fields(), not by originalData()

  const [rankMode,setRankMode] = createStore<any[]>(initRankMode(fields()))

  createMemo(()=>{
    setRankMode(initRankMode(fields()))
  })

  const bins = createMemo(()=>computeBins(data(),fieldsSelection,rankMode))
  const binGroupsByCol = createMemo(()=>_.groupBy(bins(), "colIndex"))
  const aggregatedLines = createMemo(()=>computeAggregatedLines(data(),binGroupsByCol(),fields().length))

  const [ruleCollection,setRuleCollection] = createSignal<any[]>([])

  const [ reactiveDataVisible,setReactiveDataVisible ] = createSignal<boolean>(false)

  const [flagCollection,setFlagCollection]  = createSignal<any>(initFlag(data().length))

  
  const [tableHeight,setTableHeight] = createSignal<number>(500)


  

  return (
    <div class="flex flex-row w-screen h-screen overflow-hidden bg-neutral-200">
      <DataView
      setRuleCollection={setRuleCollection}
      originalData={originalData}
      setOriginalData={setOriginalData}
      data={data}
      setData={setData}
      fields={fields}
      setFields={setFields}
      fieldsSelection={fieldsSelection}
      setFieldsSelection={setFieldsSelection}
      reactiveDataVisible={reactiveDataVisible}
      setReactiveDataVisible={setReactiveDataVisible}
      flagCollection={flagCollection}
      setFlagCollection={setFlagCollection}
      // -- svg data
      bins={bins}
      binGroupsByCol={binGroupsByCol}
      aggregatedLines={aggregatedLines}
      // -- rank mode
      rankMode = {rankMode}
      setRankMode = {setRankMode}
 
      />
      <RuleView
      originalData={originalData}
      setOriginalData={setOriginalData}
      fields={fields}
      setFields={setFields}
      fieldsSelection={fieldsSelection}
      setFieldsSelection={setFieldsSelection}
      setReactiveDataVisible={setReactiveDataVisible}
      setFlagCollection={setFlagCollection}
      ruleCollection={ruleCollection}
      setRuleCollection={setRuleCollection}
      // -- svg data
      bins={bins}
      binGroupsByCol={binGroupsByCol}
      aggregatedLines={aggregatedLines}

      />
    </div>
  )
};


