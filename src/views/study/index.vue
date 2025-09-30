<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { STUDY_BG } from '@/constants/bgUrl.js'
import {
  goStudyAI,
  goDictionary,
  goVrExhibition,
  goChatToPic,
  goPicToChat,
  goChatToRefine,
} from '@/router/helpers.js'

const route = useRoute()

// 判断是否在学习主页
const isMainPage = computed(() => route.path === '/study' || route.path === '/study/')

// 判断是否在AI助学页面
const isAIPage = computed(() => route.path.startsWith('/study/ai'))

// 学习进度数据
const learningProgress = ref({
  totalPoems: 156,
  learned: 45,
  aiChats: 12,
  gamesPlayed: 8,
})

const progressPercentage = ref(Math.round((learningProgress.value.learned / learningProgress.value.totalPoems) * 100))

// 导航菜单项
const menuItems = ref([
  { 
    id: 'ai', 
    label: 'AI助学', 
    icon: 'ChatLineSquare',
    description: '与AI诗人对话交流',
    action: () => goStudyAI()
  },
  { 
    id: 'game', 
    label: '游戏助学', 
    icon: 'TrophyBase',
    description: '通过游戏学习古诗词',
    action: () => goDictionary()
  },
  { 
    id: 'vr', 
    label: 'VR展览', 
    icon: 'View',
    description: '沉浸式诗词场景体验',
    action: () => goVrExhibition()
  },
])

// AI功能快捷入口
const aiFunctions = ref([
  { id: 'chat', label: '诗人对话', icon: 'ChatDotRound', path: '/study/ai', action: () => goStudyAI() },
  { id: 'pic', label: '文字生图', icon: 'Picture', path: '/study/ai/chat-to-pic', action: () => goChatToPic() },
  { id: 'text', label: '图片生诗', icon: 'Document', path: '/study/ai/pic-to-chat', action: () => goPicToChat() },
  { id: 'refine', label: '诗句优化', icon: 'Edit', path: '/study/ai/poem-refine', action: () => goChatToRefine() },
])
</script>

<template>
  <div class="study-container">
    <!-- 背景装饰 -->
    <div class="background-decoration" :style="{ backgroundImage: `url(${STUDY_BG})` }"></div>

    <!-- 主页面内容 -->
    <div v-if="isMainPage" class="main-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <el-icon class="title-icon"><Reading /></el-icon>
            学习中心
          </h1>
          <p class="page-subtitle">与AI共赏诗词之美，在游戏中体验文化之韵</p>
        </div>

        <!-- 学习进度卡片 -->
        <div class="progress-card">
          <div class="progress-header">
            <span class="progress-label">学习进度</span>
            <span class="progress-value">{{ learningProgress.learned }}/{{ learningProgress.totalPoems }}</span>
          </div>
          <el-progress 
            :percentage="progressPercentage" 
            :color="['#667eea', '#764ba2']"
            :stroke-width="8"
          />
          <div class="stats-row">
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ learningProgress.aiChats }}次对话</span>
            </div>
            <div class="stat-item">
              <el-icon><TrophyBase /></el-icon>
              <span>{{ learningProgress.gamesPlayed }}场游戏</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能卡片 -->
      <div class="feature-cards">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="feature-card"
          @click="item.action"
        >
          <div class="card-icon">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.label }}</h3>
            <p class="card-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- AI功能标签 -->
      <div class="ai-functions">
        <div class="functions-title">AI功能</div>
        <div class="functions-grid">
          <div
            v-for="func in aiFunctions"
            :key="func.id"
            class="function-tag"
            @click="func.action"
          >
            <el-icon><component :is="func.icon" /></el-icon>
            <span>{{ func.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 子页面内容 -->
    <div v-else class="content-area">
      <!-- AI助学页面导航 -->
      <div v-if="isAIPage" class="ai-nav-bar">
        <div class="nav-container">
          <div class="nav-title">
            <el-icon><MagicStick /></el-icon>
            <span>AI助学</span>
          </div>
          <div class="nav-tabs">
            <div
              v-for="func in aiFunctions"
              :key="func.id"
              class="nav-tab"
              :class="{ active: route.path === func.path || (func.id === 'chat' && route.path.includes('/study/ai/chat-to-chat')) }"
              @click="func.action"
            >
              <el-icon><component :is="func.icon" /></el-icon>
              <span>{{ func.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面内容 -->
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.study-container {
  position: relative;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);

  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.05;
    z-index: 0;
  }

  .main-page {
    position: relative;
    z-index: 10;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      gap: 40px;

      .header-content {
        flex: 1;

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 12px 0;
          font-size: 36px;
          font-weight: 700;
          color: #333;

          .title-icon {
            font-size: 40px;
            color: #667eea;
          }
        }

        .page-subtitle {
          margin: 0;
          font-size: 16px;
          color: #666;
          padding-left: 52px;
        }
      }

      .progress-card {
        width: 420px;
        padding: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        color: white;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .progress-label {
            font-size: 15px;
            opacity: 0.95;
          }

          .progress-value {
            font-size: 28px;
            font-weight: 700;
          }
        }

        :deep(.el-progress__text) {
          color: white !important;
          font-weight: 600;
        }

        :deep(.el-progress-bar__outer) {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .stats-row {
          display: flex;
          gap: 24px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);

          .stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            opacity: 0.95;

            .el-icon {
              font-size: 18px;
            }
          }
        }
      }
    }

    .feature-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 40px;

      .feature-card {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 32px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);

          .card-icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

            .el-icon {
              color: white;
            }
          }
        }

        .card-icon {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-radius: 16px;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 36px;
            color: #667eea;
            transition: all 0.3s ease;
          }
        }

        .card-content {
          flex: 1;

          .card-title {
            margin: 0 0 8px 0;
            font-size: 22px;
            font-weight: 600;
            color: #333;
          }

          .card-desc {
            margin: 0;
            font-size: 14px;
            color: #999;
          }
        }
      }
    }

    .ai-functions {
      .functions-title {
        font-size: 16px;
        font-weight: 600;
        color: #666;
        margin-bottom: 16px;
      }

      .functions-grid {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .function-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 1px solid #e8e8e8;
          border-radius: 24px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 16px;
          }

          &:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
        }
      }
    }
  }

  .content-area {
    position: relative;
    z-index: 5;
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;

    .ai-nav-bar {
      background: white;
      border-bottom: 1px solid #e8e8e8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      .nav-container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px 40px;
        display: flex;
        align-items: center;
        gap: 40px;

        .nav-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 600;
          color: #333;

          .el-icon {
            font-size: 22px;
            color: #667eea;
          }
        }

        .nav-tabs {
          display: flex;
          gap: 8px;
          flex: 1;

          .nav-tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;

            .el-icon {
              font-size: 16px;
            }

            &:hover {
              background: rgba(102, 126, 234, 0.1);
              color: #667eea;
            }

            &.active {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
          }
        }
      }
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .study-container {
    .main-page {
      .page-header {
        flex-direction: column;
        align-items: stretch;

        .progress-card {
          width: 100%;
        }
      }

      .feature-cards {
        grid-template-columns: 1fr;
      }
    }

    .content-area {
      .ai-nav-bar {
        .nav-container {
          padding: 15px 20px;
          gap: 20px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .study-container {
    .main-page {
      padding: 20px;

      .page-header {
        margin-bottom: 30px;

        .header-content {
          .page-title {
            font-size: 28px;

            .title-icon {
              font-size: 32px;
            }
          }

          .page-subtitle {
            font-size: 14px;
            padding-left: 44px;
          }
        }

        .progress-card {
          padding: 20px;
        }
      }

      .feature-cards {
        gap: 16px;
        margin-bottom: 30px;

        .feature-card {
          padding: 24px;

          .card-icon {
            width: 60px;
            height: 60px;

            .el-icon {
              font-size: 30px;
            }
          }

          .card-content {
            .card-title {
              font-size: 18px;
            }
          }
        }
      }
    }

    .content-area {
      .ai-nav-bar {
        .nav-container {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;

          .nav-tabs {
            width: 100%;
            flex-wrap: wrap;

            .nav-tab {
              padding: 8px 16px;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}
</style>