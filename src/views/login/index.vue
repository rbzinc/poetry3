<script setup>
import { ref, computed } from 'vue'
import LoginPage from './login/index.vue'
import RegisterPage from './register/index.vue'
import ForgetPage from './forget/index.vue'
import EmailPage from './email/index.vue'

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
    <!-- 动态粒子背景 -->
    <div class="particles-background"></div>
    
    <div class="login-box">
      <!-- 左侧诗词文化展示区 -->
      <div class="culture-showcase">
        <div class="showcase-content">
          <div class="poetry-section">
            <div class="poetry-item active">
              <h3 class="poetry-title">诗意人生</h3>
              <p class="poetry-text">"腹有诗书气自华，读书万卷始通神"</p>
              <div class="poetry-author">— 苏轼</div>
            </div>
            <div class="poetry-item">
              <h3 class="poetry-title">文化传承</h3>
              <p class="poetry-text">"欲穷千里目，更上一层楼"</p>
              <div class="poetry-author">— 王之涣</div>
            </div>
            <div class="poetry-item">
              <h3 class="poetry-title">学而时习</h3>
              <p class="poetry-text">"学而时习之，不亦说乎"</p>
              <div class="poetry-author">— 孔子</div>
            </div>
          </div>
          
          <div class="platform-features">
            <div class="feature-item">
              <div class="feature-icon">🤖</div>
              <div class="feature-text">AI智能对话</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🎮</div>
              <div class="feature-text">游戏化学习</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🗺️</div>
              <div class="feature-text">诗意之旅</div>
            </div>
          </div>
        </div>
        
        <!-- 装饰元素 -->
        <div class="decorative-elements">
          <div class="floating-element element-1"></div>
          <div class="floating-element element-2"></div>
          <div class="floating-element element-3"></div>
        </div>
      </div>
      
      <!-- 右侧表单区域 -->
      <div class="form-container">
        <div class="form-wrapper">
          <transition :name="transitionName" mode="out-in">
            <component :is="currentComponent" @changePage="changePage" />
          </transition>
        </div>
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
  position: relative;
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
  overflow: hidden;

  // 动态粒子背景
  .particles-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(231, 76, 60, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(243, 156, 18, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(52, 152, 219, 0.1) 0%, transparent 50%);
    animation: particlesMove 20s ease-in-out infinite;
  }

  .login-box {
    display: flex;
    width: 1200px;
    height: 650px;
    border-radius: 24px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;
  }

  // 左侧诗词文化展示区
  .culture-showcase {
    flex: 1.2;
    background: linear-gradient(135deg, #2C3E50 0%, #3498DB 100%);
    position: relative;
    padding: 60px 50px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .showcase-content {
      position: relative;
      z-index: 2;
    }

    .poetry-section {
      margin-bottom: 60px;

      .poetry-item {
        opacity: 0.6;
        transition: all 0.8s ease;
        margin-bottom: 40px;
        transform: translateY(20px);

        &.active {
          opacity: 1;
          transform: translateY(0);
        }

        .poetry-title {
          color: #F39C12;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          font-family: 'STKaiti', '楷体', serif;
        }

        .poetry-text {
          color: white;
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 12px;
          font-family: 'STKaiti', '楷体', serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .poetry-author {
          color: #BDC3C7;
          font-size: 14px;
          font-style: italic;
        }
      }
    }

    .platform-features {
      display: flex;
      justify-content: space-between;
      gap: 20px;

      .feature-item {
        text-align: center;
        color: white;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .feature-text {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    // 装饰元素
    .decorative-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .floating-element {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 6s ease-in-out infinite;

        &.element-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          right: 15%;
          animation-delay: 0s;
        }

        &.element-2 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 10%;
          animation-delay: 2s;
        }

        &.element-3 {
          width: 40px;
          height: 40px;
          top: 60%;
          right: 25%;
          animation-delay: 4s;
        }
      }
    }
  }

  // 右侧表单区域
  .form-container {
    flex: 1;
    background: white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;

    .form-wrapper {
      max-width: 400px;
    }
  }
}

// 动画定义
@keyframes particlesMove {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// 过渡动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateX(30px) scale(0.95);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px) scale(0.95);
  opacity: 0;
}
</style>
