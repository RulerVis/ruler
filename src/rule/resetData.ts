import { Accessor, Setter } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { generateSample } from "../data/generateSample"
import { initBarFilter } from "../filter/initFilter"
import { initLineFilter } from "../filter/initFilter"
import { initMatrixFilter } from "../filter/initFilter"
import { initFlag } from "../init/initFlag"


export const resetData = (setZeroVisible:Setter<boolean>,setHeight:Setter<number>,setOriginalData:Setter<any>,setReactiveDataVisible:Setter<boolean>,setSelectedAreaVisible:Setter<boolean>,setFields:Setter<string[]>,setUnusedFields:Setter<string[]>,setBarFilter:SetStoreFunction<any>,setLineFilter:SetStoreFunction<any>,setMatrixFilter:SetStoreFunction<any>,setFlagCollection:Setter<any>,fields:Accessor<any>,setScaleMode:Setter<string>) => {
    setOriginalData(generateSample())
    setReactiveDataVisible(false)
    setSelectedAreaVisible(false)
    if(fields().length != Object.keys(generateSample()[0]).length) setFields(Object.keys(generateSample()[0]))
    setUnusedFields([])
    setBarFilter(initBarFilter(fields()))
    setLineFilter(initLineFilter(fields()))
    setMatrixFilter(initMatrixFilter(fields()))
    setFlagCollection(initFlag(generateSample().length))
    setScaleMode("mode1")
    setHeight(400)
    setZeroVisible(false)

    //reset matrix appearance
    let elements = document.getElementsByClassName("matrix-cell")
    for(let i=0;i<elements.length;i++)
    {
        elements[i].setAttribute("stroke","gray")
        elements[i].setAttribute("stroke-width","0.1")
    }

    let inputs = document.getElementsByClassName("input") 
    for(let i=0;i<inputs.length;i++){
        let input = inputs[i] as HTMLInputElement
        input.value = ""
    }

}
