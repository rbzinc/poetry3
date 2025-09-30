<script setup>
import Textcard from '@/components/study/directory/GameStudy/textcard/index.vue'
import { ref, computed } from 'vue'
import { Plus, Search, TrophyBase, CollectionTag } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { GAME_BG } from '@/constants/bgUrl.js'

const searchQuery = ref('')
const dialogVisible = ref(false)
const newCategory = ref({
  name: '',
  description: '',
})

// 视图模式：grid 或 list
const viewMode = ref('grid')

const dictionary = ref([
  {
    id: '0',
    name: '初中古诗词',
    content: '有65首诗，23首词',
    icon: '📚',
    progress: 30,
    description: '涵盖初中语文教材中的古诗词',
    learned: 27,
    total: 88,
  },
  {
    id: '1',
    name: '高中古诗词',
    content: '有156首诗，32首词',
    icon: '📖',
    progress: 15,
    description: '高中语文必修教材中的古诗词',
    learned: 28,
    total: 188,
  },
  {
    id: '2',
    name: '唐诗三百首',
    content: '有300首诗',
    icon: '🏮',
    progress: 5,
    description: '精选唐代诗歌三百首',
    learned: 15,
    total: 300,
  },
])

// 统计数据
const stats = computed(() => {
  const totalPoems = dictionary.value.reduce((sum, item) => sum + item.total, 0)
  const totalLearned = dictionary.value.reduce((sum, item) => sum + item.learned, 0)
  const avgProgress = Math.round(dictionary.value.reduce((sum, item) => sum + item.progress, 0) / dictionary.value.length)
  
  return {
    totalPoems,
    totalLearned,
    avgProgress,
    categories: dictionary.value.length,
  }
})

// 搜索过滤
const filteredDictionary = computed(() => {
  return dictionary.value.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 添加新分类
const addNewCategory = () => {
  if (!newCategory.value.name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  dictionary.value.push({
    id: String(dictionary.value.length),
    name: newCategory.value.name,
    content: newCategory.value.description || '暂无内容',
    icon: '📝',
    progress: 0,
    description: newCategory.value.description,
    learned: 0,
    total: 0,
  })

  dialogVisible.value = false
  newCategory.value = { name: '', description: '' }
  ElMessage.success('添加成功')
}
</script>

<template>
  <div class="dictionary-page">
    <!-- 顶部统计卡片 -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><Reading /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalPoems }}</div>
          <div class="stat-label">总诗词数</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><TrophyBase /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalLearned }}</div>
          <div class="stat-label">已学习</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.avgProgress }}%</div>
          <div class="stat-label">平均进度</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
          <el-icon><CollectionTag /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.categories }}</div>
          <div class="stat-label">分类数量</div>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2 class="page-title">
          <el-icon><Notebook /></el-icon>
          诗词学习
        </h2>
      </div>

      <div class="toolbar-right">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索分类..." 
          prefix-icon="Search" 
          clearable 
          class="search-input"
        />

        <el-button-group class="view-switcher">
          <el-button 
            :type="viewMode === 'grid' ? 'primary' : ''" 
            @click="viewMode = 'grid'"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button 
            :type="viewMode === 'list' ? 'primary' : ''" 
            @click="viewMode = 'list'"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>

        <el-button type="primary" @click="dialogVisible = true">
          <el-icon><Plus /></el-icon>
          添加分类
        </el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <transition-group 
        name="card-list" 
        tag="div" 
        :class="['dictbox', viewMode]"
      >
        <div 
          v-for="item in filteredDictionary" 
          :key="item.id" 
          class="category-item"
        >
          <Textcard
            :title="item.name"
            :content="item.content"
            :icon="item.icon"
            :progress="item.progress"
            :description="item.description"
          />
        </div>

        <!-- 添加新分类卡片 -->
        <div key="add" class="category-item add-item">
          <div class="add-card" @click="dialogVisible = true">
            <div class="add-icon">
              <el-icon><Plus /></el-icon>
            </div>
            <div class="add-text">添加新分类</div>
          </div>
        </div>
      </transition-group>

      <!-- 空状态 -->
      <div v-if="filteredDictionary.length === 0" class="empty-state">
        <el-empty description="未找到相关分类">
          <el-button type="primary" @click="searchQuery = ''">清除搜索</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 添加分类对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="添加新分类" 
      width="500px" 
      :close-on-click-modal="false"
      class="add-dialog"
    >
      <el-form :model="newCategory" label-width="80px" label-position="top">
        <el-form-item label="分类名称">
          <el-input 
            v-model="newCategory.name" 
            placeholder="请输入分类名称"
            size="large"
          />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input 
            v-model="newCategory.description" 
            type="textarea" 
            placeholder="请输入分类描述"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" size="large">取消</el-button>
          <el-button type="primary" @click="addNewCategory" size="large">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.dictionary-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  // 背景装饰
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 28px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--gradient-from), var(--gradient-to));
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);

        &::before {
          opacity: 1;
        }

        .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }

      &:nth-child(1) {
        --gradient-from: #667eea;
        --gradient-to: #764ba2;
      }

      &:nth-child(2) {
        --gradient-from: #f093fb;
        --gradient-to: #f5576c;
      }

      &:nth-child(3) {
        --gradient-from: #4facfe;
        --gradient-to: #00f2fe;
      }

      &:nth-child(4) {
        --gradient-from: #fa709a;
        --gradient-to: #fee140;
      }

      .stat-icon {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        color: white;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

        .el-icon {
          font-size: 32px;
        }
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  .toolbar {
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
    border: 1px solid rgba(255, 255, 255, 0.3);

    .toolbar-left {
      .page-title {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: 0;
        font-size: 30px;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        .el-icon {
          font-size: 36px;
          color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;

      :deep(.search-input) {
        width: 300px;

        .el-input__wrapper {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          box-shadow: none;
          border: 1px solid rgba(102, 126, 234, 0.2);
          transition: all 0.3s ease;

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

      .view-switcher {
        :deep(.el-button) {
          padding: 10px 16px;
          border-radius: 10px;
          transition: all 0.3s ease;

          &.el-button--primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
          }
        }
      }

      :deep(.el-button--primary) {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  .content-section {
    flex: 1;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    padding: 4px;

    .dictbox {
      display: grid;
      gap: 28px;
      padding: 8px;

      &.grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }

      &.list {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .category-item {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: translateY(-8px);
        }
      }

      .add-item {
        .add-card {
          height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.6);
          border: 3px dashed rgba(102, 126, 234, 0.3);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);

          &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .add-icon {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
            border-radius: 50%;
            margin-bottom: 20px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 1;

            .el-icon {
              font-size: 40px;
              color: #667eea;
              transition: all 0.3s ease;
            }
          }

          .add-text {
            font-size: 18px;
            color: #7f8c8d;
            font-weight: 600;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
          }

          &:hover {
            border-color: #667eea;
            border-style: solid;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);

            &::before {
              opacity: 1;
            }

            .add-icon {
              background: linear-gradient(135deg, #667eea, #764ba2);
              transform: rotate(180deg) scale(1.1);
              box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);

              .el-icon {
                color: white;
              }
            }

            .add-text {
              color: #667eea;
              transform: translateY(-4px);
            }
          }
        }
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
    }
  }
}

// 卡片动画
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// 滚动条样式
.content-section::-webkit-scrollbar {
  width: 10px;
}

.content-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  margin: 4px;
}

.content-section::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6));
  border-radius: 10px;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #667eea, #764ba2);
  }
}

// 对话框样式
:deep(.add-dialog) {
  border-radius: 24px;
  overflow: hidden;
  
  .el-dialog__header {
    padding: 28px 28px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;

    .el-dialog__title {
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: white;
        font-size: 20px;

        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 32px 28px;
    background: #fafafa;

    .el-form-item {
      margin-bottom: 24px;

      .el-form-item__label {
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 8px;
      }

      .el-input,
      .el-textarea {
        .el-input__wrapper,
        .el-textarea__inner {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          &.is-focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 20px 28px 28px;
    background: #fafafa;
    border: none;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    .el-button {
      padding: 12px 32px;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;

      &--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }
}

// 响应式
@media (max-width: 1400px) {
  .dictionary-page {
    .stats-section {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 992px) {
  .dictionary-page {
    padding: 20px;

    .stats-section {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .stat-card {
        padding: 16px;

        .stat-icon {
          width: 48px;
          height: 48px;

          .el-icon {
            font-size: 24px;
          }
        }

        .stat-info {
          .stat-value {
            font-size: 24px;
          }
        }
      }
    }

    .toolbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .toolbar-right {
        width: 100%;
        flex-wrap: wrap;

        .search-input {
          flex: 1;
          min-width: 200px;
        }
      }
    }

    .content-section {
      .dictbox {
        &.grid {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .dictionary-page {
    .stats-section {
      grid-template-columns: 1fr;
    }

    .content-section {
      .dictbox {
        &.grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>