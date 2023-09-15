
export const matrixToNL = (matrixFilter:any[]) => {
    let result = ""
    let NL = ""
    for(let i=0;i<matrixFilter.length;i++){
        if(matrixFilter[i].values.length > 0){
            NL = NL + "for column " + matrixFilter[i].fieldName + ", "
            NL = NL + "the 2-step sequence satisfies " 
            for(let j=0;j<matrixFilter[i].values.length;j++){
                NL = NL + "[" + ObjToNL(matrixFilter[i].values[j][0]) + ", "
                NL = NL + ObjToNL(matrixFilter[i].values[j][1]) + "]"
                if(j!=matrixFilter[i].values.length-1) NL =NL + " or "

            }
            NL = NL +"; "
            result = result + NL
        }
    }
    result = result.substring(0,result.length-2)
    return result
}

const ObjToNL = (obj:any) => {
    let line = ""
    if(obj.type == "nominal"){
        line = "equal to " + obj.value
    }
    else if(obj.type == "quantitative"){
        let range = "["
        range = range + obj.min.toFixed(1).toString()
        range = range + ","
        range = range + obj.max.toFixed(1).toString()
        if(obj.maxInBin == true) range = range + "]"
        else range = range + ")"
        line = "in " + range
    }
    return line
}

