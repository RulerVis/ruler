import _ from "lodash"
import { sortBins } from "../rank/rankBins"
import { generateKey } from "./generateKey"

export const computeBins = (data:any,fieldsSelection:any[],rankMode:any[]) => {
    let bins:any = []
    for (let i = 0; i < fieldsSelection.length; i++) {    
        const dValues = data.map((d: any[]) => d[i])
        // determine attribute type
        if(rankMode[i].mode == "default")
        {
            if (fieldsSelection[i].type == "nominal") {
                let counts = _.countBy(dValues)

                // -- check
                console.log("check")
                console.log(counts)

                //-- change 
                const dataArray:any = Object.entries(counts)
                console.log(dataArray)
                dataArray.sort((a:any, b:any) => Math.ceil(Number(a[0]) - Number(b[0])))
                counts = Object.fromEntries(dataArray)

                // -- check again
                console.log("check again")
                console.log(counts)



                let binIndex = 0;
                for (let key in counts) {
                    bins.push({ key: key, count: counts[key], type: "nominal", colIndex: i, binIndex })
                    binIndex++
                }

            } 
            else {
                const binNum = fieldsSelection[i].binNum
                const minDValue = Math.min(...dValues)
                const maxDValue = Math.max(...dValues)
                const interval = (maxDValue - minDValue) / binNum
                for (let j = 0; j < binNum; j++) {
                    const min = minDValue + j * interval
                    const max = minDValue + (j + 1) * interval
                    const maxInBin = (j == binNum - 1)
                    const dValuesInBin = !maxInBin ? dValues.filter((d: number) => d >= min && d < max) : dValues.filter((d: number) => d >= min && d <= max)
                    bins.push({ 
                    key: generateKey(min,max,interval), 
                    count: dValuesInBin.length, 
                    min, max, maxInBin, 
                    type: "quantitative",
                    colIndex: i,
                    binIndex: j
                    })
                }
            }
        }
        else if(rankMode[i].mode == "up" || rankMode[i].mode == "down")
        {
            let rankBins:any[] = []
            if (fieldsSelection[i].type == "nominal") {
                const counts = _.countBy(dValues)
                let binIndex = 0;
                for (let key in counts) {
                    rankBins.push({ key: key, count: counts[key], type: "nominal", colIndex: i, binIndex })
                    binIndex++
                }
            } 
            else {
                const binNum = fieldsSelection[i].binNum
                const minDValue = Math.min(...dValues)
                const maxDValue = Math.max(...dValues)
                const interval = (maxDValue - minDValue) / binNum
                for (let j = 0; j < binNum; j++) {
                    const min = minDValue + j * interval
                    const max = minDValue + (j + 1) * interval
                    const maxInBin = (j == binNum - 1)
                    const dValuesInBin = !maxInBin ? dValues.filter((d: number) => d >= min && d < max) : dValues.filter((d: number) => d >= min && d <= max)
                    rankBins.push({ 
                    key: generateKey(min,max,interval) ,
                    count: dValuesInBin.length, 
                    min, max, maxInBin, 
                    type: "quantitative",
                    colIndex: i,
                    binIndex: j
                    })
                }
            }
            rankBins = sortBins(rankBins,rankMode[i].mode)
            for(let i=0;i<rankBins.length;i++){
                bins.push(rankBins[i])
            }
        }   
     }
    // console.log("bins")
    // console.log(bins)
    return bins
}



export const computeReactiveBins = (data:any,fieldsSelection:any[]) => {
    let bins:any = []
    for (let i = 0; i < fieldsSelection.length; i++) {    
        const dValues = data.map((d: any[]) => d[i])
        // determine attribute type
        if (fieldsSelection[i].type == "nominal") {
            const counts = _.countBy(dValues)
            let binIndex = 0;
            for (let key in counts) {
                bins.push({ key: key, count: counts[key], type: "nominal", colIndex: i, binIndex })
                binIndex++
            }
        } 
        else {
            const counts = _.countBy(dValues)

            for (let key in counts) {
                bins.push({ key: key, count: counts[key], type: "quantitative", colIndex: i})   
            }
        }            
    }
    // console.log("reactiveBins")
    // console.log(bins)
    return bins
}
     



export const computeWeightDistribution = (linesByCol:any) => {
    const distribution:any = []
    const dValues = linesByCol.filter((d:any)=>(d.count>0)).map((d: any) => d["count"])
    const binNum = 4
    const minDValue = Math.min(...dValues)
    const maxDValue = Math.max(...dValues)
    const interval = (maxDValue - minDValue) / binNum
    for (let j = 0; j < binNum; j++) {
        const min = minDValue + j * interval
        const max = minDValue + (j + 1) * interval
        const maxInBin = (j == binNum - 1)
        const dValuesInBin = !maxInBin ? dValues.filter((d: number) => d >= min && d < max) : dValues.filter((d: number) => d >= min && d <= max)
        distribution.push({ 
        key: `${Math.round(min)} - ${Math.round(max)}`, 
        count: dValuesInBin.length, 
        min, max, maxInBin, 
        binIndex: j
        })
    }
    // console.log("distribution")
    // console.log(distribution)

    return distribution
}

export const computeSelectedWeightDistribution = (linesByCol:any,min:number,max:number,weightDistribution:any) => {
    if(max!=0){
        // console.log("linesByCol")
        // console.log(linesByCol)
        let newData:any = linesByCol.filter((d:any)=>(d.count>0)).filter((d:any) => (d.count >= min && d.count <= max))
        console.log("newLines")
        console.log(newData)
        //calculate overlay distribution
        let distribution:any =[]
        for(let i=0;i<weightDistribution.length;i++){
            let item:any = {}
            item.min = weightDistribution[i].min
            item.max = weightDistribution[i].max
            item.maxInBin = weightDistribution[i].maxInBin
            item.count = 0
            distribution.push(item)
        }
        for(let i=0;i<distribution.length;i++){
            distribution[i].count = newData.filter((d:any) => ((d.count >= distribution[i].min && d.count < distribution[i].max) || (d.count == distribution[i].max && distribution[i].maxInBin))).length
        }
        // console.log("new distribution")
        // console.log(distribution)
        //filter line
        return distribution
    }
    return []
}




export const isValueInBin = (bin:any, value:any) => {
    if (bin.type == "nominal") {
      if (bin.key == value) return true
    }
    if (bin.type == "quantitative") {
      if (value >= bin.min && value < bin.max) return true
      if (value == bin.max && bin.maxInBin) return true
    }
    return false
}

export const computeLines = (data:any,binGroupsByCol:any,colNum:number) => {
    const lines:any = []
    data.forEach((d: any[]) => {
        for (let i = 0; i < colNum - 1; i++) {
            const value1 = d[i]
            const value2 = d[i + 1]
            const bins1 = binGroupsByCol[i]
            const bins2 = binGroupsByCol[i + 1]

            const line = { leftColIndex: i, rightColIndex: i + 1, leftBinIndex: 0, rightBinIndex: 0 }
            for (let j = 0; j < bins1.length; j++) {
                const bin = bins1[j]
                if (isValueInBin(bin, value1)) line.leftBinIndex = j
            }
            for (let j = 0; j < bins2.length; j++) {
                const bin = bins2[j]
                if (isValueInBin(bin, value2)) line.rightBinIndex = j
            }
            lines.push(line)
        }
    })
    // console.log("lines")
    // console.log(lines)
    return lines
}

function findAggregatedLineByIndexes(lines:any, leftCol:number, rightCol:number, leftBin:any, rightBin:any) {
    for (const l of lines) {
      if (l.leftColIndex == leftCol && l.rightColIndex == rightCol && l.leftBinIndex == leftBin && l.rightBinIndex == rightBin)
        return l
    }
  }

export const computeAggregatedLines = (data:any,binGroupsByCol:any,colNum:number) => {
    const lines = computeLines(data,binGroupsByCol,colNum)
    // aggregate lines between bars
    let aggregatedLines:any = []
    for (let i = 0; i < colNum - 1; i++) {
        const bins1 = binGroupsByCol[i]
        const bins2 = binGroupsByCol[i + 1]
        for (let j = 0; j < bins1.length; j++) {
            for (let k = 0; k < bins2.length; k++) {
                aggregatedLines.push({ leftColIndex: i, rightColIndex: i + 1, leftBinIndex: j, rightBinIndex: k, count: 0 })
            }
        }
    }
    lines.forEach((l:any) => {
        const aggregatedLine = findAggregatedLineByIndexes(aggregatedLines, l.leftColIndex, l.rightColIndex, l.leftBinIndex, l.rightBinIndex)
        aggregatedLine.count++
    })
  
    
    console.log("aggregateLines")
    console.log(aggregatedLines)
    return aggregatedLines
}

