export interface degreeType  {
    index:number
    degree:any
 }

export const initDegree = (colNum:number) => {
    let array:degreeType[] = []
    for(let i=0;i<colNum-1;i++){
        let item:degreeType = {
            index: i,
            degree:{}
        }
        array.push(item)
        
    }

    return array
}