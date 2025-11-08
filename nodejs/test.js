setTimeout(() => {
    console.log("setTimeout")  //5
}, 0)
const p = new Promise((resolve => {
    console.log("promise 执行")  //1
    resolve()
}))

p.then(() => {
    console.log("then")  //4
})

process.nextTick(() => {
    console.log("process  nextTick")//3
})

console.log("代码执行")  //2