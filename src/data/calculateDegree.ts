import _ from "lodash"
export const calculateDegree = (linesByCol:any,colNum:number) => {

    let leftDegree:any = []
    let rightDegree:any = []
    const left = _.groupBy(linesByCol,"leftBinIndex")
    const right = _.groupBy(linesByCol,"rightBinIndex")
    for(const key in left){
        let item:any ={}
        item["index"] = key
        item["degree"] = left[key].filter((d:any)=>(d.count>0)).length
        leftDegree.push(item)
    }
    for(const key in right){
        let item:any ={}
        item["index"] = key
        item["degree"] = right[key].filter((d:any)=>(d.count>0)).length
        rightDegree.push(item)
    }
    
    // console.log("linesByCol")
    // console.log(linesByCol)
    // console.log("index")
    // console.log(colNum)
    // console.log("leftDegree")
    // console.log(leftDegree)
    // console.log("rightDegree")
    // console.log(rightDegree)
    return {leftDegree:leftDegree,rightDegree:rightDegree}
}

export const calculateMaxDegree = (binsGroupsByCol:any) => {
    // console.log("binsGroupsByCol")
    // console.log(binsGroupsByCol)
    let maxDegree = 0
    const degrees:any = Object.values(binsGroupsByCol)
    for(let i=0;i<degrees.length;i++){
        if(degrees[i].length > maxDegree){
            maxDegree = degrees[i].length
        }
    }
    console.log("maxDegree")
    console.log(maxDegree)
    return maxDegree
}