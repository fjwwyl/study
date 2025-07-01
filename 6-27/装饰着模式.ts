/**
 *
 * 装饰者模式就是动态给一个对象添加额外的职责
 *
 */


/**
 * js写法
 */


function Dec(a, b) {
  this.a = a;
  this.b = b;
}

Dec.prototype.add = function () {
  return this.a + this.b;

}

/**
 * 修改obj的方法
 * @param obj
 */
function setSub(obj) {
  obj.sub = function () {
    return this.a - this.b;
  }
  return obj;
}

//
// const d = new Dec(1, 2);
// setSub(d);
// console.log(d.sub(), d.add());


//ts写法

const deco = (constructor: Function) => {

  constructor.prototype.sub = function () {
    return this.a - this.b;
  }
  return constructor;
}

// @ts-ignore

@deco
// @ts-ignore
class Decorator {

  a: number
  b: number

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  // @ts-ignore
  add() {
    return this.a + this.b;
  }
}

const d = new Decorator(1, 2);
// @ts-ignore
console.log(d.add(), d.sub());

