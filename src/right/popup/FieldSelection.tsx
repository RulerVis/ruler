import {Component,For} from "solid-js"

export const FieldSelection:Component<{
    title:string,
    fields:any[],
    defaultValue:string

}>=(props) => {
    return (
        <div class="flex flex-row mt-3 mb-3 text-sm">
            <div class="mx-3 w-30 font-medium">{props.title}</div>
            <select class={"px-2 py-1 border rounded-sm "} id={props.title} value={props.defaultValue}>
                <For each={props.fields}>{
                    (field,index) => (
                        <option value={field}>{field}</option>
                    )
                }
                </For>
            </select>  
        </div>


    )
}