export const BarToColumn = (barFilter:any[]) => {
    let set = []
    for(let i=0;i<barFilter.length;i++){
        if(barFilter[i].values.length > 0){
            let item:any = {}
            item.fieldName = barFilter[i].fieldName
            item.values = []
            if(barFilter[i].type == "nominal"){
                let range:any = {}
                let string = "{"
                for(let j=0;j<barFilter[i].values.length;j++){
                    string = string + barFilter[i].values[j].toString()
                    if(j!=barFilter[i].values.length -1) string = string + ","
                }
                string = string + "}"
                range.value = string
                range.operator = "in"
                item.values.push(range)
            }
            else if(barFilter[i].type == "quantitative"){
                for(let j=0;j<barFilter[i].values.length;j++){
                    let range:any = {}
                    let string = "["
                    string = string + barFilter[i].values[j].min.toFixed(1).toString()
                    string = string + ","
                    string = string + barFilter[i].values[j].max.toFixed(1).toString()
                    if(barFilter[i].values[j].maxInBin == false) string = string + ")"
                    else string = string + "]"
                    range.value = string
                    range.operator = "in"
                    item.values.push(range)
                }
            }
            set.push(item)
        }
    }
    if(set.length == 1) set.push({"values":[]})
    return set
}

export const LineToColumn = (lineFilter:any[]) => {
    let set:any[] = []
    for(let i=0;i<lineFilter.length;i++){
        if(lineFilter[i].values.length > 0){
            let item1:any = {}
            let item2:any = {}
            item1.values= [{}]
            item2.values= [{}]
            item1.fieldName = lineFilter[i].fieldName
            item2.fieldName = lineFilter[i].nextFieldName
            item1.values[0].operator = valueToOperator(lineFilter[i].values[0][0].type)
            item2.values[0].operator = valueToOperator(lineFilter[i].values[0][1].type)
            item1.values[0].value = valueToString(lineFilter[i].values[0][0])
            item2.values[0].value = valueToString(lineFilter[i].values[0][1])
            set.push(item1)
            set.push(item2)
            return set
        }
    }
    return []
    
}

export const valueToOperator = (type:string) => {
    if(type == "nominal") return "equal to"
    else if(type == "quantitative") return "in"
}

export const valueToString = (obj:any) => {
    let result = ""
    if(obj.type == "nominal") return obj.value.toString()
    else if(obj.type == "quantitative"){
        result = result + "[" + obj.min.toFixed(1).toString() + ","
        result = result + obj.max.toFixed(1).toString() 
        if(obj.maxInBin == true) result = result + "]"
        else result = result + ")"

    }
    return result
}

