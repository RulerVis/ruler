export const mergeBins = (bins1:any,bins2:any) => {
    let bins:any = []
    for(let i=0;i<bins1.length;i++){
        let item:any = {}
        if(bins1[i]["type"] == "nominal"){
            item.key =bins1[i].key
            item.count = 0
            item.type = "nominal"
            item.colIndex = bins1[i].colIndex
            item.binIndex = bins1[i].binIndex
            bins.push(item)
        }
        else if(bins1[i]["type"] = "quantitative"){
            item.key =bins1[i].key
            item.count = 0
            item.type = "quantitative"
            item.colIndex = bins1[i].colIndex
            item.binIndex = bins1[i].binIndex
            item.min = bins1[i].min
            item.max = bins1[i].max
            item.maxInBin = bins1[i].maxInBin
            bins.push(item)
        }  
    }
    // console.log(bins)
    const keys = bins1.map((d:any) => (d["key"]))

    for(let i=0;i<bins2.length;i++){
        if(bins2[i].type == "nominal"){
            if(keys.includes(bins2[i].key)){
                let item = bins.find((t:any) => (t.key == bins2[i].key && t.colIndex == bins2[i].colIndex))
                item.count = bins2[i].count    
            }
        }
        else if(bins2[i].type == "quantitative"){
            let num = Number(bins2[i].key) 
            let items = bins.filter((d:any) => (Number(d.colIndex) == Number(bins2[i].colIndex)))

            for(let j=0;j<items.length;j++){
                if((num >= items[j].min && num < items[j].max) || (items[j].maxInBin && num == items[j].max)){
                    let item = bins.find((d:any) => (d.key == items[j].key && d.colIndex == items[j].colIndex))
                    item.count += bins2[i].count
                    break
                }
            }

        }
    }
    // console.log("originalBins")
    // console.log(bins1)
    // console.log("mergeBins")
    // console.log(bins)
    return bins
}