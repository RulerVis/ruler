import { Component } from "solid-js"

export const SeparateBar:Component<{
    maxBarWidth:number,
    gWidth:number,
    height:number
}> = (props) => {
    return (
        <g>
            <rect
                x={props.maxBarWidth + 5}
                y="0"
                height={props.height}
                width="3"
                style = {{fill:"#ACBAB7",opacity:"60%"}}
                >
                </rect>
                <rect
                x={props.gWidth - 5 - 3 }
                y="0"
                height={props.height}
                width="3"
                style = {{fill:"#ACBAB7",opacity:"60%"}}
                >
            </rect>
        </g>
    )

}