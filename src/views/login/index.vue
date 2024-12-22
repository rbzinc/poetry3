<script setup>
import LoginPage from "./login/index.vue"
import RegisterPage from "./register/index.vue"
import ForgetPage from "./forget/index.vue"
import EmailPage from "./email/index.vue"
const basicPage = ref(1)
const changePage = (page) => {
  basicPage.value = page
}


</script>
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="bg"></div>
      <LoginPage v-if="basicPage === 1" @changePage="changePage"/>
      <email-page v-if="basicPage === 2" @changePage="changePage"/>
      <register-page v-if="basicPage === 3" @changePage="changePage"/>
      <forget-page v-if="basicPage === 4" @changePage="changePage"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  .login-box {
    display: flex;
    width: 1160px;
    height: 500px;
    border-radius: 20px;
    overflow: hidden;
  }

  .bg {
    flex: 1.5;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("../../assets/pic/login/login-bg.jpg");
  }
}

</style>
