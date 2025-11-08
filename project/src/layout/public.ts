import {useMenuStore} from "../stores/menus"
import {getMenuName} from "../utils/global";
import {computed, ref, reactive, watch, nextTick} from "vue"

interface menu {
  key: string[],
  name: string[]
}

const menuStore = useMenuStore();
export const setMenus = (state: any) => {
  const menus = reactive<menu>({key: [], name: []});
  const newValue: string[] = state.activeMenus;
  menus.key = newValue;
  menus.name = getMenuName(menuStore.menus, menus.key);
  return menus;
}