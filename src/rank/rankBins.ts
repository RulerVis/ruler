export const sortBins = (arr: any[],mode:string): any[] =>  {
    // Sort the array of objects based on the count attribute
    arr.sort((a:any, b:any) => (b.count - a.count) * (mode=="up"?1:-1));
  
    // Update the binIndex attribute based on the ranking of the count attribute
    let rank = 0;
    let prevCount = arr[0].count;
    const newArray: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      obj.binIndex = rank;
      rank++;
      newArray.push(obj);
    }
    return newArray;
  }