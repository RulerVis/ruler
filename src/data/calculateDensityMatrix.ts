import { reverse } from "lodash"
import { isValueInBin } from "./aggregation"

const findIndex = (binsByCol:any,value:any) => {
    for(let i=0;i<binsByCol.length;i++){
        if(isValueInBin(binsByCol[i],value)){
            return i
        }
    }
}

export const calculateDensityMatrix = (data:any,binsByCol:any,Selection:any) => {
    let preSelection = reverse(Selection.slice())
    // console.log("reverse here")
    // console.log(Selection)
    // console.log("preSelection")
    // console.log(preSelection.length)
    // console.log("binsByCol")
    // console.log(binsByCol)
    const field = binsByCol.map((d:any)=>d["key"].toString())
    const type = binsByCol[0]["type"]
    // console.log("data")
    // console.log(data)

    // console.log("field")
    // console.log(field)
    let matrix = []
    for(let i=0;i<field.length;i++){
        let row = []
        for(let j=0;j<field.length;j++){
            row.push(0)
        }
        matrix.push(row)
    }
    let rowIndex:any = 0
    let colIndex:any = 0
    for(let i=0;i<data.length- 1 - preSelection.length;i++){
        let flag = 1
        for(let j=0;j<preSelection.length;j++){
            if(type == "nominal"){
                if(data[i+j]!=binsByCol[preSelection[j]].key){
                    flag = 0
                    break
                }
            }
            else if(type == "quantitative"){
                let value = Number(data[i+j])
                let max = binsByCol[preSelection[j]].max
                let min = binsByCol[preSelection[j]].min
                let maxInBin = binsByCol[preSelection[j]].maxInBin

                if(!((value>=min && value<max)||(value==max && maxInBin))){
                    flag = 0
                    break
                }
            }
        }
        if(flag == 1){
            if(type == "nominal"){
                colIndex = field.indexOf(data[i + preSelection.length].toString())
                rowIndex = field.indexOf(data[i + preSelection.length + 1].toString())
                matrix[rowIndex][colIndex] = matrix[rowIndex][colIndex] + 1
            }
            else if(type == "quantitative"){
                colIndex = findIndex(binsByCol,data[i + preSelection.length])
                rowIndex = findIndex(binsByCol,data[i + preSelection.length + 1])
                if(colIndex>=0 && rowIndex>=0 ) matrix[rowIndex][colIndex] = matrix[rowIndex][colIndex] + 1
                
            }   
        }

    }
    // console.log("DensityMatrix")
    // console.log(matrix)
    return matrix
}

