const demo = require("./demo/module")
const test = require("./demo/test")
const copy = require("./demo/copy")
console.log("fjw", copy.num, copy.getNum(), copy.getName());
copy.addNum()
copy.setName()
console.log("fjw", copy.num, copy.getNum(), copy.getName());

//同样是修改num和name，但是num有变化，name无变化
//导入是非引用的值则是按照导出的值所以一直都是1而且每个 模块五项不影响
//引用的 值则是同一个内存会互相英雄

