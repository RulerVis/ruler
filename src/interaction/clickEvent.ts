import { reverse } from "lodash"
import {Setter,createSignal} from "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"
import { generateSample } from "../data/generateSample"



export const clickBar = (event:MouseEvent,barData:any,barFilter:any,setBarFilter:SetStoreFunction<any>,lineFilter:any,fieldName:any,setOriginalData:Setter<any>) => {
    event.preventDefault()
    if(barData.type == "nominal"){
        setBarFilter(
            (filterCol:any) => filterCol.fieldName == fieldName,
            produce((filterCol:any) => {
                filterCol["type"] = "nominal"
                if(!filterCol.values.includes(barData.key)){
                    filterCol.values.push(barData.key)
                }   
            })
            )
    }
    else if(barData.type == "quantitative"){
        setBarFilter(
            (filterCol:any) => filterCol.fieldName == fieldName,
            produce((filterCol:any) => {
                filterCol["type"] = "quantitative"
                if(!filterCol.values.map((d:any)=>(d.min)).includes(barData.min)){
                    filterCol.values.push({"min":barData.min,"max":barData.max,"maxInBin":barData.maxInBin})
                }   
            })
        )
    }
    console.log("barFilter")
    console.log(JSON.parse(JSON.stringify(barFilter)))

    filterDataByCol(barFilter,lineFilter,setOriginalData)
    
}

export const clickLine = (lineData:any,binsByCol:any,nextBinsByCol:any,barFilter:any,lineFilter:any,setLineFilter:SetStoreFunction<any>,setOriginalData:Setter<any>,fieldName:any) => {
    let lineList:any = []
    let item1 = binsByCol[Number(lineData.leftBinIndex)]
    let item2 = nextBinsByCol[Number(lineData.rightBinIndex)]
    let value1 = item1.key
    let value2 = item2.key
    
    if(item1["type"] == "nominal"){
        lineList.push({"value":value1,"type":"nominal"})
    }
    else if(item1["type"] == "quantitative"){
        lineList.push({"min":item1.min,"max":item1.max,"maxInBin":item1.maxInBin,"type":"quantitative"})
    }
    if(item2["type"] == "nominal"){
        lineList.push({"value":value2,"type":"nominal"})
    }
    else if(item2["type"] == "quantitative"){
        lineList.push({"min":item2.min,"max":item2.max,"maxInBin":item2.maxInBin,"type":"quantitative"})
    }

    console.log("insert new one!")
    console.log(lineList)

    setLineFilter(
        (filter:any) => filter.fieldName == fieldName,
        produce((filter:any)=>{
            if(!inValues(filter.values,lineList)){
                filter.values.push(lineList)
            }
        })
    )

    //then it's overall Filter

    console.log("check this out")
    console.log(JSON.parse(JSON.stringify(lineFilter)))

    filterDataByCol(barFilter,lineFilter,setOriginalData)
}

export const clickMatrixCell = (event:MouseEvent,binsByCol:any,matrixFilter:any,setMatrixFilter:any,setFlagCollection:any,fieldName:any,rowIndex:number,colIndex:number,setOriginalData:Setter<any>,Selection:any) => {
    let element = event.target as SVGAElement
    element.setAttribute("stroke","#fbbf24")
    element.setAttribute("stroke-width","3")

    // console.log("binsByCol")
    // console.log(binsByCol)

    const type = binsByCol[0].type

    let matrixList:any = []
    let preSelection = reverse(Selection.slice())
    
    for(let i=0;i<preSelection.length;i++){
        let item = binsByCol[preSelection[i]]
        let value = item.key
        if(type == "nominal"){
            matrixList.push({"value":value,"type":"nominal"})
        }
        else if(type == "quantitative"){
            matrixList.push({"min":item.min,"max":item.max,"maxInBin":item.maxInBin,"type":"quantitative"})
        }
    }
    let item1 = binsByCol[colIndex]
    let item2 = binsByCol[rowIndex]
    let value1 = item1.key
    let value2 = item2.key
    
    if(type == "nominal"){
        matrixList.push({"value":value1,"type":"nominal"})
    }
    else if(type == "quantitative"){
        matrixList.push({"min":item1.min,"max":item1.max,"maxInBin":item1.maxInBin,"type":"quantitative"})
    }
    if(type == "nominal"){
        matrixList.push({"value":value2,"type":"nominal"})
    }
    else if(type == "quantitative"){
        matrixList.push({"min":item2.min,"max":item2.max,"maxInBin":item2.maxInBin,"type":"quantitative"})
    }

    console.log("insert new one about matrix!")
    console.log(matrixList)
   
    setMatrixFilter(
        (filter:any) => filter.fieldName == fieldName,
        produce((filter:any)=>{
            if(true){
                filter.type = type
                filter.values.push(matrixList)
            }
        })   
       
    )

    console.log("matrixFiletr")
    console.log(JSON.parse(JSON.stringify(matrixFilter)))

    filterDataByRow(matrixFilter,setOriginalData,setFlagCollection)
      
}

const inValues = (values:any,lineList:any[]) => {
    for(let i=0;i<values.length;i++){
        let flag1= false
        let flag2 = false
        if(values[i][0].type == lineList[0].type){
            if(values[i][0].type == "nominal"){
                if(values[i][0].value == lineList[0].value) flag1= true
            }
            else if(values[i][0].type == "quantitative"){
                if(values[i][0].min == lineList[0].min) flag1 = true
            }
        }
        if(values[i][1].type == lineList[1].type){
            if(values[i][1].type == "nominal"){
                if(values[i][1].value == lineList[1].value) flag2= true
            }
            else if(values[i][1].type == "quantitative"){
                if(values[i][1].min == lineList[1].min) flag2 = true
            }
        }
        if(flag1 && flag2) return true
    }
    return false
}

const filterDataByCol = (barFilter:any,lineFilter:any,setOriginalData:Setter<any>) => {
    // console.log("barFilter")
    // console.log(JSON.parse(JSON.stringify(barFilter)))
    // console.log("lineFilter")
    // console.log(JSON.parse(JSON.stringify(lineFilter)))
    let sample = generateSample()
    for(let i=0;i<barFilter.length;i++){
        if(barFilter[i].values.lenght!=0){
            if(barFilter[i].type == "nominal"){
                setOriginalData((data:any)=>{
                    sample = sample.filter((d:any)=>{
                        return barFilter[i].values.includes(d[barFilter[i].fieldName].toString())
                    })
                    // console.log("sample")
                    // console.log(sample)
                    return sample
                })
            }
            else if(barFilter[i].type == "quantitative"){
                    setOriginalData((data:any)=>{
                        sample = sample.filter((d:any)=>{
                            let num = Number(d[barFilter[i].fieldName])
                            for(let j=0;j<barFilter[i].values.length;j++){
                                if((num >= barFilter[i].values[j].min && num < barFilter[i].values[j].max) || (num == barFilter[i].values[j].max && barFilter[i].values[j].maxInBin)) return true
                            }
                            return false
                        })
                        return sample
                    })
            }
        }
    }
    
    

    for(let i=0;i<lineFilter.length;i++){
        if(lineFilter[i].values.length !=0 ){
            setOriginalData((data:any)=>{
                sample = sample.filter((d:any)=>{
                    for(let j=0;j<lineFilter[i].values.length;j++){
                        let flag1 = false
                        let flag2 = false
                        let filterRow = lineFilter[i].values[j]
                        if(filterRow[0].type == "nominal"){
                            if(d[lineFilter[i].fieldName] == filterRow[0].value) flag1 = true
                        }
                        else if(filterRow[0].type == "quantitative"){
                            let num = Number(d[lineFilter[i].fieldName])
                            if((num >= filterRow[0].min && num < filterRow[0].max) || (num == filterRow[0].max && filterRow[0].maxInBin)) flag1=true
                        }
                        if(filterRow[1].type == "nominal"){
                            if(d[lineFilter[i].nextFieldName] == filterRow[1].value) flag2 = true
                        }
                        else if(filterRow[1].type == "quantitative"){
                            let num = Number(d[lineFilter[i].nextFieldName])
                            if((num >= filterRow[1].min && num < filterRow[1].max) || (num == filterRow[1].max && filterRow[1].maxInBin)) flag2=true
                        }
                        if(flag1 && flag2) return true
                    }
                    return false
                })
                // console.log("sample")
                // console.log(sample)
                return sample
            })
        }
    }
}

//old function, just keep it here in case ...
const filterDataByRow1 = (matrixFilter:any,setOriginalData:Setter<any>,setFlagCollection:Setter<any>) => {
    console.log("matrixFilter")
    console.log(matrixFilter)
    let sample:any =  generateSample()
    for(let i=0;i<sample.length;i++){
        sample[i].flag = 0
    }
    for(let i=0;i<sample.length-1;i++){
        let item1:any = sample[i]
        let item2:any = sample[i+1]
        let flag = 1
        //gonna pass each of them
        for(let j=0;j<matrixFilter.length;j++){
            if(matrixFilter[j].values.length!=0){
                const fieldName = matrixFilter[j].fieldName
                const type = matrixFilter[j].type
                let value1 = item1[fieldName]
                let value2 = item2[fieldName]
                if(type == "quantitatvie"){
                    value1 = Number(value1)
                    value2 = Number(value2)
                }
                let subFlag = 0
                //gonna pass one of them
                for(let k=0;k<matrixFilter[j].values.length;k++){
                    let subFlag1 = false
                    let subFlag2 = false
                    if(type == "nominal"){
                        if(value1 == matrixFilter[j].values[k][0].value) subFlag1 = true
                        if(value2 == matrixFilter[j].values[k][1].value) subFlag2 = true
                        if(subFlag1 && subFlag2){
                            subFlag = 1
                            break
                        }
                    }
                    else if(type == "quantitative"){
                        let min1 = matrixFilter[j].values[k][0].min
                        let max1 = matrixFilter[j].values[k][0].max
                        let maxInBin1 = matrixFilter[j].values[k][0].maxInBin
                        let min2 = matrixFilter[j].values[k][1].min
                        let max2 = matrixFilter[j].values[k][1].max
                        let maxInBin2 = matrixFilter[j].values[k][1].maxInBin
                        if((value1 >= min1 && value1 < max1) || (value1 == max1 && maxInBin1)) subFlag1=true
                        if((value2 >= min2 && value2 < max2) || (value2 == max2 && maxInBin2)) subFlag2=true
                        if(subFlag1 && subFlag2){
                            subFlag = 1
                            break
                        }
                    }
                    
                }
                if(subFlag == 0){
                    flag = 0
                    break
                }
            }
        }
        if(flag == 1){
            sample[i].flag = 1
            sample[i+1].flag = 1
        }
    }
    setFlagCollection(sample.map((d:any)=>d.flag))
    sample = sample.filter((d:any) => (d.flag == 1))
    console.log("row number")
    console.log(sample.length)
    setOriginalData(sample)
    
}

const filterDataByRow = (matrixFilter:any,setOriginalData:Setter<any>,setFlagCollection:Setter<any>) => {
    console.log("maxtrixFilter")
    console.log(JSON.parse(JSON.stringify(matrixFilter)))
    let sample:any =  generateSample()
    for(let i=0;i<sample.length;i++){
        sample[i].flag = 0
    }
    let maxLength = 0
    for(let i=0;i<matrixFilter.length;i++){
        if(matrixFilter[i].values.length!=0){
            if(matrixFilter[i].values[0].length > maxLength) maxLength = matrixFilter[i].values[0].length
        }
    }
    console.log("maxLength")
    console.log(maxLength)

    for(let i=0;i<=sample.length - maxLength;i++){
        let items:any = []
        for(let j=0;j<maxLength;j++){
            items.push(sample[i+j])
        }
        let flag = 1
        for(let j=0;j<matrixFilter.length;j++){
            if(matrixFilter[j].values.length!=0){
                const fieldName = matrixFilter[j].fieldName
                const type = matrixFilter[j].type
                let values = []
                for(let k=0;k<matrixFilter[j].values[0].length;k++){
                    let value = items[k][fieldName]
                    if(type == "quantitative") value = Number(value)
                    values.push(value)
                }
                let subFlag = 0 
                for(let k=0;k<matrixFilter[j].values.length;k++){
                    if(type == "nominal"){
                        let sign = 1
                        for(let u=0;u<matrixFilter[j].values[k].length;u++){
                            if(values[u] == matrixFilter[j].values[k][u].value){
                                sign = 1
                            }
                            else{
                                sign = 0
                                break
                            }
                        }
                        if(sign == 1) {
                            subFlag = 1
                            break
                        }
                    }
                    if(type == "quantitative"){
                        let sign = 1
                        for(let u=0;u<matrixFilter[j].values[k].length;u++){
                            let max = matrixFilter[j].values[k][u].max
                            let min = matrixFilter[j].values[k][u].min
                            let maxInBin = matrixFilter[j].values[k][u].maxInBin
                            if((values[u]>=min && values[u]<max) || (values[u] == max && maxInBin)){
                                sign = 1
                            }
                            else{
                                sign = 0
                                break
                            }
                        }
                        if(sign == 1) {
                            subFlag = 1
                            break
                        }
                    }

                }
                if(subFlag == 0){
                    flag = 0
                    break
                }
            }
        }
        if(flag == 1){
            for(let j=0;j<maxLength;j++){
                sample[i+j].flag = 1  
            }    
        }
    }
    
    
    setFlagCollection(sample.map((d:any)=>d.flag))
    sample = sample.filter((d:any) => (d.flag == 1))
    // console.log("row number")
    // console.log(sample.length)
    setOriginalData(sample)
    
}





