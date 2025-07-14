const name = "fjw";
const age = 18;
const printName = function () {
    console.log(name);
}
const {height} = require("./test")

// module.exports = {name, age};

exports.printName = printName;
exports.name = name;
exports.age = age;
exports.height = height;