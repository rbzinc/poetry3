<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { userLoginService } from '@/api/modules/user'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/index.js'
import { ElMessage } from 'element-plus'
import { goHome } from '@/router/helpers.js'
const useUser = useUserInfoStore()
const router = useRouter()
const form = ref(null)
const formModel = ref({
  username: '',
  password: '',
})

/**
 * 登录规则
 * @type {{password: [{trigger: string, message: string, required: boolean},{pattern: RegExp, trigger: string, message: string}], username: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}]}}
 */
const rules = {
  username: [
    { required: true, message: '请输入用户名或者邮箱', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur',
    },
  ],
}

/**
 * 登录接口
 * @returns {Promise<void>}
 */
const login = async () => {
  if (!isLoginButtonActive.value) {
    ElMessage.warning('请填写完整的登录信息')
    return
  }
  try {
    const { data } = await userLoginService(formModel.value.username, formModel.value.password)
    useUser.setUserInfo(data)
    ElMessage.success('登录成功')
    await goHome()
  } catch (error) {
    console.error(error) // 打印错误信息以方便调试
    ElMessage.error('用户名或密码错误')
  }
}

/**
 * 控制登录按钮颜色
 * @type {ComputedRef<unknown>}
 */
const isLoginButtonActive = computed(() => formModel.value.username !== '' && formModel.value.password !== '')

/**
 * 控制登录按钮是否禁用
 * @type {ComputedRef<unknown>}
 */
const isButtonDisabled = computed(() => {
  return !formModel.value.username || !formModel.value.password
})
const emit = defineEmits(['changePage'])
const changePage = (event) => {
  emit('changePage', event)
}
</script>

<template>
  <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" class="form">
    <el-form-item>
      <div class="title">登录</div>
    </el-form-item>
    <el-form-item prop="username">
      <el-input v-model="formModel.username" name="username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="formModel.password"
        name="password"
        :prefix-icon="Lock"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        @click="login"
        class="button"
        type="primary"
        :style="{
          backgroundColor: isLoginButtonActive ? 'skyblue' : '#cbcaca',
          borderColor: isLoginButtonActive ? 'skyblue' : '#cbcaca',
        }"
        style="margin: auto"
        :disabled="isButtonDisabled"
      >
        登录
      </el-button>
    </el-form-item>

    <div class="flex">
      <div class="flex">
        <p class="flex-item" @click="changePage(2)" style="margin-right: 20px">邮箱登录</p>
        <p class="flex-item" @click="changePage(3)">注册</p>
      </div>
      <p class="flex-item" @click="changePage(4)">忘记密码</p>
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
.form {
  width: 400px;
  height: 520px;
  background-color: #fdfcf7;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 0 20px 20px 0;
  .title {
    margin: 0 auto;
  }

  .button {
    width: 100px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    .flex-item {
      cursor: pointer;
    }
  }
}

.title {
  text-align: center;
  font-weight: bold;
  font-size: 32px;
}
</style>
