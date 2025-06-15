// 元组

let aaa: [string, string];
// aaa = ["a", "b", 123];
//上边的代码会报错，只能两项
//Type '[string, string, number]' is not assignable to type '[string, string]'.
//   Source has 3 element(s) but target allows only 2.

// void 声明返回值为空

//如果return则直接报错  test.ts:14:3 - error TS2322: Type 'string' is not assignable to type 'void'.
function test(): void {
}


//声明函数永不返回
// @ts-ignore
function test1(): never {
  while (1) {
    console.log(1);
  }
}

//any绕过所有的类型检查
// unknown  绕过赋值检查，禁止更改传递


//非原始类型  object


// interface test {
//   toString(): string
// }


//interface

interface test {
  name: string;
  age: number;
  readonly classes: number
}

let test2: test = {
  name: "fjw",
  age: 18,
  classes: 7,
  // from: "china" //test.ts:48:3 - error TS2353: Object literal may only specify known properties, and 'from' does not exist in type 'test'.

}
test2.name = "fjw1";
//test2.classes = 8;  //test.ts:50:7 - error TS2540: Cannot assign to 'classes' because it is a read-only property.

// readonly是只读属性

//readonly和js引用的区别
let arr: number[] = [1, 2, 3, 4];
let arr1: ReadonlyArray<number> = [1, 2, 3, 4];
//arr1[0] = "2"//test.ts:57:1 - error TS2542: Index signature in type 'readonly number[]' only permits reading.
//readonly定义的数组不能有任何修改，如果是js中的const则可以const指定的数组内容可以修改只要不修改数组的指向计可

//可添加
interface test {
  name: string;
  age: number;
  readonly classes: number;

  [keyName: string]: any
}


//type   interface
type aaa = {
  name: string
}

type bbb = aaa & {
  age: number
}

let a: aaa = {
  name: "fjw"
}
let b: bbb = {
  age: 18,
  name: "fjw"
}
// interface可以使用extends来继承声明在原有的基础上继续拓展

// interface也可以使用extends来继承type的声明
interface ccc extends bbb {

}

//相同点 都可以用来描述对象函数，都是可以拓展的

//不同点  type可以计算

type ddd = aaa | bbb;

// interface可以多次定义


// type的计算能力
type keys = "name" | "nickName";

let eee: keys;

type eee = {
  [key in keys]: string
}
console.log(eee);


console.log(a, b);


// 联合冲突


interface fff {
  a: string;
  b: number
}

interface ggg {
  a: number;
  c: number

}

// 冲突了就需要重新这是新的type
// type hhh = fff & ggg;
// let h: hhh = {
//   b: 1,
//   c: 1
// }
// console.log(h);


// 断言


//尖括号声明 阶段性的类型
let anyValue: any = 'test'
let anyLength: number = (<string>anyValue).length;  //在一个阶段给any的赋值

let anyLength1: number = (anyValue as string).length;

type ClassTime = () => number
const start = (classTime: ClassTime | undefined) => {
  let num = classTime!//具体类型可能为多种，但是非空确认

  console.log(num);
}
start(() => {
  return 1;
});


//泛型

function startClass<T, U>(name: T, score: U): T {
  return name + (String(score)) as any;
}

console.log(startClass<string, number>('ts', 5));


//类装饰器

//属性装饰器


//不会使用
function test16(target: Function): Function {
  console.log(target);
  target.prototype.add = function (x: string, y: string): string {
    return x + y;
  }
  return target;
}

@test16
class Class {
  name: string

  constructor(name) {
    this.name = name;
  }
}


let xxx: Class = new Class("fjw");
console.log(xxx, Class);