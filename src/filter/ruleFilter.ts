import { Setter } from "solid-js"
import { SetStoreFunction,produce } from "solid-js/store"
import { generateSample } from "../data/generateSample"
import { basicFilter, columnFilter, varianceFilter,compareFilter,calculateVariance } from "./basicFilter"
import { constructStatistics,constructNumberArray } from "./OneToMany"

export const filterOneToOne = (setOriginalData:Setter<any>,columnSet:any[],link:any) => {
    console.log("columnSet")
    console.log(columnSet)
    let sample = generateSample()
    if(link.operator == "equal to"){
        sample = sample.filter((item:any)=>(item[link.leftColumns[0]] == item[link.rightColumn]))
    }
    if(link.operator == "not equal to"){
        sample = sample.filter((item:any)=>(item[link.leftColumns[0]] != item[link.rightColumn]))
    }
    if(link.operator == "larger than"){
        sample = sample.filter((item:any)=>(Number(item[link.leftColumns[0]]) > Number(item[link.rightColumn])))
    }
    if(link.operator == "smaller than"){
        sample = sample.filter((item:any)=>(Number(item[link.leftColumns[0]]) < Number(item[link.rightColumn])))
    }
    if(link.operator == "and"){
        sample = sample.filter((item:any)=>(columnFilter(item,columnSet[0]) && columnFilter(item,columnSet[1])))
    }
    for(let i=0;i<columnSet.length;i++){
        if(columnSet[i].values.length > 0){
            console.log(i)
            sample = sample.filter((item:any)=>{return columnFilter(item,columnSet[i])})
        }
    }
    console.log("filter data length")
    console.log(sample.length)
    setOriginalData(sample)
}

export const filterOneToMany = (setOriginalData:Setter<any>,columnSet:any[],link:any,setLink:SetStoreFunction<any>) => {
    let sample = generateSample()
    for(let i=2;i<columnSet.length;i++){
        if(columnSet[i].values.length == 0){
            setLink(
                produce((link:any)=>{
                    link.leftColumns.push(columnSet[i].fieldName)
                })
            )
        }
        else{
            sample = sample.filter((item:any)=>{return columnFilter(item,columnSet[i])})
        }
    }

    console.log("link")
    console.log(JSON.parse(JSON.stringify(link)))

    console.log(sample)
    
    //console.log(constructStatistics(sample,["area","date"],"AQI"))
    let stats = constructStatistics(sample,JSON.parse(JSON.stringify(link)).leftColumns,JSON.parse(JSON.stringify(link)).rightColumn)
    console.log("stats")
    console.log(stats)

    if(link.type == "cardinality"){
        stats = stats.filter((item:any)=>(compareFilter(Object.keys(item.right).length,Number(link.value),link.operator)))
    }
    else if(link.type == "quantity"){
        for(let i=0;i<stats.length;i++){
            stats[i].right =  Object.entries(stats[i].right).reduce((acc:any, [key, value]) => {
                if (compareFilter(value as number,Number(link.value),link.operator)) {
                  acc[key] = value;
                }
                return acc;
              }, {});
        }
        stats = stats.filter((item:any)=>(Object.keys(item.right).length!=0))
        console.log("quantity check")
        console.log(stats)
    }
    else if(link.type == "variance"){
        stats = stats.filter((item:any)=>compareFilter(calculateVariance(constructNumberArray(item.right)),Number(link.value),link.operator))
    }

    if(link.type == "cardinality" || link.type == "variance"){
        sample = sample.filter((item:any)=>{
            for(let i=0;i<stats.length;i++){
                let subFlag = 1
                for(let j=0;j<stats[i].left.length;j++){
                    if(item[link.leftColumns[j]] != stats[i].left[j]){
                        subFlag = 0
                        break
                    }
                }
                if(subFlag == 1){
                    return true
                }
            }
            return false
        })
    }

    else if(link.type == "quantity"){
        sample = sample.filter((item:any)=>{
            for(let i=0;i<stats.length;i++){
                let subFlag1 = true
                let subFlag2 = false
                for(let j=0;j<stats[i].left.length;j++){
                    if(item[link.leftColumns[j]] != stats[i].left[j]){
                        subFlag1 = false
                        break
                    }
                }
                if(Object.keys(stats[i].right).includes(item[link.rightColumn])) subFlag2 = true
                console.log("subFlag1")
                console.log(subFlag1)
                console.log("subFlag2")
                console.log(subFlag2)
                
                if(subFlag1 == true && subFlag2 == true){
                    return true
                }
            }   
            return false 
        })
    }

    setOriginalData(sample)

}

export const filterSequence = (setOriginalData:Setter<any>,setFlagCollection:Setter<any>,originalRowSet:any[],variance:any) => {
    let rowSet = JSON.parse(JSON.stringify(originalRowSet)) // every node has a setting
    let sample = generateSample()
    if(variance.operator != undefined && variance.operator !=""){
        console.log("Welcome to the territory of variance")
        const length = rowSet[0].values[0].length
        const fieldName = rowSet[0].fieldName
        for(let i=0;i<sample.length;i++){
            sample[i].flag = 0
        }
  
        for(let i=0;i<=sample.length - length;i++){
            let items:any = []
            for(let j=0;j<length;j++){
                items.push(sample[i+j])
            }
            let flag = varianceFilter(items,fieldName,variance.value,variance.operator)
            if(flag == true){
                for(let j=0;j<length;j++){
                    sample[i+j].flag = 1  
                }    
            }
        }
        setFlagCollection(sample.map((d:any)=>d.flag))
        sample = sample.filter((d:any) => (d.flag == 1))
        setOriginalData(sample)  
    }
    else{
        for(let i=0;i<sample.length;i++){
            sample[i].flag = 0
        }
        let maxLength = 0
        for(let i=0;i<rowSet.length;i++){
            if(rowSet[i].values.length!=0){
                if(rowSet[i].values[0].length > maxLength) maxLength = rowSet[i].values[0].length
            }
        }
        console.log("maxLength")
        console.log(maxLength)
    
        for(let i=0;i<=sample.length - maxLength;i++){
            let items:any = []
            for(let j=0;j<maxLength;j++){
                items.push(sample[i+j])
            }
            let flag = 1
            for(let j=0;j<rowSet.length;j++){
                if(rowSet[j].values.length!=0){
                    const fieldName = rowSet[j].fieldName
                    let subFlag = 0 
                    for(let k=0;k<rowSet[j].values.length;k++){
                        let sign = 1
                        for(let u=0;u<rowSet[j].values[k].length;u++){
                            if(basicFilter(items[u],fieldName,rowSet[j].values[k][u].value,rowSet[j].values[k][u].operator)){
                                sign = 1
                            }
                            else{
                                sign = 0
                                break
                            }
                        }
                        if(sign == 1) {
                            subFlag = 1
                            break
                        }
                    }
                    if(subFlag == 0){
                        flag = 0
                        break
                    }
                }
            }
            if(flag == 1){
                for(let j=0;j<maxLength;j++){
                    sample[i+j].flag = 1  
                }    
            }
        }
        setFlagCollection(sample.map((d:any)=>d.flag))
        sample = sample.filter((d:any) => (d.flag == 1))
        setOriginalData(sample)  
    }

}

