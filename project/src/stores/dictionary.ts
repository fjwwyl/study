import {defineStore} from 'pinia'
import dictionaryGlobal from "../utils/dictionary"


export const useDictionaryStore = defineStore('dictionary', {
  state: () => ({}),
  getters: {
    getDictionary: (state) => {
      return (name) => state[name];
    }
  },
  actions: {
    // 注册字典
    register() {
      for (let key in dictionaryGlobal) {
        this[key] = dictionaryGlobal[key];
      }
    },
  }
})
