<template>
  <div class="header">
    <div class="nav">
      <el-icon size="24px" color="#ffffff" style="display: block;top:18px;">
        <Operation/>
      </el-icon>
      <div class="title">
        {{ nav }}
      </div>
    </div>
    <div class="user-card">
      <span>{{ user.id }}</span>

      <el-popover
          placement="bottom"
          width="200"
          trigger="hover">
        <div>
          <div>{{ user.id }}</div>
          <el-button @click="logout">退出登录</el-button>
        </div>
        <template #reference>
          <el-icon slot="reference" size="48px" color="#ffffff" style="display: block;top:6px;">
            <UserFilled/>
          </el-icon>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>

import {computed, ref, reactive, watch} from "vue"
import {useMenuStore} from "../stores/menus"
import {getMenuTitle} from "../utils/global";
import {auth} from "../utils/auth";
import {useRouter} from "vue-router";

const router = useRouter();

interface menu {
  key: string[],
  name: string[]
}

interface user {
  id: string;
  roles: string[]
}

const user = reactive<user>(auth.currentUser);

const menus = reactive<menu>({key: [], name: []});

const menuStore = useMenuStore();
menuStore.$subscribe((mutation, state) => {
  const newValue: string[] = state.activeMenus;
  menus.key = newValue;
  menus.name = getMenuTitle(menuStore.menus, menus.key);
})

const nav = computed(() => {
  return menus.name.reduce((prev, cur, index) => {
    if (index === 0) return cur;
    else return prev + "/" + cur;
  }, "")
})

const logout = () => {
  router.push({path: "/"});
  auth.clearCurrentUser();
}
</script>

<style scoped lang="less">

.header {
  height: 60px;
  line-height: 60px;
  background-color: #202329;
  padding: 0 20px;
  display: flex;
  color: #ffffff;
  align-content: center;
  justify-content: space-between;

  .nav {
    display: flex;

    .title {
      padding-left: 20px;
    }
  }

  .user-card {
    display: flex;
    width: 100px;

    span {
      padding-right: 20px;
    }
  }
}
</style>