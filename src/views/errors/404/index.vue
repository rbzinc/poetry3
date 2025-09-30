<template>
  <div class="modern-404-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="content-wrapper">
      <!-- 404 数字动画 -->
      <div class="error-number">
        <span class="number">4</span>
        <div class="number-icon">
          <el-icon :size="120"><Document /></el-icon>
        </div>
        <span class="number">4</span>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-message">
        <h1 class="title">页面走丢了</h1>
        <p class="description">
          抱歉，您访问的页面不存在或已被移除<br />
          请检查网址是否正确，或返回首页继续浏览
        </p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn primary" @click="goHome">
          <el-icon :size="18"><HomeFilled /></el-icon>
          <span>返回首页</span>
        </button>
        <button class="action-btn secondary" @click="goBack">
          <el-icon :size="18"><Back /></el-icon>
          <span>返回上页</span>
        </button>
      </div>
      
      <!-- 推荐链接 -->
      <div class="quick-links">
        <div class="links-title">
          <el-icon :size="16"><Star /></el-icon>
          <span>您可能感兴趣的</span>
        </div>
        <div class="links-grid">
          <button class="link-item" @click="navigateTo('/poet')">
            <el-icon :size="24"><Reading /></el-icon>
            <span>诗词书阁</span>
          </button>
          <button class="link-item" @click="navigateTo('/study')">
            <el-icon :size="24"><MagicStick /></el-icon>
            <span>学习中心</span>
          </button>
          <button class="link-item" @click="navigateTo('/talksquare')">
            <el-icon :size="24"><ChatDotSquare /></el-icon>
            <span>诗词论坛</span>
          </button>
          <button class="link-item" @click="navigateTo('/tourism')">
            <el-icon :size="24"><MapLocation /></el-icon>
            <span>诗意之旅</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 底部装饰 -->
    <div class="footer-decoration">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Document, HomeFilled, Back, Star, Reading,
  MagicStick, ChatDotSquare, MapLocation
} from '@element-plus/icons-vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
// 现代化404页面
.modern-404-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F8F9FA 0%, #ECF0F1 100%);
  overflow: hidden;
  
  // 背景装饰球
  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 0;
    
    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 6s ease-in-out infinite;
      
      &.orb-1 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        top: -200px;
        left: -200px;
        animation-delay: 0s;
      }
      
      &.orb-2 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        top: 50%;
        right: -150px;
        animation-delay: 2s;
      }
      
      &.orb-3 {
        width: 350px;
        height: 350px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        bottom: -150px;
        left: 30%;
        animation-delay: 4s;
      }
    }
  }
  
  // 内容包装器
  .content-wrapper {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 40px 20px;
    max-width: 800px;
    
    // 404 数字
    .error-number {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 40px;
      
      .number {
        font-size: 160px;
        font-weight: 900;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        animation: bounce 2s ease-in-out infinite;
      }
      
      .number-icon {
        color: #667eea;
        animation: spin 3s linear infinite;
      }
    }
    
    // 错误信息
    .error-message {
      margin-bottom: 48px;
      
      .title {
        font-size: 36px;
        font-weight: 700;
        color: #2C3E50;
        margin: 0 0 16px 0;
        animation: fadeInDown 0.8s ease;
      }
      
      .description {
        font-size: 16px;
        color: #7F8C8D;
        line-height: 1.8;
        margin: 0;
        animation: fadeInUp 0.8s ease;
      }
    }
    
    // 操作按钮
    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 60px;
      animation: fadeInUp 1s ease;
      
      .action-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 32px;
        border: none;
        border-radius: 14px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          
          &:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
          }
        }
        
        &.secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          
          &:hover {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
          }
        }
        
        &:active {
          transform: translateY(-2px) scale(0.98);
        }
      }
    }
    
    // 快速链接
    .quick-links {
      animation: fadeInUp 1.2s ease;
      
      .links-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 24px;
        color: #7F8C8D;
        font-size: 14px;
        font-weight: 500;
      }
      
      .links-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        
        .link-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px 16px;
          background: white;
          border: 2px solid #ECF0F1;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          .el-icon {
            color: #667eea;
          }
          
          span {
            font-size: 14px;
            font-weight: 500;
            color: #2C3E50;
          }
          
          &:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
            
            .el-icon {
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }
  
  // 底部波浪装饰
  .footer-decoration {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    overflow: hidden;
    z-index: 0;
    
    .wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 200%;
      height: 100%;
      background-repeat: repeat-x;
      animation: wave 15s linear infinite;
      
      &.wave-1 {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23667eea' fill-opacity='0.1'/%3E%3C/svg%3E");
        opacity: 0.5;
        animation-duration: 15s;
      }
      
      &.wave-2 {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23764ba2' fill-opacity='0.1'/%3E%3C/svg%3E");
        opacity: 0.3;
        animation-duration: 20s;
        animation-delay: -5s;
      }
    }
  }
}

// 动画关键帧
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-30px) translateX(30px);
  }
  66% {
    transform: translateY(30px) translateX(-30px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .modern-404-page {
    .content-wrapper {
      .error-number {
        .number {
          font-size: 100px;
        }
        
        .number-icon {
          .el-icon {
            font-size: 80px;
          }
        }
      }
      
      .error-message {
        .title {
          font-size: 28px;
        }
        
        .description {
          font-size: 14px;
        }
      }
      
      .action-buttons {
        flex-direction: column;
        
        .action-btn {
          width: 100%;
          justify-content: center;
        }
      }
      
      .quick-links {
        .links-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .modern-404-page {
    .content-wrapper {
      .quick-links {
        .links-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>