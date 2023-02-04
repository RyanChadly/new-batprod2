const combinationUtil = (
  arr: any[],
  data: any[],
  start: number,
  end: number,
  index: number,
  lengthToPrint: number,
  result: any[][]
) => {
  if (index === lengthToPrint) {
    result.push(data.slice(0, lengthToPrint));
  }

  for (let i = start; i <= end && end - i + 1 >= lengthToPrint - index; i++) {
    data[index] = arr[i];
    combinationUtil(arr, data, i + 1, end, index + 1, lengthToPrint, result);
  }
};
export const getAllCombinations = (arr: any[]) => {
  const arrayLength = arr.length;
  let data = new Array(arrayLength);
  const result: any[][] = [];

  for (let lengthToPrint = arrayLength; lengthToPrint > 0; lengthToPrint--) {
    combinationUtil(arr, data, 0, arrayLength - 1, 0, lengthToPrint, result);
  }
  return result;
};
//https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/
