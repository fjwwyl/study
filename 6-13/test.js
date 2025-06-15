// 元组
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var aaa;
// aaa = ["a", "b", 123];
//上边的代码会报错，只能两项
//Type '[string, string, number]' is not assignable to type '[string, string]'.
//   Source has 3 element(s) but target allows only 2.
// void 声明返回值为空
//如果return则直接报错  test.ts:14:3 - error TS2322: Type 'string' is not assignable to type 'void'.
function test() {
}
//声明函数永不返回
// @ts-ignore
function test1() {
    while (1) {
        console.log(1);
    }
}
var test2 = {
    name: "fjw",
    age: 18,
    classes: 7,
    // from: "china" //test.ts:48:3 - error TS2353: Object literal may only specify known properties, and 'from' does not exist in type 'test'.
};
test2.name = "fjw1";
//test2.classes = 8;  //test.ts:50:7 - error TS2540: Cannot assign to 'classes' because it is a read-only property.
// readonly是只读属性
//readonly和js引用的区别
var arr = [1, 2, 3, 4];
var arr1 = [1, 2, 3, 4];
var a = {
    name: "fjw"
};
var b = {
    age: 18,
    name: "fjw"
};
var eee;
console.log(eee);
console.log(a, b);
// 冲突了就需要重新这是新的type
// type hhh = fff & ggg;
// let h: hhh = {
//   b: 1,
//   c: 1
// }
// console.log(h);
// 断言
//尖括号声明 阶段性的类型
var anyValue = 'test';
var anyLength = anyValue.length; //在一个阶段给any的赋值
var anyLength1 = anyValue.length;
var start = function (classTime) {
    var num = classTime; //具体类型可能为多种，但是非空确认
    console.log(num);
};
start(function () {
    return 1;
});
//泛型
function startClass(name, score) {
    return name + (String(score));
}
console.log(startClass('ts', 5));
//类装饰器
function test16(target) {
    console.log(target);
    target.prototype.add = function (x, y) {
        return x + y;
    };
    return target;
}
var Class = function () {
    var _classDecorators = [test16];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var Class = _classThis = /** @class */ (function () {
        function Class_1(name) {
            this.name = name;
        }
        return Class_1;
    }());
    __setFunctionName(_classThis, "Class");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Class = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Class = _classThis;
}();
var xxx = new Class("fjw");
console.log(xxx, Class);
