import {ref, computed} from 'vue'
import {defineStore} from 'pinia'

export const useMenuStore = defineStore('selectMenu', {
  state: () => ({
    // 包括父节点在内的数组
    menus: [],
    activeMenus: []
  }),
  getters: {},
  actions: {
    changeActiveMenu(activeMenus: string[]) {
      this.activeMenus = activeMenus;
    },
    changeMenu(menus: string[]) {
      this.menus = menus;
    }
  }
})
