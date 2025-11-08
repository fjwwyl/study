function quickSort(arr) {
    // 基线条件：数组长度为0或1时直接返回
    if (arr.length <= 1) {
        return arr;
    }

    // 选择基准值（pivot），通常选择中间元素
    const pivot = arr[Math.floor(arr.length / 2)];

    // 分区（partition）
    const left = [];
    const right = [];
    const equal = [];

    for (let element of arr) {
        if (element < pivot) {
            left.push(element);
        } else if (element > pivot) {
            right.push(element);
        } else {
            equal.push(element);
        }
    }

    // 递归调用并合并结果
    return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 使用示例
const array = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(array)); // 输出: [1, 1, 2, 3, 6, 8, 10]