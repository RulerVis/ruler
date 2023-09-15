import * as d3 from "d3"



export const dataGenerator = (rowNum:number,nominalColNum:number,quantitativeColNum:number) => {
    const MathRandomRange = [0, 1]
    const nominalValueRange:any = ["A", "B", "C", "D"]
    const quantitativeValueRange = [0, 100]
    const nominalScale = d3.scaleQuantize().domain(MathRandomRange).range(nominalValueRange)
    const quantitativeScale = d3.scaleLinear().domain(MathRandomRange).range(quantitativeValueRange)
    
    const data = []
    for (let i = 0; i < rowNum; i++) {
      const row = []
      for (let j = 0; j < nominalColNum; j++) {
        const randomValue = nominalScale(Math.random())
        row.push(randomValue)
      }
      for (let j = nominalColNum; j < nominalColNum + quantitativeColNum; j++) {
        const randomValue = Math.round(quantitativeScale(Math.random()))
        row.push(randomValue)
      }
      data.push(row)
    }
    return data


}