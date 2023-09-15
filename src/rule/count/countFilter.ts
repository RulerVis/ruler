export const countFilter = (filter:any[]) => {
    let count = 0 
    for(let i=0; i<filter.length;i++){
        if(filter[i].values.length > 0) count = count + 1
    }
    return count
}

export const countValues = (filter:any[]) => {
    let maxCount = 0
    for(let i=0;i<filter.length;i++){
        if(filter[i].values.length > maxCount) maxCount = filter[i].values.length
    }
    return maxCount
}

