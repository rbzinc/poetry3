<script setup>
import { Lock, Message } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { getCodeService, userEmailService } from '@/api/modules/user'
import { useUserInfoStore } from '@/stores/index.js'
import { ElMessage } from 'element-plus'
import { goHome } from '@/router/helpers.js'
const userStore = useUserInfoStore() // 获取用户信息状态管理
const form = ref(null) // 表单引用
const countdown = ref(30) // 倒计时设置为30秒
const disabled = ref(false) // 按钮禁用状态
const ButtonText = ref('发送验证码') // 按钮文本

const formModel = ref({
  password: '',
  email: '',
})

/**
 * 表单验证规则
 * @type {{password: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}], email: [{trigger: string, message: string, required: boolean},{min: number, max: number, trigger: string, message: string}]}}
 */
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      min: 4,
      max: 10,
      message: '验证码长度不正确',
      trigger: 'blur',
    },
  ],
}

/**
 * 倒计时函数
 */
const startCountdown = () => {
  // 开始倒计时
  const countdownTimer = () => {
    // 倒计时函数
    if (countdown.value > 0) {
      ButtonText.value = `${countdown.value}秒后再次获取`
      countdown.value--
      disabled.value = true
      setTimeout(countdownTimer, 1000)
    } else {
      countdown.value = 30 // 重置倒计时为30秒
      disabled.value = false // 启用按钮
      ButtonText.value = '发送验证码' // 重置按钮文本
    }
  }
  countdownTimer()
}

/**
 * 发送验证码的函数
 * @returns {Promise<void>}
 */
const captch = async () => {
  // 发送验证码的函数
  console.log(formModel.value.email)
  await getCodeService(formModel.value.email)
  startCountdown()
  alert('验证码发送成功！')
}

/**
 * 登录处理函数
 * @returns {Promise<void>}
 */
const login = async () => {
  // 登录处理函数
  const res = await userEmailService(formModel.value.email, formModel.value.password)
  userStore.setUserInfo(res.data)
  ElMessage.success('登录成功')
  await goHome()
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
const isLoginButtonActive = computed(() => formModel.value.email !== '' && formModel.value.password !== '')

const emit = defineEmits(['changePage'])
const changePage = (event) => {
  emit('changePage', event)
}
</script>

<template>
  <div class="modern-form-container">
    <!-- 表单头部 -->
    <div class="form-header">
      <div class="welcome-back">
        <h2 class="form-title">邮箱登录</h2>
        <p class="form-subtitle">使用邮箱验证码快速登录</p>
      </div>
    </div>

    <!-- 表单内容 -->
    <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" class="modern-form">
      <div class="input-group">
        <!-- 邮箱输入和验证码发送 -->
        <el-form-item prop="email" class="floating-label-item email-item">
          <div class="email-input-wrapper">
            <el-input 
              v-model="formModel.email" 
              :prefix-icon="Message" 
              placeholder="请输入邮箱"
              class="modern-input email-input"
            ></el-input>
            <el-button 
              class="verify-btn" 
              @click="captch"
              :disabled="disabled"
              :class="{ 'countdown': disabled }"
            >
              {{ ButtonText }}
            </el-button>
          </div>
          <label class="floating-label">邮箱地址</label>
        </el-form-item>

        <!-- 验证码输入 -->
        <el-form-item prop="password" class="floating-label-item">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入验证码"
            class="modern-input"
          ></el-input>
          <label class="floating-label">验证码</label>
        </el-form-item>
      </div>

      <!-- 邮箱登录提示 -->
      <div class="email-tip">
        <div class="tip-icon">📧</div>
        <div class="tip-text">
          <p>邮箱登录更安全</p>
          <span>验证码将发送至您的邮箱，请注意查收</span>
        </div>
      </div>

      <!-- 登录按钮 -->
      <el-form-item class="button-item">
        <el-button
          @click="login"
          class="modern-email-login-btn"
          type="primary"
          :class="{ 'active': isLoginButtonActive }"
          :disabled="isButtonDisabled"
          size="large"
        >
          <span class="btn-text">邮箱登录</span>
          <div class="btn-loading" v-if="false">
            <i class="el-icon-loading"></i>
          </div>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 底部链接 -->
    <div class="form-footer">
      <div class="auth-links">
        <span class="link-item" @click="changePage(1)">账号登录</span>
        <span class="link-divider">|</span>
        <span class="link-item" @click="changePage(3)">立即注册</span>
        <span class="link-divider">|</span>
        <span class="link-item forgot-link" @click="changePage(4)">忘记密码？</span>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="form-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 24px;

  // 表单头部
  .form-header {
    text-align: center;
    margin-bottom: 40px;

    .welcome-back {
      .form-title {
        font-size: 32px;
        font-weight: 700;
        color: #2C3E50;
        margin-bottom: 8px;
        background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .form-subtitle {
        font-size: 16px;
        color: #7F8C8D;
        margin: 0;
        font-weight: 400;
      }
    }
  }

  // 现代化表单
  .modern-form {
    .input-group {
      margin-bottom: 16px;

      .floating-label-item {
        position: relative;
        margin-bottom: 16px;

        :deep(.el-form-item__content) {
          position: relative;
        }

        // 邮箱输入特殊处理
        &.email-item {
          .email-input-wrapper {
            display: flex;
            gap: 12px;
            align-items: stretch;

            .email-input {
              flex: 1;
            }

            .verify-btn {
              height: 48px;
              border-radius: 12px;
              font-weight: 600;
              border: 2px solid #9B59B6;
              background: white;
              color: #9B59B6;
              transition: all 0.3s ease;
              white-space: nowrap;
              font-size: 13px;

              &:hover:not(:disabled) {
                background: #9B59B6;
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(155, 89, 182, 0.3);
              }

              &.countdown {
                background: #ECF0F1;
                border-color: #BDC3C7;
                color: #7F8C8D;
                cursor: not-allowed;
              }
            }
          }
        }

        .modern-input {
          :deep(.el-input__wrapper) {
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid #E8F4FD;
            border-radius: 12px;
            padding: 12px 16px;
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            height: 48px;

            &:hover {
              border-color: #9B59B6;
              box-shadow: 0 8px 25px rgba(155, 89, 182, 0.15);
            }

            &.is-focus {
              border-color: #8E44AD;
              box-shadow: 0 8px 25px rgba(142, 68, 173, 0.2);
              background: white;
            }
          }

          :deep(.el-input__inner) {
            border: none;
            background: transparent;
            font-size: 14px;
            color: #2C3E50;
            padding-left: 12px;
            box-sizing: border-box;
            &::placeholder {
              color: #BDC3C7;
              font-size: 13px;
            }
          }

          :deep(.el-input__prefix) {
            color: #7F8C8D;
            font-size: 16px;
            box-sizing: border-box;
          }
        }

        .floating-label {
          position: absolute;
          left: 44px;
          top: 50%;
          transform: translateY(-50%);
          color: #7F8C8D;
          font-size: 13px;
          font-weight: 500;
          pointer-events: none;
          transition: all 0.3s ease;
          background: white;
          padding: 0 6px;
          box-sizing: border-box;
          border-radius: 4px;
          opacity: 0;
          z-index: 1;
        }

        &:focus-within .floating-label,
        &.has-value .floating-label {
          top: -2px;
          font-size: 12px;
          color: #9B59B6;
          opacity: 1;
        }
      }
    }

    // 邮箱登录提示
    .email-tip {
      background: rgba(155, 89, 182, 0.1);
      border: 1px solid rgba(155, 89, 182, 0.2);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      align-items: flex-start;

      .tip-icon {
        font-size: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .tip-text {
        flex: 1;

        p {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #2C3E50;
        }

        span {
          color: #7F8C8D;
          font-size: 13px;
          line-height: 1.4;
        }
      }
    }

    // 邮箱登录按钮
    .button-item {
      margin-bottom: 0;

      .modern-email-login-btn {
        width: 100%;
        height: 48px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        border: none;
        background: linear-gradient(135deg, #BDC3C7 0%, #95A5A6 100%);
        color: white;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &.active {
          background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
          box-shadow: 0 8px 25px rgba(155, 89, 182, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(155, 89, 182, 0.4);
          }

          &:active {
            transform: translateY(0);
          }
        }

        &:disabled {
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-text {
          position: relative;
          z-index: 2;
        }

        .btn-loading {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }

        // 按钮波纹效果
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: width 0.6s, height 0.6s;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        &:active::before {
          width: 300px;
          height: 300px;
        }
      }
    }
  }

  // 表单底部
  .form-footer {
    text-align: center;
    margin-top: 20px;

    .auth-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;

      .link-item {
        color: #7F8C8D;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
          color: #9B59B6;
        }

        &.forgot-link {
          color: #E74C3C;

          &:hover {
            color: #C0392B;
          }
        }
      }

      .link-divider {
        color: #BDC3C7;
        font-size: 12px;
      }
    }
  }

  // 装饰元素
  .form-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.05) 100%);
      animation: float 6s ease-in-out infinite;

      &.circle-1 {
        width: 100px;
        height: 100px;
        top: -50px;
        right: -50px;
        animation-delay: 0s;
      }

      &.circle-2 {
        width: 60px;
        height: 60px;
        bottom: -30px;
        left: -30px;
        animation-delay: 3s;
      }
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// 输入框聚焦时的浮动标签效果
.floating-label-item {
  &:focus-within,
  &.has-value {
    .floating-label {
      top: -2px !important;
      font-size: 12px !important;
      color: #9B59B6 !important;
      opacity: 1 !important;
    }
  }
}
</style>
