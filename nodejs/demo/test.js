const name = "fjw";
const age = 18;
const printName = function () {
    console.log(name);
}
const height = Math.random();
module.exports = {height};


// 给exports直接复制引用之后获取的是空对象
exports = {
    name,
    age,
    printName
}
// 本来exports和modules.exports指向同一个空对象，但是exports重新复制为堆内存的别的导致这个代码没有效果


