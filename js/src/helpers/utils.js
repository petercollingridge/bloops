function sum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

function mean(arr) {
    if (arr.length === 0) { return null; }
    return sum(arr) / arr.length;
}
