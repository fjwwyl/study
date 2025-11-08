<template>
  <!-- 默认插槽允许自定义渲染 -->
  <slot v-if="$slots.default" :text="text" :value="value"/>
  <span v-else>{{ text }}</span>
</template>

<script setup>
import {computed} from "vue"
import {useDictionaryStore} from "../../stores/dictionary";

const dictionaryStore = useDictionaryStore();
dictionaryStore.register();
const {getDictionary} = dictionaryStore;
const props = defineProps({
  // 需要转译的值
  value: {
    type: [String, Number, Boolean, Array],
    required: true
  },
  // 字典数据（数组、对象或返回字典的函数）
  dictData: {
    type: [Array, Object, Function],
    default: null
  },
  // 字典名称（用于全局字典）
  dictName: {
    type: String,
    default: ''
  },
  // 未匹配时的默认显示
  defaultText: {
    type: String,
    default: '-'
  },
  // 多值分隔符
  separator: {
    type: String,
    default: ', '
  },
  // 是否返回原始值当找不到匹配时
  returnOriginalWhenMissing: {
    type: Boolean,
    default: false
  }
})

const getDictData = () => {
  return getDictionary(props.dictName);
}

const text = computed(() => {
  const dict = getDictData();
  if (!dict) return props.defaultText

  debugger
  if (Array.isArray(props.value)) {
    return translateMultiple(dict, props.value)
  }
  return translateSingle(dict, props.value)
})
// 单值转译
function translateSingle(dict, value) {
  // 处理数组形式的字典 [{value: '1', label: '男'}, ...]
  if (Array.isArray(dict)) {
    const item = dict.find(item => item.value === value || item.value == value)
    return item ? item.label : (props.returnOriginalWhenMissing ? value : props.defaultText)
  }
  // 处理对象形式的字典 { '1': '男', '2': '女' }
  else if (typeof dict === 'object' && dict !== null) {
    return dict[value] ?? (props.returnOriginalWhenMissing ? value : props.defaultText)
  }
  return props.returnOriginalWhenMissing ? value : props.defaultText
}

// 多值转译
function translateMultiple(dict, values) {
  const texts = values.map(value => translateSingle(dict, value))
  const validTexts = texts.filter(t => t !== props.defaultText)
  return validTexts.length > 0 ? validTexts.join(props.separator) : props.defaultText
}


</script>
<style scoped>

</style>