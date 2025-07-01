/**
 *
 *
 * 发布者订阅者模式是一个发布者和订阅解耦的设计模式
 * 解耦（Decoupling）是软件工程中一个核心的设计原则，指的是减少程序组件之间的依赖关系，使它们能够独立变化而不互相影响。
 *
 *
 * 发布者维护一个事件列表，可以添加事件或者删除事件，当某个事件发生时将通知订阅者这个事件已经发生
 *
 * 订阅者订阅发布者的事件，然后在发布者通知后触发自己的方法

 */

class EventEmitter {
  events: Record<string, (data: any) => string> = {}


  public addEvents(name: string, cb: (data) => string) {
    if (!this.events[name]) {
      // @ts-ignore
      this.events[name] = [];
    }
    // @ts-ignore
    this.events[name].push(cb);
  }


  public removeEvents(name: string, cb: (data) => string) {
    if (!this.events[name]) {
      // @ts-ignore
      this.events[name] = [];
    }
    // @ts-ignore
    this.events[name] = this.events[name].filter(f => f != cb);
  }

  public eventEmit(name: string, data: any) {

    // @ts-ignore

    // @ts-ignore
    for (let cb of this.events[name]) {
      console.log(cb,cb("faw"));
      // @ts-ignore
      cb(data);
    }

  }
}

const e = new EventEmitter();
e.addEvents("add", function (a) {
  return a + "fffff";
})
e.addEvents("add", function (a) {
  return a + "jjjjj";
})
e.eventEmit("add", "fjw");
e.eventEmit("add", "wyl");
console.log(e);