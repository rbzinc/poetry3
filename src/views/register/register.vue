<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { userRegisterService, getCodeService } from '../../api/modules/user'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const form =ref(null)
const formModel = ref({
  username: '',
  password: '',
})
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { min: 0, max: 0, message: '邮箱不能为空', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  captchword: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '验证码必须是 6-15位 的非空字符',
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
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功,也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

//发送验证码
const countdown = ref(60);
const disabled = ref(false);
const ButtonText = ref('发送验证码')
//验证码按钮
const startCountdown = () => {
  if (countdown.value > 0) {
    captchaDisabled.value = true;
    captchaButtonText.value = `${countdown.value}秒后再次获取`;
    countdown.value--;
    setTimeout(() => {
      startCountdown();
    }, 1000);
  } else {
    countdown.value = 60;
    disabled.value = false;
    ButtonText.value = '发送验证码';
  }
}

const captch = async() =>{
  const res = await getCodeService()
  startCountdown()
  alert('验证码发送成功！')
}

const register = async () => {
  // await form.value.validator()
  await userRegisterService(formModel.value)
  alert('注册成功')
  router.push('/login')
}


</script>

<template>
  <div class="bgc">
    <div class="bg"></div>
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        class="form"
      >
        <el-form-item>
          <div class="title">注册</div>
        </el-form-item>
        <!-- <el-form-item prop="email" style="display: flex" class="item">
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
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入验证码"
            
          ></el-input>
        </el-form-item> -->
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item prop="name">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item> -->
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
            type="primary"
            auto-insert-space
            style="color: white; background-color: #cbcaca; border-color: #cbcaca;margin: auto;"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" >
            <router-link to="/login" style="text-decoration: none">登录</router-link>
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
    .button {
      width: 100px;
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
      margin: 0 auto;
    }
  }
  

</style>

