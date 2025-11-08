const fs = require("fs");

const path = require("path");


// console.time("fs");
// const data = fs.readFileSync(path.join(__dirname, "../index.js"));
// console.timeEnd("fs")
//
//
// //同步代码如果报错就不会执行1+1，需要对fs的读取操作进行trycatch
//
//
//
//
// console.log(data);
// console.log(1 + 1)


console.time("fs");
const filename = path.join(__dirname, "../index.js");

fs.readFile(filename, ((err, data) => {
    console.log(err, data);
}))
console.timeEnd("fs");
console.log(1 + 1);
