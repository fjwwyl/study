<template>
  <div class="login">
    <div class="login_page">
      <div class="login_page-title">账号登录</div>
      <el-form ref="loginRef" :model="formModel" label-width="auto" :rules="rules" style="max-width: 600px">
        <el-form-item prop="username">
          <el-input v-model="formModel.username" placeholder="请输入账号" size="large"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" placeholder="请输入密码" size="large"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="onSubmit(loginRef)" style="width:100%">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue"
import type {FormRules, FormInstance} from 'element-plus'
import {useRouter} from 'vue-router'
import {auth} from "../../utils/auth"

const router = useRouter();
const loginRef = ref<FormInstance>();

interface formRule {
  username: string,
  password: string
}

const formModel = reactive({
  username: "",
  password: ""
})
const onSubmit = async (el: FormInstance | undefined) => {
  if (!el) return;

  await el.validate((valid) => {
    if (valid) {
      console.log(formModel);
      auth.setCurrentUser(formModel.username, [])
      router.push({name: "home"});
    }
  })
}


const rules = reactive<FormRules<formRule>>({
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ]
})
</script>
<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login_page {
  width: 400px;
  padding: 0 40px 20px 40px;
  box-shadow: 0 0 8px 0 rgba(204, 204, 204, 0.5);
  overflow: hidden;
  background-color: #fff;
  text-align: center;
}

.login_page-title {
  font-size: 24px;
  color: #000000;
  letter-spacing: 0;
  margin: 20px 0;
}

::v-deep .el-form-item {
  margin-bottom: 22px;
}
</style>