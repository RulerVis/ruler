export const linkToNL = (lineFilter:any[]) => {
    let result = ""
    let NL = ""
    for(let i=0;i<lineFilter.length;i++){
        if(lineFilter[i].values.length>0){
            NL = "for links between "
            NL = NL + "column " + lineFilter[i].fieldName + " and column " + lineFilter[i].nextFieldName + "," 
            for(let j=0;j<lineFilter[i].values.length;j++){
                NL = NL + ObjToNL(lineFilter[i].values[j][0],lineFilter[i].fieldName) + " and " + ObjToNL(lineFilter[i].values[j][1],lineFilter[i].nextFieldName)
                if(j!=lineFilter[i].values.length-1) NL = NL + " or "                
            }
            NL = NL + "; "
            result = result + NL
        }   
    }
    result = result.substring(0,result.length-2)
    return result
}

export const ObjToNL = (obj:any,fieldName:any) => {
    let line = ""
    if(obj.type == "nominal"){
        line = line + fieldName + " is equal to " + obj.value
    }
    else if(obj.type == "quantitative"){
        let range = "["
        range = range + obj.min.toFixed(1).toString()
        range = range + ","
        range = range + obj.max.toFixed(1).toString()
        if(obj.maxInBin == true) range = range + "]"
        else range = range + ")"
        line = line + fieldName + " is in " + range
    }
    return line
}