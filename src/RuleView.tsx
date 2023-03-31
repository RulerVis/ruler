import { Component,Accessor,Setter,createSignal } from "solid-js"
import { createStore,SetStoreFunction } from "solid-js/store"
import { RulePanel } from "./right/RulePanel"
import { ShowPanel } from "./right/ShowPanel"

export const RuleView:Component<{
    originalData:Accessor<any>,
    setOriginalData:Setter<any>,
    fields:Accessor<any[]>,
    setFields:Setter<any[]>,
    fieldsSelection:any,
    setFieldsSelection:SetStoreFunction<any>,
    setReactiveDataVisible:Setter<boolean>,
    setFlagCollection:Setter<any>,
    ruleCollection:Accessor<any[]>,
    setRuleCollection:Setter<any[]>
    // --svg data
    bins:Accessor<any>,
    binGroupsByCol:Accessor<any>,
    aggregatedLines:Accessor<any>,


}> = (props) => {
    const [oneMode,setOneMode] = createSignal<boolean>(false)
    const [columnMode,setColumnMode] = createSignal<boolean>(false)
    const [columnSet,setColumnSet] = createStore<any[]>([{"values":[]},{"values":[]}])

    const [rowMode,setRowMode] = createSignal<boolean>(false)
    const [rowSet,setRowSet] = createStore<any[]>([{"values":[[{},{}]]}])

    const [ruleIndex,setRuleIndex] = createSignal<number>(-1)



    return (
        <div class="w-3/10 m-2 ml-1 flex flex-col">
            <RulePanel
            fields={props.fields}
            originalData={props.originalData}
            setOriginalData={props.setOriginalData}
            setReactiveDataVisible={props.setReactiveDataVisible}
            setFlagCollection={props.setFlagCollection}
            ruleCollection={props.ruleCollection}
            setRuleCollection={props.setRuleCollection}
            // -- svg data
            bins={props.bins}
            binGroupsByCol={props.binGroupsByCol}
            aggregatedLines={props.aggregatedLines}
            //
            oneMode={oneMode}
            setOneMode={setOneMode}
            columnMode={columnMode}
            setColumnMode={setColumnMode}
            columnSet={columnSet}
            setColumnSet={setColumnSet}
            rowMode={rowMode}
            setRowMode={setRowMode}
            rowSet={rowSet}
            setRowSet={setRowSet}
            ruleIndex={ruleIndex}
            setRuleIndex={setRuleIndex}


            />
            <ShowPanel
            ruleCollection={props.ruleCollection}
            setRuleCollection={props.setRuleCollection}
            //
            setOneMode={setOneMode}
            setColumnMode={setColumnMode}
            setColumnSet={setColumnSet}
            setRowMode={setRowMode}
            setRowSet={setRowSet}
            setRuleIndex={setRuleIndex}
            />
        </div>
    )
}