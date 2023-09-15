export const initRankMode = (fields:any[]) => {
    let rankArray:any[] = []
    for(let i=0;i<fields.length;i++){
        let item:any = {}
        item.name = fields[i]
        item.mode = "default"
        rankArray.push(item)
    }
    return rankArray
}