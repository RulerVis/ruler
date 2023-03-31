export const calculateMinCount = (data:any) => {
    let minValue = 0
    for(let i=0;i<data?.length??0;i++){
        if(data[i].count < minValue){
            minValue = data[i].count
        }
    }
    return minValue
}

export const calculateMaxCount = (data:any) => {
    let maxValue = 0
    for(let i=0;i<data.length??0;i++){
        if(data[i].count > maxValue){
            maxValue = data[i].count
        }
    }
    let flag = 1
    for(let i=0;i<data.length??0;i++){
        if(data[i].count != maxValue){
            flag = 0
            break
        }
    }
    if(flag == 0) return maxValue
    else return 2 * maxValue

}