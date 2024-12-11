<script setup>

import {Lock, Message} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCodeService,userEmailService } from '../../api/modules/user'
import { useUserInfoStore } from '@/stores/index.js'
import {ElMessage} from "element-plus";
const userStore = useUserInfoStore()
const router = useRouter()
const form =ref(null)
const formModel = ref({
  captchword: '',
  newpassword: '' ,
  email: ''
})
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { min: 0, max: 0, message: '邮箱不能为空', trigger: 'blur' }
  ],
  captchword: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '验证码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  newpassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
  ]
}

//发送验证码
const countdown = ref(30);
const disabled = ref(false);
const ButtonText = ref('发送验证码')

/**
 * 倒计时函数
 */
const startCountdown = () => { // 开始倒计时
  const countdownTimer = () => { // 倒计时函数
    if (countdown.value > 0) {
      ButtonText.value = `${countdown.value}秒后再次获取`;
      countdown.value--;
      disabled.value = true;
      setTimeout(countdownTimer, 1000);
    } else {
      countdown.value = 30; // 重置倒计时为60秒
      disabled.value = false; // 启用按钮
      ButtonText.value = '发送验证码'; // 重置按钮文本
    }
  }
  countdownTimer();
}

/**
 * 发送验证码的函数
 * @returns {Promise<void>}
 */
const captch = async () => { // 发送验证码的函数
  console.log(formModel.value.email)
  await getCodeService(formModel.value.email)
  startCountdown()
  alert('验证码发送成功！')
}

/**
 * 登录处理函数
 * @returns {Promise<void>}
 */
const login = async () => { // 登录处理函数
  const res = await userEmailService(formModel.value.email, formModel.value.password)
  userStore.setUserInfo(res.data)
  ElMessage.success('登录成功')
  router.push('/layout/home') // 登录成功后重定向
}

/**
 * 是否禁用按钮
 * @type {ComputedRef<unknown>}
 */
const isButtonDisabled = computed(() => {
  return !formModel.value.email || !formModel.value.password
})

/**
 * 控制登录按钮颜色
 * @type {ComputedRef<unknown>}
 */
const isLoginButtonActive = computed(() => formModel.value.email !== '' && formModel.value.password !== '');


</script>

<template>
  <div class="bgc">
    <div class="bg"></div>
    <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        class="form"
    >
      <el-form-item class="item">
        <div class="title"></div>
      </el-form-item>
      <el-form-item prop="email" style="display: flex" class="item">
        <el-input
            v-model="formModel.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱"
            class="input"
        ></el-input>
        <el-button
            class="button"
            @click="captch"
        >{{ ButtonText }}</el-button>
      </el-form-item>

      <el-form-item prop="captchword">
        <el-input
            v-model="formModel.captchword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入验证码"

        ></el-input>
      </el-form-item>
      <el-form-item prop="newpassword">
        <el-input
            v-model="formModel.newpassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入新密码"

        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            class="button"
            @click="login"
            type="primary"
            style="color: white;
             background-color: #cbcaca;
             border-color: #cbcaca;
             margin: auto;
             "
            :style="{backgroundColor: isLoginButtonActive ? '#409eff' : '#cbcaca'}"
            :disabled="isButtonDisabled"
        >登录</el-button
        >
      </el-form-item>
      <el-form-item class="flex">
        <el-link type="info" :underline="false">
          <router-link to="/login" style="text-decoration: none"
                       @focus.prevent @mousedown.prevent>返回</router-link>
        </el-link>
      </el-form-item>

    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.bgc{
  margin: 0 auto;
  width: 1300px;
  height: 800px;
  background: none;
  padding-top:160px ;
  display: flex;
}
.bg {
  width: 900px;
  height: 520px;
  background: url('../pic/微信图片_20241015002509.jpg')  no-repeat center center;
  padding-top: 100px;
  background-size: cover;
  box-sizing: border-box;
  border-radius: 20px 0 0 20px;
}
.form {
  width: 400px;
  height: 520px;
  background-color:#fdfcf7;
  margin:  0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius:  0 20px 20px 0;
  .item{
    display: flex;
  }
  .title {
    margin: 0 auto;
  }
  .button {
    width: 100px;
    display: flex;

  }
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .input{
    width: 300px;
  }
 .title{
 text-align: center;
   font-weight: bold;
   font-size: 32px;
 }
}
</style>
