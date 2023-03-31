import { valueToOperator } from "./filterToColumn"
import { valueToString } from "./filterToColumn"

export const MatrixToRow = (matrixFilter:any[]) => {
    let set = matrixFilter.slice()
    set = set.filter((filter:any) => (filter.values.length > 0))
    for(let i=0;i<set.length;i++){
        for(let j=0;j<set[i].values[0].length;j++){
            let item:any = {}
            item.operator = valueToOperator(set[i].values[0][j].type)
            item.value = valueToString(set[i].values[0][j])
            set[i].values[0][j] = item
        }

    }
    return set
}