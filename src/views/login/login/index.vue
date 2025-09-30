<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { userLoginService } from '@/api/modules/user'
import { ref, computed } from 'vue'
import { useUserInfoStore } from '@/stores/index.js'
import { ElMessage } from 'element-plus'
import { goHome } from '@/router/helpers.js'
const useUser = useUserInfoStore()
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
    { min: 4, max: 20, message: '用户名长度在4-20个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[0-9]).{6,15}$/,
      message: '密码必须包含数字，长度6-15位',
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
    console.log('登录成功', data)
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
  <div class="modern-form-container">
    <!-- 表单头部 -->
    <div class="form-header">
      <div class="welcome-back">
        <h2 class="form-title">欢迎回来</h2>
        <p class="form-subtitle">继续您的诗词学习之旅</p>
      </div>
    </div>

    <!-- 表单内容 -->
    <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" class="modern-form">
      <div class="input-group">
        <el-form-item prop="username" class="floating-label-item">
          <el-input 
            v-model="formModel.username" 
            name="username" 
            :prefix-icon="User" 
            placeholder="请输入用户名"
            class="modern-input"
          ></el-input>
          <label class="floating-label">用户名</label>
        </el-form-item>

        <el-form-item prop="password" class="floating-label-item">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            class="modern-input"
          ></el-input>
          <label class="floating-label">密码</label>
        </el-form-item>
      </div>

      <!-- 记住密码选项 -->
      <div class="form-options">
        <el-checkbox class="remember-checkbox">记住密码</el-checkbox>
      </div>

      <!-- 登录按钮 -->
      <el-form-item class="button-item">
        <el-button
          @click="login"
          class="modern-login-btn"
          type="primary"
          :class="{ 'active': isLoginButtonActive }"
          :disabled="isButtonDisabled"
          size="large"
        >
          <span class="btn-text">登录</span>
          <div class="btn-loading" v-if="false">
            <i class="el-icon-loading"></i>
          </div>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 底部链接 -->
    <div class="form-footer">
      <div class="auth-links">
        <span class="link-item" @click="changePage(2)">邮箱登录</span>
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
        background: linear-gradient(135deg, #2C3E50 0%, #3498DB 100%);
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
              border-color: #3498DB;
              box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
            }

            &.is-focus {
              border-color: #2980B9;
              box-shadow: 0 8px 25px rgba(41, 128, 185, 0.2);
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
          color: #3498DB;
          opacity: 1;
        }
      }
    }

    // 表单选项
    .form-options {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;

      .remember-checkbox {
        :deep(.el-checkbox__label) {
          color: #7F8C8D;
          font-size: 14px;
          font-weight: 500;
        }

        :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
          background-color: #3498DB;
          border-color: #3498DB;
        }
      }
    }

    // 登录按钮
    .button-item {
      margin-bottom: 0;

      .modern-login-btn {
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
          background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
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
          color: #3498DB;
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
      background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(41, 128, 185, 0.05) 100%);
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
      color: #3498DB !important;
      opacity: 1 !important;
    }
  }
}
</style>
