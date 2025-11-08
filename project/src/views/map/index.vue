<template>
  <div class="info">最新版GL地图命名空间为BMapGL, 可按住鼠标右键控制地图旋转、修改倾斜角度。</div>
  <div id="container"></div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue"

onMounted(() => {
  var map = new BMapGL.Map('container'); // 创建Map实例
  var point = new BMapGL.Point(116.404, 39.915);  // 创建点坐标
  map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
})
</script>
<style>
#container {
  overflow: hidden;
  width: 100%;
  height: 500px;
  margin: 0;
  font-family: "微软雅黑";
}
</style>