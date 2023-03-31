export const constructStatistics = (data:any[],leftColumns:string[],rightColumn:string) => {
    const stats:any[] = []

    for(let i=0;i<data.length;i++){
        if(i==0) {
            let item:any = {}
            item.left = leftColumns.map((key:string)=>(data[i][key]))
            item.right = {}
            item.right[data[i][rightColumn]] = 1
            stats.push(item)
        }
        else{
            let index = valueInLeft(stats.map((item:any)=>(item.left)),leftColumns.map((key:string)=>(data[i][key])))
            if(index >= 0){
                if(valueInRight(Object.keys(stats[index].right),data[i][rightColumn]) == true) stats[index].right[data[i][rightColumn]] = stats[index].right[data[i][rightColumn]] + 1
                else stats[index].right[data[i][rightColumn]] = 1
            }
            else{
                let item:any = {}
                item.left = leftColumns.map((key:string)=>(data[i][key]))
                item.right={}
                item.right[data[i][rightColumn]] = 1
                stats.push(item)
            }
        }
    }
    return stats
}



const valueInLeft = (doubleList:string[][],list:string[]) => {
    for(let i=0;i<doubleList.length;i++){
        let flag = true
        for(let j=0;j<doubleList[i].length;j++){
            if(list[j] != doubleList[i][j]){
                flag = false
                break
            }
        }
        if(flag == true) return i
    }
    return -1
}

const valueInRight = (list:string[],value:string) => {
    if(list.includes(value)) return true
    else return false
}

export const constructNumberArray = (data:any) => {
    let array = []
    for(const key in data){
        for(let i=0;i<data[key];i++){
            array.push(Number(key))
        }
    }
    return array
}

