<script setup>
// import { User, Lock } from '@element-plus/icons-vue'
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// const isRegister = ref(true)
// import { ElForm, ElFormItem, ElInput, ElButton } from 'element-ui';
import { User, Lock,Message } from '@element-plus/icons-vue'
import { userLoginService } from '../../api/modules/user'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '../../stores/modules/user.js'
const useUser = useUserInfoStore()
const router = useRouter()
const form =ref(null)
const entry = ref(false)
const formModel = ref({
  name: '',
  password: '' ,
  email: ''
})
const rules = {
  username: [
    { required: true, message: '请输入用户名或者邮箱', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    },
  ]
}

const login = async () => {
  console.log(formModel.value.name,formModel.value.password)
  const UserLogin = await userLoginService(formModel.value.name,formModel.value.password)
  console.log(UserLogin)
  const userStore = useUserInfoStore()
  userStore.setUserInfo(UserLogin.data)
  ElMessage.success('登录成功')
  router.push('/layout/home')
}

watch(formModel,()=>{
  console.log(formModel)
})
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
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.name"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
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
            auto-insert-space
            style="color: white; background-color: #cbcaca; border-color: #cbcaca;"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false">
            <router-link to="/register" style="text-decoration: none">注册&nbsp&nbsp&nbsp&nbsp</router-link>
          </el-link>
          <el-link type="info" :underline="false">
            <router-link to="/email" style="text-decoration: none">邮箱登录</router-link>
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
    padding-top: 160px;
    display: flex;
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
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100px;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
  
</style>