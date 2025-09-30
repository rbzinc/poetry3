<script setup>
import { ref, computed, onMounted } from 'vue'
import { userGameStore } from '@/stores/modules/game.js'
import { goDictionary, goDictionaryPoemGame } from '@/router/helpers.js'
import { ArrowLeftBold, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as url from 'node:url'
import { GAME_PROGRESS_BG } from '@/constants/bgUrl.js'

const gameStore = userGameStore()
const searchQuery = ref('')
const loading = ref(false)

const poems = ref([
  {
    id: '0',
    name: '桃花源记',
    author: '陶渊明',
    dynasty: '晋',
    type: '记',
    completed: false,
    content: '晋太元中，武陵人捕鱼为业...',
  },
  {
    id: '1',
    name: '木兰辞',
    author: '佚名',
    dynasty: '南北朝',
    type: '辞',
    completed: false,
    content: '唧唧复唧唧，木兰当户织...',
  },
  // ... 其他诗词数据
])

// 搜索过滤
const filteredPoems = computed(() => {
  return poems.value.filter(
    (poem) =>
      poem.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      poem.author.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 统计信息
const statistics = computed(() => {
  const total = poems.value.length
  const completed = poems.value.filter((poem) => poem.completed).length
  const progress = Math.round((completed / total) * 100)
  return { total, completed, progress }
})

const returnclick = () => {
  goDictionary()
}

const entergame = (poem) => {
  loading.value = true
  try {
    poem.completed = true
    gameStore.updatePoetStatus(poem.id)
    goDictionaryPoemGame()
  } catch (error) {
    ElMessage.error('进入游戏失败，请重试')
    console.log(error)
  } finally {
    loading.value = false
  }
}

const viewPoemDetail = (poem) => {
  ElMessage({
    message: poem.content,
    type: 'info',
    duration: 5000,
  })
}

onMounted(() => {
  // 初始化已完成状态
  const completedPoems = gameStore.getCompletedPoems()
  poems.value.forEach((poem) => {
    poem.completed = completedPoems.includes(poem.id)
  })
})
</script>

<template>
  <div class="poem-list-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-left">
        <el-button class="back-button" @click="returnclick" circle>
            <el-icon><ArrowLeftBold /></el-icon>
          </el-button>
        <div class="header-title">
          <h1>诗词列表</h1>
          <p>选择诗词开始游戏挑战</p>
        </div>
        </div>
      <div class="header-right">
          <el-input
            v-model="searchQuery"
          placeholder="搜索诗词或作者..."
            prefix-icon="Search"
            clearable
            class="search-input"
          size="large"
          />
        </div>
      </div>

    <!-- 统计卡片 -->
    <div class="statistics-section">
      <div class="stat-card total">
        <div class="stat-icon">
          <el-icon><Reading /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-label">总计诗词</div>
        </div>
      </div>

      <div class="stat-card completed">
        <div class="stat-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>

      <div class="stat-card progress">
        <div class="progress-circle">
      <el-progress
            type="circle"
        :percentage="statistics.progress"
            :width="80"
            :stroke-width="8"
            color="#667eea"
          />
        </div>
        <div class="stat-content">
          <div class="stat-label">完成率</div>
        </div>
      </div>
    </div>

    <!-- 诗词列表 -->
    <div class="poems-container">
      <transition-group name="poem-list" tag="div" class="poem-grid">
        <div
          v-for="poem in filteredPoems"
          :key="poem.id"
          class="poem-card"
          :class="{ completed: poem.completed }"
        >
          <div class="poem-header">
            <div class="dynasty-badge">{{ poem.dynasty }}</div>
            <div class="completion-badge" v-if="poem.completed">
              <el-icon><Select /></el-icon>
            </div>
          </div>

          <div class="poem-body" @click="viewPoemDetail(poem)">
            <h3 class="poem-name">{{ poem.name }}</h3>
            <p class="poem-author">《{{ poem.type }}》· {{ poem.author }}</p>
    </div>

          <div class="poem-footer">
            <el-button
              type="primary"
              :plain="poem.completed"
              @click="entergame(poem)"
              :loading="loading"
              class="start-button"
            >
              <el-icon><CaretRight /></el-icon>
              {{ poem.completed ? '重新挑战' : '开始游戏' }}
            </el-button>
            <el-button circle @click="viewPoemDetail(poem)" class="view-button">
              <el-icon><Document /></el-icon>
            </el-button>
          </div>
          </div>
      </transition-group>

      <!-- 空状态 -->
        <div v-if="filteredPoems.length === 0" class="empty-state">
          <el-empty description="未找到相关诗词">
            <el-button type="primary" @click="searchQuery = ''">清除搜索</el-button>
          </el-empty>
        </div>
        </div>
      </div>
</template>

<style scoped lang="scss">
.poem-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  position: relative;
  overflow: hidden;

  // 背景装饰
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 24px 28px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .back-button {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        font-size: 20px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateX(-4px) scale(1.1);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }

      .header-title {
        h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #7f8c8d;
        }
      }
    }

    .header-right {
      :deep(.search-input) {
        width: 350px;

        .el-input__wrapper {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 14px;
          box-shadow: none;
          border: 1px solid rgba(102, 126, 234, 0.2);
          padding: 8px 16px;

          &:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.08);
          }

          &.is-focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            border-color: #667eea;
          }
        }
      }
    }
  }

  .statistics-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;

    .stat-card {
      background: rgba(255, 255, 255, 0.98);
      border-radius: 20px;
      padding: 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.3);

      &:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);

        .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }

      &.total .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.completed .stat-icon {
        background: linear-gradient(135deg, #06d6a0 0%, #0ab68b 100%);
      }

      &.progress {
        flex-direction: column;
        align-items: center;
        text-align: center;

        .progress-circle {
          margin-bottom: 12px;
        }
      }

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 28px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  .poems-container {
    position: relative;
    z-index: 1;

    .poem-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      padding: 4px;
    }

    .poem-card {
      background: rgba(255, 255, 255, 0.98);
      border-radius: 20px;
      padding: 24px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
      }

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(102, 126, 234, 0.2);
        border-color: rgba(102, 126, 234, 0.3);

        &::before {
          transform: scaleX(1);
        }

        .poem-name {
          color: #667eea;
        }
      }

      &.completed {
        background: linear-gradient(135deg, rgba(6, 214, 160, 0.05), rgba(10, 182, 139, 0.05));
        border-color: rgba(6, 214, 160, 0.3);

        &::before {
          background: linear-gradient(90deg, #06d6a0 0%, #0ab68b 100%);
        }

        .completion-badge {
          display: flex;
        }
      }

      .poem-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
        margin-bottom: 16px;

        .dynasty-badge {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          color: #667eea;
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .completion-badge {
          display: none;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #06d6a0 0%, #0ab68b 100%);
          border-radius: 50%;
          color: white;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(6, 214, 160, 0.3);
        }
      }

      .poem-body {
        margin-bottom: 20px;
        cursor: pointer;

        .poem-name {
          font-size: 22px;
          font-weight: 800;
          color: #2c3e50;
          margin: 0 0 8px 0;
          transition: color 0.3s ease;
          line-height: 1.3;
        }

        .poem-author {
          font-size: 14px;
          color: #7f8c8d;
          margin: 0;
        }
      }

      .poem-footer {
        display: flex;
        gap: 12px;
        align-items: center;

        .start-button {
          flex: 1;
          height: 44px;
          border-radius: 12px;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
      transition: all 0.3s ease;

      &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }

          &.is-plain {
            background: white;
            border: 2px solid #667eea;
            color: #667eea;

            &:hover {
              background: rgba(102, 126, 234, 0.05);
            }
          }
        }

        .view-button {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          color: #667eea;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(102, 126, 234, 0.1);
            border-color: #667eea;
            transform: scale(1.1);
          }
        }
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
  }
}

// 列表动画
.poem-list-enter-active,
.poem-list-leave-active {
  transition: all 0.4s ease;
}

.poem-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.poem-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// 响应式
@media (max-width: 1200px) {
  .poem-list-page {
    .statistics-section {
      grid-template-columns: 1fr;
    }

    .poems-container .poem-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .poem-list-page {
    padding: 20px;

    .page-header {
      flex-direction: column;
      gap: 16px;

      .header-right {
        width: 100%;

        :deep(.search-input) {
          width: 100%;
        }
      }
    }

    .poems-container .poem-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
