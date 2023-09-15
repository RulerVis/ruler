export const generateKey = (min:number,max:number,interval:number) => {
    if(interval > 1){
        return Math.round(min).toString() + "-" + Math.round(max).toString()
    }
    else{
        const diff = max - min
        const decimalPlaces = getDecimalPlaces(diff)
        return min.toFixed(decimalPlaces).toString() + "-" + max.toFixed(decimalPlaces).toString()
    }
}

const getDecimalPlaces = (num:number) => {
    const numStr = num.toString();
    const decimalIndex = numStr.indexOf('.');
    if (decimalIndex === -1) {
        return 0;
    }
    let zeroCount = 0;
    for (let i = decimalIndex + 1; i < numStr.length; i++) {
        if (numStr[i] === '0') {
        zeroCount++;
        } else {
        break;
        }
    }
    return zeroCount + 1;
}