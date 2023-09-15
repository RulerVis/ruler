import { Component,Accessor,Setter } from "solid-js"

export const ModeSelection:Component<{
    oneMode:Accessor<boolean>,
    manyMode:Accessor<boolean>,
    rowMode:Accessor<boolean>,
    setRowMode:Setter<boolean>,
    setColumnMode:Setter<boolean>,
    setOneMode:Setter<boolean>,
    setManyMode:Setter<boolean>



}>=(props)=>{
    return (
        <div class="flex flex-row mt-3 justify-center">
            <div class="flex flex-row mr-4">
                <div class="mr-1">one-one</div>
                <input type="checkbox"
                checked={props.oneMode()}
                onClick={(e)=>{
                    props.setOneMode(e.currentTarget.checked)
                    props.setColumnMode(e.currentTarget.checked)
                }}/>
            </div>
            <div class="flex flex-row mr-4">
                <div class="mr-1">one-many</div>
                <input type="checkbox"
                checked={props.manyMode()}
                onClick={(e)=>{
                    props.setManyMode(e.currentTarget.checked)
                    props.setColumnMode(e.currentTarget.checked)
                }}/>
            </div>
            <div class="flex flex-row mr-4">
                <div class="mr-1">sequential</div>
                <input type="checkbox"
                checked={props.rowMode()}
                onClick={(e)=>{
                    props.setRowMode(e.currentTarget.checked)
                }}/>
            </div>
        </div>
    )

}