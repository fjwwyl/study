<template>
  <div class="p-5">
    <div class="card-box p-5">
      <div>1.懒加载（路由懒加载，图片懒加载）</div>
      <div>2.异步组件</div>
      <div>3.v-if或者v-show避免不如要的组建的渲染</div>
      <div>4.网络优化手段</div>
      <div>5.打包优化手段</div>
      <div>6.设置key值</div>
      <div>7.computed</div>
      <div>8.keepalive</div>
      <div>9.冻结对象</div>
      <div>10.函数式组件</div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">懒加载</div>
      <div class="content">
        <div>
          懒加载也叫做延迟加载、按需加载，指的是在长网页中延迟加载图片数据，是一种较好的网页性能优化的方式。在比较长的网页或应用中，如果图片很多，所有的图片都被加载出来，而用户只能看到可视窗口的那一部分图片数据，这样就浪费了性能。
          如果使用图片的懒加载就可以解决以上问题。在滚动屏幕之前，可视化区域之外的图片不会进行加载，在滚动屏幕时才加载。这样使得网页的加载速度更快，减少了服务器的负载。懒加载适用于图片较多，页面列表较长（长列表）的场景中。
        </div>
        <div>
          减少无用资源的加载：使用懒加载明显减少了服务器的压力和流量，同时也减小了浏览器的负担。
          提升用户体验: 如果同时加载较多图片，可能需要等待的时间较长，这样影响了用户体验，而使用懒加载就能大大的提高用户体验。
          防止加载过多图片而影响其他资源文件的加载 ：会影响网站应用的正常使用。
        </div>
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">异步组件</div>
      <div class="content">
        按需加载，需要用到组件才会被渲染，可以提升首页加载速度
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">v-if或者v-show避免不如要的组建的渲染</div>
      <div class="content">
        手段：v-if是动态的向DOM树内添加或者删除DOM元素；v-show是通过设置DOM元素的display样式属性控制显隐；
        编译过程：v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show只是简单的基于css切换；
        编译条件：v-if是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; v-show是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且DOM元素保留；
        性能消耗：v-if有更高的切换消耗；v-show有更高的初始渲染消耗；
        使用场景：v-if适合运营条件不大可能改变；v-show适合频繁切换。
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">网络优化手段</div>
      <div class="content">
        1.减少请求
        2.打包资源给cdn
        3.启用HTTP/2，支持多路复用，就是允许多个请求和响应在一个tcp连接里边，传输为二进制，便于解析，提升加载效率
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">打包优化手段</div>
      <div class="content"></div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">设置key值</div>
      <div class="content">
        vue渲染的时候是对比出不同的虚拟dom然后渲染，使用key可以很快的对比出可以复用的组件，避免重新新增或者删除新的dom
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">computed</div>
      <div class="content">
        computed有缓存，只有依赖的响应数据变化之后才会变化，否则一直会缓存之前计算的结果，
        拓展：和methods、watch的区别
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">keepalive</div>
      <div class="content">
        如果需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。
        展示性的组件防止多次渲染
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">冻结对象</div>
      <div class="content">
        如果只是作为页面的一个展示就不需要标记响应式，直接展示就可以了。
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">函数式组件</div>
      <div class="content">
        无状态和无实例
        无状态：函数式组件没有响应式数据，减少了 Vue 的响应式系统开销。

        无实例：不创建组件实例，减少了内存占用和初始化时间。

        2. 轻量级渲染
        无生命周期钩子：函数式组件没有生命周期钩子，减少了相关逻辑的执行。

        无 this 上下文：不依赖 this，避免了上下文的创建和维护。

        3. 更快的渲染
        简化 Virtual DOM：函数式组件直接返回渲染函数，生成的 Virtual DOM 更简单，对比和更新更快。
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
.title {
  font-size: 30px;
  font-weight: 6600;
}

.content {
  font-size: 15px;
  font-weight: 700;
}

</style>