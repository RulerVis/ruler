import { Accessor,Setter} from "solid-js"
export const addRule = (ruleIndex:Accessor<number>,setRuleCollection:Setter<any[]>,originalData:Accessor<any>,columnSet:any,link:any,rowSet:any,variance:any,oneMode:Accessor<boolean>,manyMode:Accessor<boolean>,rowMode:Accessor<boolean>) => {
    if(ruleIndex() < 0 ){
        setRuleCollection((collection:any[])=>{
            let newCollection = collection.slice()
            if(oneMode() == true){
                newCollection.push({"columnSet":JSON.parse(JSON.stringify(columnSet)),"link":JSON.parse(JSON.stringify(link)),"len":originalData().length,data:originalData(),"type":"one-to-one"})
            }
            else if(manyMode() == true){
                newCollection.push({"columnSet":JSON.parse(JSON.stringify(columnSet)),"link":JSON.parse(JSON.stringify(link)),"len":originalData().length,data:originalData(),"type":"one-to-many"})
            }
            else if(rowMode() == true){
                newCollection.push({"rowSet":JSON.parse(JSON.stringify(rowSet)),"variance":JSON.parse(JSON.stringify(variance)),"len":originalData().length,data:originalData(),"type":"sequence"})
            }
            console.log("newCollection")
            console.log(newCollection)
            return newCollection
        })
    }
    else if(ruleIndex() >= 0){
        setRuleCollection((collection:any[])=>{
            let newCollection = collection.slice()
            if(oneMode() == true){
                newCollection[ruleIndex()]  = {"columnSet":JSON.parse(JSON.stringify(columnSet)),"link":JSON.parse(JSON.stringify(link)),"len":originalData().length,data:originalData(),"type":"one-to-one"}
            }
            if(rowMode() == true){
                newCollection[ruleIndex()] = {"rowSet":JSON.parse(JSON.stringify(rowSet)),"variance":JSON.parse(JSON.stringify(variance)),"len":originalData().length,data:originalData(),"type":"sequence"}
            }
            console.log("newCollection")
            console.log(newCollection)
            return newCollection
        })
    }
    
    return true

}