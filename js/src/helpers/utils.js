function extract(arr, accessor) {
  return arr.map(item => item[accessor]);
}

function sum(arr, accessor) {
    let sum = 0;

    if (accessor) {
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i][accessor];
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
    }

    return sum;
}

function sumSq(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i] * arr[i];
    }
    return sum;
}

function mean(arr, accessor) {
    if (arr.length === 0) { return null; }
    return sum(arr, accessor) / arr.length;
}

function min(arr, accessor) {
    if (arr.length === 0) { return null; }
    let minValue = accessor ? arr[0][accessor] : arr[0];
    for (let i = 1; i < arr.length; i++) {
        const value = accessor ? arr[i][accessor] : arr[i];
        if (value < minValue) {
            minValue = value;
        }
    }
    return minValue;
}

function max(arr, accessor) {
    if (arr.length === 0) { return null; }
    let maxValue = accessor ? arr[0][accessor] : arr[0];
    for (let i = 1; i < arr.length; i++) {
        const value = accessor ? arr[i][accessor] : arr[i];
        if (value > maxValue) {
            maxValue = value;
        }
    }
    return maxValue;
}

function stdev(arr) {
    if (arr.length < 1) { return null; }
    const meanValue = mean(arr);
    return Math.sqrt(sumSq(arr) / arr.length - meanValue * meanValue);
}
