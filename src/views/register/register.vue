<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { userRegisterService } from '../../api/modules/user'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";

const router = useRouter()
const formModel = ref({
  username: '',
  password: '',
})
/**
 * 注册规则
 * @type {{password: [{trigger: string, message: string, required: boolean},{pattern: RegExp, trigger: string, message: string}], username: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}]}}
 */
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'blur' }
  ]
}

/**
 * 是否禁用按钮
 * @type {ComputedRef<unknown>}
 */
const isButtonDisabled = computed(() => {
  return !formModel.value.username || !formModel.value.password
})

/**
 * 按钮样式
 * @type {ComputedRef<{backgroundColor: string, borderColor: string, margin: string, color: string}>}
 */
const buttonStyle = computed(() => ({
  color: 'white',
  backgroundColor: isButtonDisabled.value ? '#cbcaca' : '#409EFF',
  borderColor: isButtonDisabled.value ? '#cbcaca' : '#409EFF',
  margin: 'auto',
}))

/**
 * 注册接口
 * @returns {Promise<void>}
 */
const register = async () => {
  try {
    await userRegisterService(formModel.value.username, formModel.value.password)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (error) {
    console.error(error)
    ElMessage.error("账号已存在，请重新输入")
  }
}
</script>

<template>
  <div class="bgc">
    <div class="bg"></div>
    <el-form
      :model="formModel"
      :rules="rules"
      size="large"
      autocomplete="off"
      class="form"
    >
      <el-form-item>
        <div class="title">注册</div>
      </el-form-item>

      <el-form-item prop="username">
        <el-input
          v-model="formModel.username"
          :prefix-icon="User"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="formModel.password"
          :prefix-icon="Lock"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="register"
          class="button"
          :type="isButtonDisabled ? 'default' : 'primary'"
          :style="buttonStyle"
          :disabled="isButtonDisabled"
        >
          注册
        </el-button>
      </el-form-item>

      <el-form-item class="flex">
        <el-link type="info" :underline="false">
          <router-link to="/login" style="text-decoration: none">登录</router-link>
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
  padding-top: 160px;
  display: flex;
}

.bg {
  width: 900px;
  height: 520px;
  background: url('../pic/微信图片_20241015002509.jpg') no-repeat center center;
  padding-top: 100px;
  background-size: cover;
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

  .button {
    width: 100px;
  }

  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin: 0 auto;
  }
}
</style>
