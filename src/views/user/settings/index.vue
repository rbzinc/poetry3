<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as ROUTES from '@/constants/router.js'
import { ArrowLeft, Lock, Bell, Picture, Setting, Moon, Sunny, Monitor, Check } from '@element-plus/icons-vue'

const router = useRouter()

// 设置项状态
const settings = ref({
  // 通知设置
  notifications: {
    comment: true,
    like: true,
    follow: true,
    system: true,
    email: false,
  },

  // 隐私设置
  privacy: {
    showEmail: false,
    showPhone: false,
    allowSearch: true,
    allowRecommend: true,
  },

  // 显示设置
  display: {
    theme: 'auto', // light, dark, auto
    fontSize: 'medium', // small, medium, large
    autoPlay: true,
    showAnimation: true,
  },

  // 安全设置
  security: {
    twoFactor: false,
    loginNotification: true,
    autoLogout: 30, // 分钟
  },
})

// 返回个人中心
const goBack = () => {
  router.push(ROUTES.USER)
}

// 保存设置
const saveSettings = () => {
  ElMessage.success('设置已保存')
  console.log('保存的设置：', settings.value)
}

// 重置设置
const resetSettings = () => {
  settings.value = {
    notifications: {
      comment: true,
      like: true,
      follow: true,
      system: true,
      email: false,
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      allowSearch: true,
      allowRecommend: true,
    },
    display: {
      theme: 'auto',
      fontSize: 'medium',
      autoPlay: true,
      showAnimation: true,
    },
    security: {
      twoFactor: false,
      loginNotification: true,
      autoLogout: 30,
    },
  }
  ElMessage.info('已重置为默认设置')
}

// 修改密码
const changePassword = () => {
  ElMessage.info('密码修改功能开发中...')
}

// 清除缓存
const clearCache = () => {
  localStorage.removeItem('poetryCache')
  sessionStorage.clear()
  ElMessage.success('缓存已清除')
}

// 获取主题图标
const getThemeIcon = (theme) => {
  if (theme === 'light') return Sunny
  if (theme === 'dark') return Moon
  return Monitor
}
</script>

<template>
  <div class="settings-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left">
        <el-button class="back-btn" @click="goBack" circle>
          <el-icon :size="20"><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-title">
          <h1>账户设置</h1>
          <p class="subtitle">管理您的账户和偏好设置</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="resetSettings">重置设置</el-button>
        <el-button type="primary" @click="saveSettings">
          <el-icon><Check /></el-icon>
          保存设置
        </el-button>
      </div>
    </div>

    <div class="settings-container">
      <!-- 通知设置 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="header-icon notification">
            <el-icon :size="24"><Bell /></el-icon>
          </div>
          <div class="header-content">
            <h2>通知设置</h2>
            <p>管理您接收的通知类型</p>
          </div>
        </div>

        <div class="section-body">
          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">评论通知</div>
              <div class="item-desc">有人评论您的文章时通知您</div>
            </div>
            <el-switch v-model="settings.notifications.comment" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">点赞通知</div>
              <div class="item-desc">有人点赞您的内容时通知您</div>
            </div>
            <el-switch v-model="settings.notifications.like" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">关注通知</div>
              <div class="item-desc">有新关注者时通知您</div>
            </div>
            <el-switch v-model="settings.notifications.follow" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">系统通知</div>
              <div class="item-desc">接收系统更新和重要公告</div>
            </div>
            <el-switch v-model="settings.notifications.system" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">邮件通知</div>
              <div class="item-desc">通过邮件接收重要通知</div>
            </div>
            <el-switch v-model="settings.notifications.email" />
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="header-icon privacy">
            <el-icon :size="24"><Lock /></el-icon>
          </div>
          <div class="header-content">
            <h2>隐私设置</h2>
            <p>控制您的个人信息可见性</p>
          </div>
        </div>

        <div class="section-body">
          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">显示邮箱</div>
              <div class="item-desc">在个人资料中显示邮箱地址</div>
            </div>
            <el-switch v-model="settings.privacy.showEmail" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">显示手机号</div>
              <div class="item-desc">在个人资料中显示手机号码</div>
            </div>
            <el-switch v-model="settings.privacy.showPhone" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">允许搜索</div>
              <div class="item-desc">允许其他用户通过搜索找到您</div>
            </div>
            <el-switch v-model="settings.privacy.allowSearch" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">推荐给其他用户</div>
              <div class="item-desc">在推荐列表中展示您的内容</div>
            </div>
            <el-switch v-model="settings.privacy.allowRecommend" />
          </div>
        </div>
      </div>

      <!-- 显示设置 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="header-icon display">
            <el-icon :size="24"><Picture /></el-icon>
          </div>
          <div class="header-content">
            <h2>显示设置</h2>
            <p>自定义界面外观和行为</p>
          </div>
        </div>

        <div class="section-body">
          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">主题模式</div>
              <div class="item-desc">选择浅色、深色或跟随系统</div>
            </div>
            <div class="theme-selector">
              <button
                v-for="theme in ['light', 'dark', 'auto']"
                :key="theme"
                class="theme-btn"
                :class="{ active: settings.display.theme === theme }"
                @click="settings.display.theme = theme"
              >
                <el-icon :size="20"><component :is="getThemeIcon(theme)" /></el-icon>
                <span>{{ theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动' }}</span>
              </button>
            </div>
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">字体大小</div>
              <div class="item-desc">调整界面文字大小</div>
            </div>
            <el-radio-group v-model="settings.display.fontSize">
              <el-radio label="small">小</el-radio>
              <el-radio label="medium">中</el-radio>
              <el-radio label="large">大</el-radio>
            </el-radio-group>
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">自动播放视频</div>
              <div class="item-desc">滚动到视频时自动播放</div>
            </div>
            <el-switch v-model="settings.display.autoPlay" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">显示动画效果</div>
              <div class="item-desc">启用界面过渡动画</div>
            </div>
            <el-switch v-model="settings.display.showAnimation" />
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="header-icon security">
            <el-icon :size="24"><Lock /></el-icon>
          </div>
          <div class="header-content">
            <h2>安全设置</h2>
            <p>保护您的账户安全</p>
          </div>
        </div>

        <div class="section-body">
          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">修改密码</div>
              <div class="item-desc">定期更换密码以保护账户安全</div>
            </div>
            <el-button @click="changePassword">修改密码</el-button>
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">两步验证</div>
              <div class="item-desc">登录时需要额外的验证码</div>
            </div>
            <el-switch v-model="settings.security.twoFactor" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">登录通知</div>
              <div class="item-desc">新设备登录时通知您</div>
            </div>
            <el-switch v-model="settings.security.loginNotification" />
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">自动登出时间</div>
              <div class="item-desc">无操作后自动退出登录（分钟）</div>
            </div>
            <el-input-number v-model="settings.security.autoLogout" :min="5" :max="120" :step="5" />
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="header-icon other">
            <el-icon :size="24"><Setting /></el-icon>
          </div>
          <div class="header-content">
            <h2>其他设置</h2>
            <p>系统维护和数据管理</p>
          </div>
        </div>

        <div class="section-body">
          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">清除缓存</div>
              <div class="item-desc">清除本地缓存数据，提升性能</div>
            </div>
            <el-button @click="clearCache">清除缓存</el-button>
          </div>

          <div class="setting-item">
            <div class="item-info">
              <div class="item-label">数据导出</div>
              <div class="item-desc">导出您的个人数据</div>
            </div>
            <el-button>导出数据</el-button>
          </div>

          <div class="setting-item danger">
            <div class="item-info">
              <div class="item-label">注销账户</div>
              <div class="item-desc">永久删除您的账户和所有数据</div>
            </div>
            <el-button type="danger">注销账户</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%);
  padding: 32px;

  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .back-btn {
        background: white;
        border: 2px solid #ecf0f1;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
          transform: translateX(-4px);
        }
      }

      .header-title {
        h1 {
          margin: 0 0 6px 0;
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
          color: #7f8c8d;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  // 设置容器
  .settings-container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;

    // 设置区块
    .setting-section {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
        border-bottom: 2px solid #f8f9fa;

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 14px;

          &.notification {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
            color: #667eea;
          }

          &.privacy {
            background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
            color: #4a90e2;
          }

          &.display {
            background: linear-gradient(135deg, rgba(250, 208, 44, 0.1) 0%, rgba(255, 159, 64, 0.05) 100%);
            color: #fad02c;
          }

          &.security {
            background: linear-gradient(135deg, rgba(245, 109, 154, 0.1) 0%, rgba(254, 97, 97, 0.05) 100%);
            color: #f56d9a;
          }

          &.other {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.05) 100%);
            color: #9b59b6;
          }
        }

        .header-content {
          flex: 1;

          h2 {
            margin: 0 0 4px 0;
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
          }

          p {
            margin: 0;
            font-size: 13px;
            color: #7f8c8d;
          }
        }
      }

      .section-body {
        padding: 8px;

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;

          &:hover {
            background: #f8f9fa;
          }

          &.danger {
            &:hover {
              background: rgba(254, 97, 97, 0.05);
            }
          }

          .item-info {
            flex: 1;

            .item-label {
              font-size: 15px;
              font-weight: 500;
              color: #2c3e50;
              margin-bottom: 4px;
            }

            .item-desc {
              font-size: 13px;
              color: #7f8c8d;
            }
          }

          .theme-selector {
            display: flex;
            gap: 8px;

            .theme-btn {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              padding: 12px 16px;
              background: white;
              border: 2px solid #ecf0f1;
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.3s ease;

              span {
                font-size: 13px;
                color: #7f8c8d;
              }

              &:hover {
                border-color: #667eea;
                transform: translateY(-2px);
              }

              &.active {
                border-color: #667eea;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);

                span {
                  color: #667eea;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .settings-page {
    padding: 16px;

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .header-actions {
        width: 100%;

        button {
          flex: 1;
        }
      }
    }

    .setting-item {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 16px;

      .theme-selector {
        width: 100%;

        .theme-btn {
          flex: 1;
        }
      }
    }
  }
}
</style>
