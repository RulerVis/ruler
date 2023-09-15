import { columnFilter } from "../filter/basicFilter"
import { countFilter } from "./count/countFilter"
import { BarToColumn } from "./transfrom/filterToColumn"
import { linkToNL } from "./transfrom/linkToNL"
import { matrixToNL } from "./transfrom/matrixToNL"

export const ruleToNL = (rule:any) => {
    let NL = "If "
    if(rule.type == "one-to-one"){
        if(rule.link?.type??""!=""){
            NL = NL + rule.link.leftColumns[0] + " is " + rule.link.operator + " " + rule.link.rightColumn 
        }
        if(columnFilterToNL(rule.columnSet)!="" && (rule.link?.type??""!="")){
            NL = NL + ", "   
        }
        NL = NL + columnFilterToNL(rule.columnSet)
    }
    else if(rule.type == "one-to-many"){
        if(rule.link?.type??""!=""){
            NL = NL + linkFilterToNL(rule.link)
        }
        if(columnFilterToNL(rule.columnSet)!="" && (rule.link?.type??""!="")){
            NL = NL + ", "   
        }
        NL = NL + columnFilterToNL(rule.columnSet)
    }
    else if(rule.type == "sequence"){
        if(rule.variance?.value??""!=""){
            NL = NL + "for " + rule.rowSet[0].fieldName + "," + "the variance of a " +  rule.rowSet[0].values[0].length.toString() + "-step sequence " + "is " + rule.variance.operator + " " + rule.variance.value
        }
        else{
            NL = NL + "a " + rule.rowSet[0].values[0].length.toString() + "-step sequence " + "is: " + sequenceToNL(rule.rowSet)
        }
    }
    else if(rule.type == "interaction"){
        NL = NL + columnFilterToNL(BarToColumn(rule.barFilter))
        if(NL!="If " && countFilter(rule.lineFilter)!=0) NL = NL + ";"
        NL =  NL + linkToNL(rule.lineFilter)
        NL = NL + matrixToNL(rule.matrixFilter)
    }
    NL = NL + " ,it's an error."
    return NL
}

const columnFilterToNL = (columnSet:any[]) => {
    let NL=""
    for(let i=0;i<columnSet.length;i++){
        if(columnSet[i].values.length > 0){
            let filter = columnSet[i].fieldName + " is "
            for(let j=0;j<columnSet[i].values.length;j++){
                filter = filter + columnSet[i].values[j].operator + " " + columnSet[i].values[j].value
                if(j!=columnSet[i].values.length-1) filter = filter + " or "
            }
            filter = filter + ", and "
            NL = NL + filter
        }   
    }
    NL = NL.substring(0,NL.length - 6)
    return NL
}

const linkFilterToNL = (link:any) => {
    let NL = ""
    if(link.leftColumns.length > 1){
        NL = NL + "for each combination of "
    }
    else if(link.leftColumns.length == 1){
        NL = NL + "for each "
    }
    NL = NL + columnNameCombination(link.leftColumns)
    NL = NL + ", " + "the " + link.type + " of "
    if(link.type == "cardinality" || link.type == "variance"){
        NL = NL + "all linked values of " + link.rightColumn + " is "
    }
    else if(link.type == "quantity"){
        NL = NL + "the links to a single value of " + link.rightColumn + " is "
    }
    NL = NL + link.operator + " " + link.value
    return NL
}

const columnNameCombination = (leftColumns:any[]) => {
    let combination = ""
    for(let i=0;i<leftColumns.length;i++){
        combination = combination + "value of " + leftColumns[i]
        if(i!=leftColumns.length-1) combination = combination + " and "
    }
    return combination
}

const sequenceToNL = (rowSet:any[]) => {
    let NL = "["
    for(let i=0;i<rowSet[0].values[0].length;i++){
        let rowNL = ""
        for(let j=0;j<rowSet.length;j++){
            rowNL = rowNL + rowSet[j].fieldName + " " + rowSet[j].values[0][i].operator + " " + rowSet[j].values[0][i].value
            if(j!=rowSet.length-1) rowNL = rowNL + " and "
        }
        if(i !=rowSet[0].values[0].length - 1) rowNL = rowNL + "; "
        NL = NL + rowNL

    }
    NL = NL + "]"
    return NL

}