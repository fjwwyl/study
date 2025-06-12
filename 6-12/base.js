var Base;
(function (Base) {
    Base[Base["BAD"] = 0] = "BAD";
})(Base || (Base = {}));
var a = Base.BAD;
var b = "123";
var c = b;
console.log(a, b, c);
