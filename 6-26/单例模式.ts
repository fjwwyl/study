/**
 * 单例模式
 *
 * 一个类只能生成一个实例，并且提供一个全局访问点，前端来管理全局状态和资源
 *
 *
 */

class Singleton {
  //构造函数私有化会使得在类外边无法使用new创建实例
  name: string

  private constructor(name) {
    this.name = name;
  }

  private static instance: Singleton | null = null;

  static getInstance(name) {
    if (Singleton.instance === null) {
      Singleton.instance = new Singleton(name);
    }
    return Singleton.instance;
  }
}

//构造函数私有化
const s = Singleton.getInstance("fjw");
const s1 = Singleton.getInstance("fjw1");
console.log(s, s1);