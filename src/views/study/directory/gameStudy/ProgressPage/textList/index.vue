<script setup>
import { ref, computed, onMounted } from 'vue'
import { userGameStore } from '@/stores/modules/game.js'
import { goDictionary, goDictionaryPoemGame } from '@/router/helpers.js'
import { ArrowLeftBold, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

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
    content: '晋太元中，武陵人捕鱼为业...'
  },
  {
    id: '1',
    name: '木兰辞',
    author: '佚名',
    dynasty: '南北朝',
    type: '辞',
    completed: false,
    content: '唧唧复唧唧，木兰当户织...'
  },
  // ... 其他诗词数据
])

// 搜索过滤
const filteredPoems = computed(() => {
  return poems.value.filter(poem => 
    poem.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    poem.author.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 统计信息
const statistics = computed(() => {
  const total = poems.value.length
  const completed = poems.value.filter(poem => poem.completed).length
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
    duration: 5000
  })
}

onMounted(() => {
  // 初始化已完成状态
  const completedPoems = gameStore.getCompletedPoems()
  poems.value.forEach(poem => {
    poem.completed = completedPoems.includes(poem.id)
  })
})
</script>

<template>
  <el-card class="poem-list-card">
    <template #header>
      <div class="card-header">
        <div class="left">
          <el-button @click="returnclick" text>
            <el-icon><ArrowLeftBold /></el-icon>
            返回
          </el-button>
        </div>
        <div class="right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索诗词..."
            prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
      </div>
    </template>

    <div class="statistics">
      <el-progress
        :percentage="statistics.progress"
        :format="() => `已完成 ${statistics.completed}/${statistics.total}`"
        class="progress"
      />
    </div>

    <el-scrollbar height="400px">
      <div class="poem-list">
        <div v-for="poem in filteredPoems" :key="poem.id" class="poem-item">
          <div class="poem-info" @click="viewPoemDetail(poem)">
            <span class="poem-name">{{ poem.name }}</span>
            <span class="poem-meta">{{ poem.dynasty }} · {{ poem.author }}</span>
          </div>
          <div class="actions">
            <el-tooltip content="查看原文" placement="top">
              <el-icon class="action-icon" @click="viewPoemDetail(poem)">
                <Document />
              </el-icon>
            </el-tooltip>
            <el-checkbox
              v-model="poem.completed"
              @change="() => entergame(poem)"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<style scoped lang="scss">
.poem-list-card {
  height: 560px;
  background-image: url('@/assets/pic/study/7754bcfc0e4b6ca416b0c0435aac38f.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-input {
      width: 200px;
    }
  }

  .statistics {
    padding: 10px 20px;
    .progress {
      margin-top: 10px;
    }
  }

  .poem-list {
    padding: 0 20px;

    .poem-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 10px;
      border-bottom: 1px dashed rgba(74, 73, 73, 0.5);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
      }

      .poem-info {
        flex: 1;
        .poem-name {
          font-size: 18px;
          color: #333;
          margin-right: 10px;
        }
        .poem-meta {
          font-size: 14px;
          color: #666;
        }
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 15px;

        .action-icon {
          font-size: 20px;
          color: #666;
          cursor: pointer;
          &:hover {
            color: #333;
          }
        }
      }
    }
  }
}
</style>