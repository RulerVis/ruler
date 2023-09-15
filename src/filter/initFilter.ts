import {Accessor} from "solid-js"
export const initBarFilter = (fields:any) => {
    let filters:any = []
    for(let i=0;i<fields.length;i++){
        let item:any = {}
        item["fieldName"] = fields[i]
        item["values"] = []
        filters.push(item)
    }
    return filters
}

export const initLineFilter = (fields:any) => {
    let filters:any = []
    for(let i=0;i<fields.length-1;i++){
        let item:any = {}
        item["fieldName"] = fields[i]
        item["nextFieldName"] = fields[i+1]
        item["values"] = [] //it's a double-layer-list the inner side contain two objects for each line
        filters.push(item)
    }
    return filters
}

export const initMatrixFilter = (fields:any) => {
    let filters:any = []
    for(let i=0;i<fields.length;i++){
        let item:any = {}
        item["fieldName"] = fields[i]
        item["values"] = [] //it's a double-layer-list the inner side contain two objects for current row and next row
        filters.push(item)
    }
    return filters
}

