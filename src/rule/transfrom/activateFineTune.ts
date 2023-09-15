import { Setter } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { BarToColumn } from "./filterToColumn"
import { LineToColumn } from "./filterToColumn"
import { MatrixToRow } from "./filterToRow" 
import { countFilter } from "../count/countFilter"
import { countValues } from "../count/countFilter"


export const activateFineTune = (setNotifVisible:Setter<boolean>,setOneMode:Setter<boolean>,setColumnMode:Setter<boolean>,setColumnSet:SetStoreFunction<any[]>,setRowMode:Setter<boolean>,setRowSet:SetStoreFunction<any[]>,rule:any) => {
    if(countFilter(rule.barFilter)>0 && countFilter(rule.lineFilter) ==0 && countFilter(rule.matrixFilter) == 0){
        setOneMode(true)
        setColumnMode(true)
        setColumnSet(BarToColumn(rule.barFilter))
    }
    else if(countFilter(rule.barFilter)==0 && countValues(rule.lineFilter) == 1 && countFilter(rule.matrixFilter) == 0){
        setOneMode(true)
        setColumnMode(true)
        setColumnSet(LineToColumn(rule.lineFilter))
    }
    else if(countFilter(rule.barFilter)==0 && countFilter(rule.lineFilter) == 0 && countFilter(rule.matrixFilter) >0 && countFilter(rule.matrixFilter) <=2 && countValues(rule.matrixFilter) == 1){
        setRowMode(true)
        setRowSet(MatrixToRow(rule.matrixFilter))
    }
    else{
        setNotifVisible(true)
    }
}