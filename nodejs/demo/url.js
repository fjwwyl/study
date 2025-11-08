const {URL} = require("url");

const myURL = new URL("http://fjw.com:8080/name/test?query=value");
console.log(myURL);


const search = new URLSearchParams("key=value");

//append  追加
//set    设置
// 可以直接修改
//url模块和http模块值继承