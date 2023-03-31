import { Component,Accessor,createSignal,Show,Setter,createMemo} from "solid-js"
import { brushRange } from "./brushRange"
false&&brushRange

export const BrushBar:Component<{
    selectedAreaVisible:Accessor<boolean>,
    setSelectedAreaVisible:Setter<boolean>,
    setMinSelectedLineCount:Setter<number>,
    setMaxSelectedLineCount:Setter<number>,
    weightBarWidth:number,
    weightBarSpacing:number,
    maxLineCount:Accessor<number>,
    index:number

}> = (props) => {
    const startX = -3 * props.weightBarSpacing
    const endX = 4 * props.weightBarWidth + 8 * props.weightBarSpacing

    const [brushX,setBrushX] = createSignal<number>(0)
    const [brushWidth,setBrushWidth] = createSignal<number>(0)



    

   
    const [selectedAreaX,setSelectedAreaX] = createSignal<number>(0)
    const [selectedAreaWidth,setSelectedAreaWidth] = createSignal<number>(0)

    createMemo(()=>{
        if(props.selectedAreaVisible() == false) setSelectedAreaWidth(0)
    })

    return (
        <>
            {/* static part */}
            <rect
            width= { 4 * props.weightBarWidth + 11 * props.weightBarSpacing }
            height = "4"
            x = {-3 * props.weightBarSpacing}
            y = {190}
            style = {{fill:"#d4d4d4",opacity:"60%"}}
            id={"referenceRect-" + props.index.toString()}>
            </rect>
            <text
            x = {-3 * props.weightBarSpacing}
            y = {205}
            style={{"text-anchor":"start","font-size":"8px","font-weight":"bold"}}
            >0
            </text>
            <text
            x = {4 * props.weightBarWidth + 8 * props.weightBarSpacing}
            y = {205}
            style={{"text-anchor":"end","font-size":"8px","font-weight":"bold"}}
            >
            {props.maxLineCount()}   
            </text>
            {/* brush part */}
            <rect
            use:brushRange= {{
                setBrushX:setBrushX,
                setBrushWidth:setBrushWidth,
                setSelectedAreaVisible:props.setSelectedAreaVisible,
                setSelectedAreaX:setSelectedAreaX,
                setSelectedAreaWidth:setSelectedAreaWidth,
                maxLineCount:props.maxLineCount,
                setMaxSelectedLineCount:props.setMaxSelectedLineCount,
                setMinSelectedLineCount:props.setMinSelectedLineCount,
                index:props.index
            }}
            x={-3 * props.weightBarSpacing - 30}
            y={160}
            width={4 * props.weightBarWidth + 11 * props.weightBarSpacing + 60}
            height={64}
            style={{opacity:"0%"}}
            
            ></rect>
            <rect
            x={brushX()}
            y={185}
            width={brushWidth()}
            height={14}
            style = {{fill:"#bae6fd",opacity:"50%"}}>
            </rect>
            <Show when={props.selectedAreaVisible()}>
                <rect
                x={selectedAreaX()}
                y={187}
                height={10}
                width={selectedAreaWidth()}
                style = {{fill:"#EDC948"}}>
                </rect>
            </Show>
        </>
        
    )
}