/**
 *
 *
 * 提供一个可以顺序访问对象的迭代器
 */

/**
 * 原型模式
 * 通过克隆现有对象来创建新的对象
 */

/**
 * 过滤器模式
 *
 * 接受一个数据集合和一个过滤条件返回符合条件的数据集合
 *
 *
 */

/**
 * 外观模式
 *
 */

/**
 * 计算属性模式
 *
 */

class computed {
  height: number
  width: number

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }

  get area() {
    return this.width * this.width;
  }
}

/**
 * 路由模式
 *
 *
 * 将页面的不同状态映射到不同的url路径上，使用户通过不同的url来访问页面
 */

/**
 * 解释器模式
 *
 *
 * ast抽象语法树
 * 使用的是解释器模式
 *
 *
 */

/**
 * 依赖注入模式
 * 对象的以来关系从代码中分离出来，使得代码更加模块化和可重用
 *
 */

/**
 * 面试题
 *
 * 1.Object.defineProperty()进行数据劫持有什么缺点？
 * 通过下标或者给对象新增属性的时候是无法进行数据十是更新，数组的大部分操作无法拦截
 * vue2通过对数组方法的重写
 *
 *
 * 2. computed和watch有什么缺点？
 *
 * 3.实现一个过滤器
 */

