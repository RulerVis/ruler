import { Component } from "solid-js"

export const HorizontalLine:Component<{
    length:number,
    dx:number,
    dy:number

}> = (props) => {
    return (
        <g style={{transform:`translate(${props.dx}px,${props.dy}px)`}}>
            <line
            x1={0}
            y1={0}
            x2={props.length}
            y2={0}
            stroke="#d6d3d1"
            stroke-width={2}>
            </line>
        </g>
    )
}