//提供和nodejs进程互动的接口

/**
 * process.env  环境变量
 * process.argv 命令行参数数组
 * process.cwd() 获取当前工作路径
 * process.exit() 进程推出
 * process.stdout  输出
 * process.stdin  输入
 */

//命令为node ./demo/process.js  --name=fjw

const argv = process.argv.splice(2).reduce((pre, cur) => {
    const [key, value] = cur.replace(/^--/, "").split("=");
    pre[key] = value;
    return pre;
}, {})

// console.log(argv);   {name:"fjw"}
const path = require("path");

console.log(process.cwd());

process.stdout.write("输入名字");
process.stdin.on("data", (data) => {
    const name = data.toString().trim();
    console.log("name", name);
    process.exit()
})

let progress = 0;
const interval = setInterval(() => {
    progress += 10;
    process.stdout.write(`进度：[${`=`.repeat(progress / 10)}${progress}%]\r`)

    if (progress >= 100) {
        clearInterval(interval)
    }
}, 100)
