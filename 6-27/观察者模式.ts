/***
 *
 * 观察者模式
 *
 *
 * 一对多，一个被观察者多个观察者
 *
 * 被观察者具有唯一性
 *
 * 当被观察者发生变化的，会通知所有的观察者让其更新
 */

class Observer {
  name: string

  constructor(name: string) {
    this.name = name;
  }


  update(data: any) {
    console.log("Observer:" + this.name + data);

  }
}

class Observer1 {
  name: string

  constructor(name: string) {
    this.name = name;
  }


  update(data: any) {
    console.log("Observer1:" + this.name + data);

  }
}


class Subject {

  observers: Array<Observer | Observer1>

  constructor() {
    this.observers = [];
  }

  addObserver(observer: Observer | Observer1) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer | Observer1) {
    this.observers = this.observers.filter(f => f !== observer);
  }

  notify(data: any) {
    this.observers.forEach(f => f.update(data));
  }

}


const o = new Observer("fjw");
const o1 = new Observer1("fjw1");

const s = new Subject();


s.addObserver(o);
s.addObserver(o1);
s.notify("s___");