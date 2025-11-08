<template>
  <div class="scene">
    <div class=" operation">
      <el-button type="primary" @click="createScene">新建</el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="scene in sceneData" :key="scene.id" :name="scene.id">
        <template #title="{ isActive }">
          <span style="margin-right: 50px;">{{ scene.title }}</span>
          <el-button type="primary" @click="changeScene(scene)">修改</el-button>
          <el-button type="danger" @click="deleteScene(scene)">删除</el-button>
        </template>
        <div style="white-space: pre-line;">
          {{ scene.content }}
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog
        v-model="dialogVisible"
        :title="isEdit?'编辑场景题':'新建场景题'"
        width="618"
        :before-close="handleClose">
      <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
        <el-form-item label="题目" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="答案" prop="content">
          <el-input v-model="form.content" :autosize="{ minRows: 10, maxRows:15 }" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogConfirm(formRef)" type="primary">确认</el-button>
          <el-button @click="dialogCancel">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import sceneData from "./scene.json"
import {ref, reactive, toRaw} from 'vue'
import type {FormRules} from 'element-plus'

import type {CollapseModelValue} from 'element-plus'

const dialogVisible: boolean = ref(false);
const activeNames: string = ref(sceneData.map(m => m.id));

interface formType {
  title: string,
  id: string,
  content: string,
}

const form = reactive<formType>({
  title: '',
  id: '',
  content: '',
})
const isEdit = ref(false)
const editId = ref("");
let fileHandle: any = null;

const formRef = ref<FormInstance>()
const ruleForm = reactive<formType>({
  title: '',
  id: '',
  content: '',
})

const locationOptions = ['Home', 'Company', 'School']

const rules = reactive<FormRules<formType>>({
  title: [
    {required: true, message: '必填', trigger: 'blur'},
  ],
  content: [
    {required: true, message: '必填', trigger: 'blur'},
  ],
})

const handleChange = (val: CollapseModelValue) => {

}
const createScene = () => {
  dialogVisible.value = true;
  isEdit.value = false;
}

const handleClose = () => {
  isEdit.value = false;
}

const changeScene = (scene: formType) => {
  event.stopPropagation(); // 阻止事件冒泡
  dialogVisible.value = true;
  isEdit.value = true;
  editId.value = scene.id;
  form.content = toRaw(scene.content);
  form.title = toRaw(scene.title)
  form.id = toRaw(scene.id)
}
const deleteScene = async (scene: formType) => {
  event.stopPropagation(); // 阻止事件冒泡
  const json = sceneData.filter(f => f.id !== scene.id);
  await handleJSON(json);
}


const handleJSON = async (data: formType[]) => {
  try {
    [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'JSON',
        accept: {'application/json': ['.json']}
      }],
      multiple: false
    })
    // 创建可写流
    const writable = await fileHandle.createWritable()
    await writable.write(JSON.stringify(data, null, 2))
    await writable.close()
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('错误:', err)
    }
  }
}


const dialogConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const json: formType[] = isEdit.value ? sceneData.map(m => ({
        id: m.id,
        title: m.id === editId.value ? form.title : m.title,
        content: m.id === editId.value ? form.content : m.content,
      })) : sceneData.concat([toRaw({
        title: form.title,
        id: new Date().getTime(),
        content: form.content,
      })]);
      console.log(json);
      await handleJSON(json);
      dialogVisible.value = false;
    } else {
      console.log('error submit!', fields)
    }
  })
}

const dialogCancel = () => {
  dialogVisible.value = false;
}
</script>
<style lang="less">
.scene {
  padding: 20px;

  .el-collapse-item__header {
    font-size: 30px;
  }

  .el-collapse-item__wrap {
    .el-collapse-item__content {
      font-size: 20px;
    }
  }


  .operation {
    margin-bottom: 20px;
  }
}
</style>