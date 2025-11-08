<template>
  <div class="layout">
    <div class="layout-left">
      <div class="menu-header">
        通用后台管理
      </div>
      <div class="menu">
        <menuAside></menuAside>
      </div>
    </div>
    <div class="layout-right">
      <div class="layout-header">
        <menuHeader></menuHeader>
      </div>
      <div class="layout-main">
        <RouterView v-slot="{ Component, route }">
          <component :is="Component" :key="route.path"/>
        </RouterView>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import menuAside from "./menu-aside.vue"
import menuHeader from "./menu-header.vue"
import menuRoutes from "@/router/routes"
import {get, last} from "lodash"
import {computed, ref, reactive, watch, nextTick} from "vue"
import {changeMenuIndex, getMenuName} from "../utils/global";
import {useMenuStore} from "../stores/menus"

import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()

let name: string[] = ref([]);

const menuStore = useMenuStore();


menuStore.$subscribe((mutation, state) => {
  const newValue: string[] = state.activeMenus;
  name = getMenuName(menuStore.menus, newValue);
  router.push({name: last(name)})
})
</script>
<style scoped lang="less">

.layout {
  display: flex;

  height: 100%;

  .layout-left {
    flex-basis: 200px;

    background: #545C65;
    color: #ffffff;

    .menu-header {
      height: 60px;
      font-weight: 600;
      padding-left: 20px;
      line-height: 60px;
      font-size: 24px;
    }
  }

  .layout-right {
    flex: 1;

    .layout-main {
      height: calc(100% - 60px);
      overflow: auto;
    }
  }
}
</style>