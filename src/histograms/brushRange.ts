import { Accessor,Setter,onCleanup } from "solid-js" 




export interface BrushOptions {
    setBrushX:Setter<number>,
    setBrushWidth:Setter<number>,
    setSelectedAreaVisible:Setter<boolean>,
    setSelectedAreaX:Setter<number>,
    setSelectedAreaWidth:Setter<number>,
    maxLineCount:Accessor<number>,
    setMaxSelectedLineCount:Setter<number>,
    setMinSelectedLineCount:Setter<number>,
    index:number
  }

declare module 'solid-js' {
    namespace JSX {
      interface Directives {
        brushRange: BrushOptions
      }
    }
}


export const brushRange = (el:SVGElement,value: Accessor<BrushOptions>) => {
    
    const {setBrushX,setBrushWidth,setSelectedAreaVisible,setSelectedAreaX,setSelectedAreaWidth,maxLineCount,setMaxSelectedLineCount,setMinSelectedLineCount,index} = value()

    let referenceX:number = 0
    let startX:number = 0
    let currentX:number = 0
    let brushX:number = 0
    let referenceRect:any

  const handleMouseDown = (e:MouseEvent) => {

    setSelectedAreaWidth(0)
    e.preventDefault()
    startX = e.clientX
    referenceRect = document.querySelector("#referenceRect-"+index.toString()) as SVGElement
    referenceX = Number(referenceRect.getAttribute("x"))
    setBrushX(referenceX + startX - referenceRect?.getBoundingClientRect().left)
    // console.log("x")
    // console.log(referenceX + startX - referenceRect?.getBoundingClientRect().left)
    // console.log("y")
    // console.log(referenceY + startY -referenceRect?.getBoundingClientRect().top)


    el.addEventListener('mousemove',handleMouseMove)
    el.addEventListener('mouseup',handleMouseUp)
  }

  const handleMouseMove = (e:MouseEvent) => {
    currentX = e.clientX
    setBrushWidth(Math.abs(currentX - startX))
  }

  const handleMouseUp = (e:MouseEvent) => {
    setBrushX(0)
    setBrushWidth(0)
    currentX = e.clientX
    if(startX <= referenceRect?.getBoundingClientRect().left){
        //effective one
        brushX = referenceRect.getAttribute("x")
        startX = referenceRect?.getBoundingClientRect().left
    }
    else{
        brushX = referenceX + startX - referenceRect?.getBoundingClientRect().left
    }
    if(currentX >= referenceRect?.getBoundingClientRect().right){
        currentX = referenceRect?.getBoundingClientRect().right
    }
    setSelectedAreaX(brushX)
    setSelectedAreaWidth(currentX - startX)
    let min = Math.round(maxLineCount() * (startX - referenceRect?.getBoundingClientRect().left)  / (referenceRect?.getBoundingClientRect().right - referenceRect?.getBoundingClientRect().left))
    let max = Math.round(maxLineCount() * (currentX - referenceRect?.getBoundingClientRect().left) / (referenceRect?.getBoundingClientRect().right - referenceRect?.getBoundingClientRect().left))
    console.log("min")
    console.log(min)
    console.log("max")
    console.log(max)
    setMinSelectedLineCount(min)
    setMaxSelectedLineCount(max)

    
    setSelectedAreaVisible(true)



      
      el.removeEventListener('mousemove',handleMouseMove)
      el.removeEventListener('mouseup',handleMouseUp)
  }

  el.addEventListener('mousedown',handleMouseDown)
  onCleanup(()=>{
      el.removeEventListener('mousedown',handleMouseDown)
  })
}