import {Component} from "solid-js"

export const ValueInput:Component<{
    title:string,
    defaultValue:string

}>=(props) => {
    return (
        <div class="flex flex-row mt-3 mb-3 text-sm ">
            <div class="mx-3 w-30 font-medium">Value</div>
            <input type="text" class={"border rounded-sm text-center " + props.title} id={props.title}  size="15" value={props.defaultValue}/>
        </div>

        
    )
}