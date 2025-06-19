import {createSSRApp} from "vue"


/**
 * 把当前页面已经渲染的DOM元素和vue.js渲染的虚拟DOM建立联系
 由于真实DOM和虚拟DOM都是树形结构，并且节点之间存在相互关系的，激活就可以通过递归在真实
 DOM和虚拟DOM之间建立联系，即vnode.el=el，并且保证是从容器元素的第一个子节点开始，即
 el.firstChild
 为页面中DOM元素添加事件绑定，使页面支持事件交互
 vue.js从HTMI中提取由服务端序列化后发送过来的数据
 * @param str
 * @returns {{str, count: number}|*}
 */
function createApp(str) {
  return createSSRApp({
    data() {
      return {
        str: str,
        count: 1
      }
    },
    template: `<div>{{str}}</div>
               <button @click="count++">{{count}}</button>`
  })
}

createApp().mount("#app");