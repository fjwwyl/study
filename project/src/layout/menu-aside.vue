<template>
  <el-menu
      :default-active="defaultActive"
      text-color="#ffffff"
      background-color="#545c64"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
  >
    <div v-for="menu in menus" :key="menu.name" class="menu">
      <el-sub-menu v-if="menu.children" :index="menu.index">
        <template #title>
          <div>{{ menu.title }}</div>
        </template>
        <el-menu-item v-for="child in menu.children" :index="child.index">{{ child.title }}</el-menu-item>
      </el-sub-menu>
      <el-menu-item :index="menu.index" v-else>
        <div>{{ menu.title }}</div>
      </el-menu-item>
    </div>
  </el-menu>
</template>
<script lang="ts" setup>
import menuRoutes from "@/router/routes"
import {get} from "lodash"
import {computed, ref, reactive, watch, nextTick} from "vue"
import {changeMenuIndex} from "../utils/global";
import {useMenuStore} from "../stores/menus"

const menuStore = useMenuStore();


interface menu {
  path: string
  name: string
  index: string
  title: string
  children: menu[]
}

const menuExportRoot = menuRoutes[0].children;
const menus: menu[] = changeMenuIndex(menuExportRoot, undefined);
const index: string = <string>get(menus, "0.index", "");
const defaultActive = ref<string>(<string>get(menus, "0.index", ""));//获取第一个
menuStore.changeMenu(menus);
nextTick(() => {
  menuStore.changeActiveMenu([defaultActive.value]);// 设置默认菜单
})
const handleOpen = (key: string, keyPath: string[]) => {
}
const handleClose = (key: string, keyPath: string[]) => {
}
const handleSelect = (key: string, keyPath: string[]) => {
  menuStore.changeActiveMenu(keyPath);
}

</script>

<style scoped lang="less">

.menu {
  line-height: 50px;
  padding-left: 20px;
  font-size: 18px;
}
</style>