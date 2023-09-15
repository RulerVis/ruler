import { select } from "d3"

export const initFieldsSelection = (fields:any,allData:any) => {
    let selection:any[] = []
    let columns = ["date","plate","HitPlayer","StrikeEffect","saleorderid","total_package_num","from_phase","from_phase_status","phase","phase_status","day","player_id","team_id","event_player","学区等级","日期"]
    for(let i=0;i<fields.length;i++){
        let item:any={}
        item.name = fields[i]
        let value = allData[0][fields[i]]
        if(isNaN(value) || columns.includes(fields[i])){
            item.type = "nominal"
            item.adjust = false
        }
        else{
            item.type = "quantitative"
            item.adjust = true
            item.binNum = 6
        }
        selection.push(item)
    }
    // console.log("selection")
    // console.log(selection)
    return selection
}