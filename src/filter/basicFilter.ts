export const basicFilter = (item:any,fieldName:string,value:string,operator:string) => {
    let data = item[fieldName]
    if(operator == "equal to"){
        if(data == value || Number(data) == Number(value)) return true
    } 
    else if(operator == "not equal to"){
        if(data != value) return true
    }
    else if(operator == "larger than"){
        if(Number(data) > Number(value)) return true
    }
    else if(operator == "smaller than"){
        if(Number(data) < Number(value)) return true
    }
    else if(operator == "in"){
        console.log("there you go")
        const condition = transformString(value)
        if(condition.type == "array"){
            if(condition.values.includes(data)) return true
        }
        else if(condition.type == "range"){
            const num = Number(data)
            if((num > condition.values.min && num < condition.values.max) || (condition.values.minInRange && num == condition.values.min) || (condition.values.maxInRange && num == condition.values.max)) return true
        }
    }
    else if(operator == "not in"){
        const condition = transformString(value)
        if(condition.type == "array"){
            if(!condition.values.includes(data)) return true
        }
        else if(condition.type == "range"){
            const num = Number(data)
            if(!((num > condition.values.min && num < condition.values.max) || (condition.values.minInRange && num == condition.values.min) || (condition.values.maxInRange && num == condition.values.max))) return true
        }
    }
    return false
}


function transformString(input: string):any{
    const startBracket = input[0];
    const endBracket = input[input.length - 1];
  
    if (startBracket === '{' && endBracket === '}') {
      const values = input.slice(1, -1).split(',').map(v => v.trim());
      return {type:"array","values":values};
    }
  
    if ((startBracket === '[' || startBracket === '(' || startBracket === '（') && (endBracket === ']' || endBracket === ')' || endBracket === '）')) {
      const values = input.slice(1, -1).split(',').map(v => v.trim());
      const min = parseFloat(values[0]);
      const max = parseFloat(values[1]);
  
      if (isNaN(min) || isNaN(max)) {
        throw new Error('Invalid input string format');
      }
  
      const minInRange = startBracket === '[' || startBracket === '（';
      const maxInRange = endBracket === ']' || endBracket === '）';
  
      return {type:"range","values":{ min, max, minInRange, maxInRange }};
    }
  
    throw new Error('Invalid input string format');
}

export const columnFilter = (item:any,filter:any) => {
    for(let i=0;i<filter.values.length;i++){
        if(basicFilter(item,filter.fieldName,filter.values[i].value,filter.values[i].operator)) return true
    }
    return false
}

export const varianceFilter = (items:any[],fieldName:string,value:string,operator:string) => {
    let values:number[] = items.map((item:any)=>(Number(item[fieldName])))
    let variance = calculateVariance(values)
    console.log("variance")
    console.log(variance)
    if(operator == "equal to"){
        if(variance == Number(value)) return true 
    }
    else if(operator == "not equal to"){
        if(variance != Number(value)) return true
    }
    else if(operator == "larger than"){
        if(variance > Number(value)) return true
    }
    else if(operator == "smaller than"){
        if(variance < Number(value)) return true
    }
    return false
}

export function calculateVariance(arr: number[]): number {
    const n = arr.length;
    if (n < 2) {
      return 0
    }
    const mean = arr.reduce((sum, x) => sum + x, 0) / n;
    const sumSquares = arr.reduce((sum, x) => sum + (x - mean) ** 2, 0);
    return sumSquares / (n - 1);
  }

  export const compareFilter = (number:number,value:number,operator:string) => {
    if(operator=="equal to"){
        if(number == value) return true
    }
    else if(operator=="not equal to"){
        if(number != value) return true
    }
    else if(operator=="larger than"){
        if(number > value) return true
    }
    else if(operator=="smaller than"){
        if(number < value) return true
    }
    return false
  }
  



