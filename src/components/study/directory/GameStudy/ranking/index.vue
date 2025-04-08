<script setup>
import { ref, onMounted } from "vue"
import { userGameStore } from '@/stores/modules/game.js'

const gameStore = userGameStore()

const getRankClass = (rank) => {
  switch(rank) {
    case 1: return 'rank-first'
    case 2: return 'rank-second'
    case 3: return 'rank-third'
    default: return ''
  }
}

const tableData = ref([
  {
    id: 1,
    avatar: '/avatars/user1.jpg',
    name: '张三',
    score: gameStore.getGameScore('fillPoem') + gameStore.getGameScore('matchPoem'),
    rank: 1,
    title: '诗词大师'
  },
  {
    id: 2,
    avatar: '/avatars/user2.jpg',
    name: '李四',
    score: 88,
    rank: 2,
    title: '诗词达人'
  },
  {
    id: 3,
    avatar: '/avatars/user3.jpg',
    name: '王五',
    score: 77,
    rank: 3,
    title: '诗词爱好者'
  }
])

// 更新排行榜
const updateRanking = () => {
  tableData.value.sort((a, b) => b.score - a.score)
  tableData.value.forEach((item, index) => {
    item.rank = index + 1
  })
}

onMounted(() => {
  updateRanking()
})
</script>

<template>
  <el-card class="ranking-card">
    <template #header>
      <div class="card-header">
        <span class="title">今日学习排行榜</span>
        <el-tag type="success" effect="plain">每日更新</el-tag>
      </div>
    </template>
    
    <div class="rank-list">
      <div 
        v-for="item in tableData" 
        :key="item.id" 
        class="rank-item"
        :class="getRankClass(item.rank)"
      >
        <div class="rank-info">
          <div class="rank-number">{{ item.rank }}</div>
          <el-avatar :size="32" :src="item.avatar" />
          <div class="user-info">
            <div class="name">{{ item.name }}</div>
            <div class="title">{{ item.title }}</div>
          </div>
        </div>
        <div class="score">{{ item.score }}分</div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.ranking-card {
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .rank-list {
    .rank-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 8px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #f5f7fa;
      }

      .rank-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .rank-number {
          width: 24px;
          text-align: center;
          font-weight: bold;
        }

        .user-info {
          .name {
            font-size: 14px;
            color: #333;
          }
          .title {
            font-size: 12px;
            color: #999;
          }
        }
      }

      .score {
        font-weight: bold;
        color: #409EFF;
      }
    }

    .rank-first {
      .rank-number { color: #F7BA2A; }
    }
    .rank-second {
      .rank-number { color: #909399; }
    }
    .rank-third {
      .rank-number { color: #B88230; }
    }
  }
}
</style>