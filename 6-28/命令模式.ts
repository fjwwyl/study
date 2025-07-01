/**
 * 命令模式就是将操作封装对象，这些命令对象可以被储存传递或者执行
 *
 *
 *
 */

class Command {
  receiver: Receiver
  args: any
  executed: boolean

  constructor(receiver: Receiver, args: any) {
    this.receiver = receiver;
    this.args = args;
    this.executed = false
  }

  execute() {
    if (!this.executed) {
      this.receiver.execute(this.args);
      this.executed = true;
    }
  }

  undo() {
    if (this.executed) {
      this.receiver.undo(this.args);
      this.executed = false;
    }
  }
}


class Receiver {
  value: number

  constructor() {
    this.value = 0;
  }

  execute(args: number) {
    this.value += args;
  }

  undo(args: number) {
    this.value -= args;
  }
}

const r = new Receiver();

const c1 = new Command(r, 1);
const c2 = new Command(r, 2);
const c3 = new Command(r, 3);


c1.execute();
c2.execute();
c3.execute();
console.log(r.value);
c1.undo();
console.log(r.value);
c1.execute();
console.log(r.value);

