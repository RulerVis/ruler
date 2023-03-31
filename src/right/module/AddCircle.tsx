import { Component,Setter,Accessor } from "solid-js"
import { SetStoreFunction,produce} from "solid-js/store"

export const AddCircle:Component<{
    radius:number,
    dx:number,
    dy:number,
    setColumnSet?:SetStoreFunction<any[]>,
    columnIndex?:number,
    setRowSet?:SetStoreFunction<any[]>,
    rowNum?:Accessor<number>
}> = (props) => {

  
    return (
        <g style={{transform:`translate(${props.dx}px, ${props.dy}px)`}} 
        onClick={()=>{
            props.setColumnSet?.((list:any[])=>{
                let newList = list.slice()
                newList.push({"values":[]})
                return newList})
            props.setRowSet?.(
                (fieldRowData:any,index:number) => index == props.columnIndex,
                produce((fieldRowData:any)=>{
                    fieldRowData.values[0].push({})
                })
            )
            if(props.rowNum?.()??0 > 0){
                let length  = props.rowNum?.()??0
                props.setRowSet?.(
                    produce((rowSet:any[]) => {
                        let item:any = {"values":[[]]}
                        for(let i=0;i<length;i++){
                            item.values[0].push({})
                        }
                        rowSet.push(item)
                        // console.log("rowSet")
                        // console.log(rowSet)
                    })
                )
            } 
        }}
        >
            <circle
            cx={props.radius}
            cy={props.radius}
            r={props.radius}
            style={{"fill":"#737373"}}
            class="cursor-pointer"
            >
            </circle>
            <line
            style={{"stroke":"#FFF","stroke-width":"1.5"}}
            x1={props.radius}
            x2={props.radius}
            y1={0}
            y2={2 * props.radius}
            ></line>
            <line
            style={{"stroke":"#FFF","stroke-width":"1.5"}}
            x1={0}
            x2={2 * props.radius}
            y1={props.radius}
            y2={props.radius}
            ></line>
        </g>

    )
}