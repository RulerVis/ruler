import {Component,Show} from "solid-js"

export const OperatorSelection:Component<{
    title:string,
    defaultValue:string,
    option:string
}>=(props) => {
    return (
        <>
            <Show when={props.option == "block"}>
                <div class="flex flex-row mt-3 mb-3 text-sm">
                    <div class="mx-3 w-30 font-medium ">Operator</div>
                    <select class="px-2 py-1 border rounded-sm" id={props.title} value={props.defaultValue}>
                        <option value="equal to">{"equal to"}</option>
                        <option value="not equal to">{"not equal to"}</option>
                        <option value="larger than">{"larger than"}</option>
                        <option value="smaller than">{"smaller than"}</option>
                        <option value="in">{"in"}</option>
                        <option value="not in">{"not in"}</option>
                    </select>  
                </div>
            </Show>
            <Show when={props.option == "OneLink"}>
                <div class="flex flex-row mt-3 mb-3 text-sm">
                    <div class="mx-3 w-30 font-medium ">Operator</div>
                    <select class="px-2 py-1 border rounded-sm" id={props.title} value={props.defaultValue}>
                        <option value="equal to">{"equal to"}</option>
                        <option value="not equal to">{"not equal to"}</option>
                        <option value="larger than">{"larger than"}</option>
                        <option value="smaller than">{"smaller than"}</option>
                    </select>  
                </div>
            </Show>
            <Show when={props.option == "ManyLink"}>
                <div class="flex flex-row mt-3 mb-3 text-sm">
                    <div class="mx-3 w-30 font-medium ">Operator</div>
                    <select class="px-2 py-1 border rounded-sm" id={props.title} value={props.defaultValue}>
                        <option value="equal to">{"equal to"}</option>
                        <option value="not equal to">{"not equal to"}</option>
                        <option value="larger than">{"larger than"}</option>
                        <option value="smaller than">{"smaller than"}</option>
                    </select>  
                </div>
            </Show>
        </>


    )
}