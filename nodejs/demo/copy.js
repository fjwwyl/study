let num = 1;
let user = {
    name: "fjw"
}
exports.num = num;
exports.user = user;
exports.addNum = () => {
    num += 1;
}
exports.setName = () => {
    user.name = "fjw1";
}

exports.getNum = () => {
    return num;
}

exports.getName = () => {
    return user.name;
}