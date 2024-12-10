<script setup>
// import { User, Lock } from '@element-plus/icons-vue'
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// const isRegister = ref(true)
// import { ElForm, ElFormItem, ElInput, ElButton } from 'element-ui';
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCodeService,userEmailService } from '../../api/modules/user'
import { useUserInfoStore } from '@/stores/index.js'
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
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { min: 0, max: 0, message: '邮箱不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      min: 0, max: 0,
      message: '验证码不能为空',
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

//验证码按钮
const startCountdown = () => {
  if (countdown.value > 0) {
    captchaDisabled.value = true
    captchaButtonText.value = `${countdown.value}秒后再次获取`
    countdown.value--
    setTimeout(() => {
      startCountdown();
    }, 1000);
  } else {
    countdown.value = 60
    disabled.value = false
    ButtonText.value = '发送验证码'
  }
}

const captch = async() =>{
  const res = await getCodeService(formModel.value.email)
  if(res.code===1){
    alert('验证码发送成功！')
    startCountdown()
  }

}

const login = async () => {
  await form.value.validate()
  await userEmailService(formModel.value.email,formModel.value.password)
  const userStore = useUserInfoStore()
  userStore.setUserInfo(UserLogin.data)
  ElMessage.success('登录成功')
  router.push('/layout/home')
}

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
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入验证码"

        ></el-input>
      </el-form-item>
      <el-form-item prop="newpassword">
        <el-input
            v-model="formModel.password"
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
