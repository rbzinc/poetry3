<script setup>
import { ref, computed } from 'vue'
import LoginPage from './login/index.vue'
import RegisterPage from './register/index.vue'
import ForgetPage from './forget/index.vue'
import EmailPage from './email/index.vue'
import { LOGIN_BG } from '@/constants/bgUrl.js'

const basicPage = ref(1)
const changePage = (page) => {
  basicPage.value = page
}

// 添加页面切换动画控制
const transitionName = ref('slide-fade')

// 使用计算属性动态确定当前组件
const currentComponent = computed(() => {
  switch (basicPage.value) {
    case 1:
      return LoginPage
    case 2:
      return EmailPage
    case 3:
      return RegisterPage
    case 4:
      return ForgetPage
    default:
      return LoginPage
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="bg" :style="{ backgroundImage: `url(${LOGIN_BG})` }"></div>
      <div class="form-container">
        <transition :name="transitionName" mode="out-in">
          <component :is="currentComponent" @changePage="changePage" />
        </transition>
      </div>
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .bg {
    flex: 1.5;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      .welcome-text {
        color: white;
        text-align: center;

        h1 {
          font-size: 42px;
          margin-bottom: 16px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        p {
          font-size: 18px;
          opacity: 0.9;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  .form-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
}

// 添加过渡动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
