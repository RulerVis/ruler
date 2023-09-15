import { Component,createSignal,Accessor,Setter} from "solid-js"
import { TableHead } from "./TableHead"
import { TableBody } from "./TableBody"
import { SetStoreFunction } from "solid-js/store"

export const Table:Component<{
    data:Accessor<any>,
    reactiveData:Accessor<any>,
    reactiveDataVisible:Accessor<boolean>,
    fields:Accessor<any>,
    setFields:Setter<string[]>,
    setFieldsSelection:SetStoreFunction<any>,
    setUnusedFields:Setter<string[]>,
    flagCollection:Accessor<any>,
    // --rank mode
    rankMode:any[],
    setRankMode:SetStoreFunction<any[]>


}>=(props) => {
    const [tableHeight,setTableHeight] = createSignal(500)


    return (
        <>
            <TableHead
            data={props.data}
            fields={props.fields}
            setFields={props.setFields}
            setFieldsSelection={props.setFieldsSelection}
            setUnusedFields={props.setUnusedFields}
            // -- rank mode
            rankMode = {props.rankMode}
            setRankMode = {props.setRankMode}
            />
            <TableBody
            data={props.data()}
            reactiveData={props.reactiveData}
            reactiveDataVisible={props.reactiveDataVisible()}
            flagCollection={props.flagCollection}/>
        </>
    )
}