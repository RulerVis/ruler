import { generateSample } from "../data/generateSample";

export { generateSample} from "../data/generateSample"

export const exportData = (ruleCollection:any[]) => {
    let errorCollection:any[] = []
    for(let i=0;i<ruleCollection.length;i++){
        errorCollection = errorCollection.concat(ruleCollection[i].data)
    }
    const uniqueObjects = new Map();
    const mergedArray = errorCollection.reduce((acc:any, cur:any) => {
    return acc.concat(cur);
    }, []).filter((obj:any) => {
        const uniqueKey = obj.area + obj.date + obj.hour;
        if (!uniqueObjects.has(uniqueKey)) {
            uniqueObjects.set(uniqueKey, true);
            return true;
        }
        return false;
    });
    console.log("check mergedArray")
    console.log(mergedArray)
    
    let  exportedData:any = generateSample()

    exportedData = exportedData.filter((item:any)=>!existsInArray(mergedArray,item))

    const json = JSON.stringify(exportedData);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cleanData.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);



}

const existsInArray = (mergedArray:any[],item:any) => {
    return mergedArray.some((obj:any)=>(obj.area == item.area && obj.date == item.date && obj.hour == item.hour))
}