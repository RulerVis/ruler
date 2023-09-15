import { Component } from "solid-js"

export const VerticalLine:Component<{
    length:number,
    dx:number,
    dy:number

}> = (props) => {
    return (
        <g style={{transform:`translate(${props.dx}px,${props.dy}px)`}}>
            <line
            x1={0}
            y1={0}
            x2={0}
            y2={props.length}
            stroke="#d6d3d1"
            stroke-width={2}>
            </line>
        </g>
    )
}