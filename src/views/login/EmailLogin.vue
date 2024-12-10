<script setup>

import {Lock, Message} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {getCodeService, userEmailService} from '../../api/modules/user'
import {useUserInfoStore} from '@/stores/index.js'
import {ElMessage} from "element-plus";

const userStore = useUserInfoStore() // 获取用户信息状态管理
const router = useRouter() // 获取路由对象
const form = ref(null) // 表单引用
const countdown = ref(30); // 倒计时设置为30秒
const disabled = ref(false); // 按钮禁用状态
const ButtonText = ref('发送验证码') // 按钮文本

const formModel = ref({
  password: '',
  email: ''
})

/**
 * 表单验证规则
 * @type {{password: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}], email: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}]}}
 */
const rules = {
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {min: 8, max: 30, message: '邮箱不能为空', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    {
      min: 2, max: 10,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
}


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
      <el-form-item>
        <div class="title">邮箱登录</div>
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
            :disabled="disabled"
        >{{ ButtonText }}
        </el-button>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入验证码"

        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            style="color: white; border-color: #cbcaca;margin: auto;"
            :style="{ backgroundColor: isLoginButtonActive ? 'skyblue' : '#cbcaca', borderColor: isLoginButtonActive ? 'skyblue' : '#cbcaca' }"
            :disabled="isButtonDisabled"
        >登录
        </el-button
        >
      </el-form-item>
      <el-form-item class="flex">
        <el-link type="info" :underline="false">
          <router-link to="/login" style="text-decoration: none"
                       @focus.prevent @mousedown.prevent>返回
          </router-link>
        </el-link>
      </el-form-item>

    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.bgc {
  margin: 0 auto;
  width: 1300px;
  height: 800px;
  background: none;
  padding-top: 160px;
  display: flex;
}

.bg {
  width: 900px;
  height: 520px;
  background: url('../pic/微信图片_20241015002509.jpg') no-repeat center center;
  padding-top: 100px;
  background-size: cover;
  box-sizing: border-box;
  border-radius: 20px 0 0 20px;
}

.form {
  width: 400px;
  height: 520px;
  background-color: #fdfcf7;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 0 20px 20px 0;

  .item {
    display: flex;
  }

  .button {
    width: 100px;
  }

  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .input {
    width: 300px;
  }

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin: 0 auto;
  }
}

</style>

