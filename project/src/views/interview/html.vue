<template>
  <div class="p-5">
    <div class="card-box p-5 mt-5">
      <div class="title">iframe 有那些优点和缺点？</div>
      <div class="content">
        <div>
          优点：

          用来加载速度较慢的内容（如广告）
          可以使脚本可以并行下载
          可以实现跨子域通信
        </div>
        <div>
          缺点：

          iframe 会阻塞主页面的 onload 事件
          无法被一些搜索引擎索识别
          会产生很多页面，不容易管理
        </div>
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">页面渲染的全过程</div>
      <div class="content">
        1. 解析HTML
        接收HTML：浏览器从服务器获取HTML文档。

        构建DOM树：浏览器解析HTML，将其转换为DOM（文档对象模型）树。DOM树是HTML文档的树状结构表示，每个节点代表一个HTML元素。

        2. 解析CSS
        接收CSS：浏览器获取CSS文件或内联样式。

        构建CSSOM树：浏览器解析CSS，生成CSSOM（CSS对象模型）树。CSSOM树表示所有CSS规则及其层级关系。

        3. 构建渲染树
        合并DOM和CSSOM：浏览器将DOM树和CSSOM树合并，生成渲染树（Render Tree）。渲染树只包含需要显示的节点及其样式信息。

        4. 布局（Layout）
        计算几何信息：浏览器根据渲染树计算每个节点的几何信息（如位置、大小），这一过程称为布局或重排（Reflow）。

        确定节点位置：浏览器确定每个节点在屏幕上的具体位置。

        5. 绘制（Paint）
        生成绘制指令：浏览器将渲染树转换为绘制指令，交给GPU处理。

        栅格化：浏览器将页面内容分解为多个图层，并将每个图层栅格化为位图。

        6. 合成（Composite）
        图层合并：浏览器将多个图层合成为最终的页面图像。

        显示页面：最终图像被发送到屏幕显示。

        7. 交互与更新
        事件处理：用户与页面交互时，浏览器处理事件并更新DOM或CSSOM。

        重绘与重排：如果DOM或CSSOM发生变化，浏览器会重新执行布局和绘制步骤，更新页面显示。
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">输入url按回车发生了什么？</div>
      <div class="content">
        <div>
          页面渲染的全过程涉及多个步骤，从浏览器接收HTML文档到最终在屏幕上显示页面。以下是详细的过程：

          1. 解析HTML
          接收HTML：浏览器从服务器获取HTML文档。

          构建DOM树：浏览器解析HTML，将其转换为DOM（文档对象模型）树。DOM树是HTML文档的树状结构表示，每个节点代表一个HTML元素。

          2. 解析CSS
          接收CSS：浏览器获取CSS文件或内联样式。

          构建CSSOM树：浏览器解析CSS，生成CSSOM（CSS对象模型）树。CSSOM树表示所有CSS规则及其层级关系。

          3. 构建渲染树
          合并DOM和CSSOM：浏览器将DOM树和CSSOM树合并，生成渲染树（Render Tree）。渲染树只包含需要显示的节点及其样式信息。

          4. 布局（Layout）
          计算几何信息：浏览器根据渲染树计算每个节点的几何信息（如位置、大小），这一过程称为布局或重排（Reflow）。

          确定节点位置：浏览器确定每个节点在屏幕上的具体位置。

          5. 绘制（Paint）
          生成绘制指令：浏览器将渲染树转换为绘制指令，交给GPU处理。

          栅格化：浏览器将页面内容分解为多个图层，并将每个图层栅格化为位图。

          6. 合成（Composite）
          图层合并：浏览器将多个图层合成为最终的页面图像。

          显示页面：最终图像被发送到屏幕显示。

          7. 交互与更新
          事件处理：用户与页面交互时，浏览器处理事件并更新DOM或CSSOM。

          重绘与重排：如果DOM或CSSOM发生变化，浏览器会重新执行布局和绘制步骤，更新页面显示。

          关键点
          重排（Reflow）：布局变化（如尺寸、位置）会触发重排，性能开销较大。

          重绘（Repaint）：样式变化（如颜色）会触发重绘，性能开销较小。

          优化：减少重排和重绘次数是提升页面性能的关键。

          总结
          页面渲染是一个复杂的过程，涉及HTML解析、CSS解析、渲染树构建、布局、绘制和合成等多个步骤。理解这些步骤有助于优化页面性能，提升用户体验。

          输入url按回车发生了什么？
          当你在浏览器中输入URL并按下回车键后，浏览器会执行一系列步骤来加载并显示页面。以下是详细的过程：

          1. URL解析
          解析URL：浏览器解析你输入的URL，提取协议（如http、https）、域名、端口、路径和查询参数等信息。

          检查缓存：浏览器会先检查本地缓存（如DNS缓存、资源缓存）中是否有可用的资源，以减少网络请求。

          2. DNS解析
          查找IP地址：如果域名不在缓存中，浏览器会向DNS服务器发送请求，将域名解析为对应的IP地址。

          浏览器缓存 → 系统缓存 → 路由器缓存 → ISP DNS缓存 → 递归DNS查询。

          建立连接：获取到IP地址后，浏览器准备与服务器建立连接。

          3. 建立TCP连接
          三次握手：浏览器通过TCP协议与服务器建立连接。

          浏览器发送SYN（同步）包到服务器。

          服务器回复SYN-ACK（同步-确认）包。

          浏览器发送ACK（确认）包，连接建立。

          HTTPS加密：如果使用HTTPS，还会进行TLS/SSL握手，协商加密密钥，建立安全连接。

          4. 发送HTTP请求
          构造请求：浏览器构造HTTP请求，包括请求方法（如GET、POST）、请求头（如User-Agent、Cookie）和请求体（如POST数据）。

          发送请求：通过TCP连接将请求发送到服务器。

          5. 服务器处理请求
          接收请求：服务器接收请求，并根据路径和参数处理请求。

          生成响应：服务器生成HTTP响应，包括状态码（如200、404）、响应头（如Content-Type）和响应体（如HTML文件）。

          6. 接收HTTP响应
          接收数据：浏览器接收服务器返回的HTTP响应。

          解析响应：浏览器根据响应头中的Content-Type判断资源类型（如HTML、CSS、JS）。

          7. 渲染页面
          解析HTML：浏览器解析HTML文件，构建DOM树。

          加载资源：如果HTML中包含外部资源（如CSS、JS、图片），浏览器会发起额外的HTTP请求来加载这些资源。

          解析CSS：浏览器解析CSS文件，构建CSSOM树。

          构建渲染树：将DOM树和CSSOM树合并为渲染树。

          布局（Layout）：计算每个节点的几何信息（位置、大小）。

          绘制（Paint）：将渲染树转换为像素，绘制到屏幕上。

          合成（Composite）：将多个图层合成为最终页面。

          8. 执行JavaScript
          解析JS：如果页面中包含JavaScript，浏览器会解析并执行JS代码。

          动态更新：JS可能会修改DOM或CSSOM，触发重新布局和绘制。

          9. 页面加载完成
          触发事件：当页面完全加载后，浏览器会触发DOMContentLoaded和load事件。

          交互：用户可以开始与页面交互。
        </div>
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">src和href的区别</div>
      <div class="content">
        <div>
          缺点：

          iframe 会阻塞主页面的 onload 事件
          无法被一些搜索引擎索识别
          会产生很多页面，不容易管理
        </div>
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">浏览器乱码</div>
      <div class="content">
        <div>
        </div>
      </div>
    </div>
    <div class="card-box p-5 mt-5">
      <div class="title">doctype</div>
      <div class="content">
        <div>
        </div>
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