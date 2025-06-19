import express from "express"
import {renderToString} from "vue/server-renderer"
import {createSSRApp} from "vue"

const app = express();


/**
 * 1.同构流程
 ●服务端渲染应用快照
 ○生成快照的同时，还会生成当前数据状态的初始数据，给客户端做初始化处理
 ○应用快照不具备事件绑定的能力，即定义好的事件不会注册到DOM上
 ●客户端激活
 ○把当前页面已经渲染的DOM元素和vue.js渲染的虚拟DOM建立联系
 ◇由于真实DOM和虚拟DOM都是树形结构，并且节点之间存在相互关系的，激活就可以通过递归在真实
   DOM和虚拟DOM之间建立联系，即vnode.el=el，并且保证是从容器元素的第一个子节点开始，即
   el.firstChild
 。为页面中DOM元素添加事件绑定，使页面支持事件交互
 。vue.js从HTMI中提取由服务端序列化后发送过来的数据
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

/**
 *
 * 服务端渲染应用快照
 生成快照的同时，还会生成当前数据状态的初始数据，给客户端做初始化处理
 应用快照不具备事件绑定的能力，即定义好的事件不会注册到DOM上
 * @param str
 * @returns {string}
 */
function getHtml(str) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<script type="importmap">
{
    "imports":{
        "vue":"https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
}

</script>
<script type="module" src="/click.js"></script>
<body>
<div id="app">${str} </div>
</body>
</html>`
}

app.get("/home", async (req, res) => {
  const vueStr = await renderToString(createApp("test"))
  const html = getHtml(vueStr);
  res.send(html);
})


app.use(express.static("."));
app.listen(3000, () => {
  console.log("服务启动")
})