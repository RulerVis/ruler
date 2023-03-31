import * as d3 from "d3"

export interface widthScaleType  {
   index:number
   scale:d3.ScaleLinear<number,number> | d3.ScaleLogarithmic<number,number>
}

export const initScale = (colNum:number) => {
    let scales:widthScaleType[] = []
    for(let i=0;i<colNum;i++){
        let item:widthScaleType = {
            index: i,
            scale: d3.scaleLinear().range([0,0]).domain([0,0])
        }
        scales.push(item)
        
    }
    // console.log("scales")
    // console.log(scales)
    return scales
}