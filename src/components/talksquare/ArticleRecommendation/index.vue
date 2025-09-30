<script setup>
import { ref, onMounted } from 'vue'
import { userLuntanSelectForumGetApi } from '@/api/modules/talkSquare.js'
import { goForumDetail } from '@/router/helpers.js'
const RecommendationData = ref({}) // 今日古诗推荐

const userLuntanSelectForum = async () => {
  const res = await userLuntanSelectForumGetApi()
  RecommendationData.value = res.data
}
// TODO 跳转详情页页面不会自动更新
const goToDetail = (item) => {
  console.log(item)
  goForumDetail(item.id)
}
onMounted(() => {
  userLuntanSelectForum()
})
</script>

<template>
  <div class="article-recommendation">
    <div class="card-header">
      <el-icon class="header-icon"><Star /></el-icon>
      <h3>文章推荐</h3>
    </div>
    
    <div class="recommendation-list">
      <div
        v-for="item in RecommendationData"
        :key="item.blogid"
        class="recommendation-item"
        @click="goToDetail(item)"
      >
        <h4 class="item-title">{{ item.title }}</h4>
        <div class="item-meta">
          <span class="meta-item comments">
            <el-icon><ChatDotRound /></el-icon>
            {{ item.conmments }}
          </span>
          <span class="meta-item likes">
            <el-icon><Star /></el-icon>
            {{ item.liked }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-recommendation {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;

    .header-icon {
      font-size: 24px;
      color: #667eea;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  .recommendation-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .recommendation-item {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        background: rgba(102, 126, 234, 0.05);
        border-color: #667eea;
        transform: translateX(4px);

        .item-title {
          color: #667eea;
        }
      }

      .item-title {
        margin: 0 0 12px 0;
        font-size: 15px;
        font-weight: 500;
        color: #333;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.3s ease;
      }

      .item-meta {
        display: flex;
        gap: 16px;
        font-size: 13px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #999;

          .el-icon {
            font-size: 14px;
          }

          &.comments {
            color: #667eea;
          }

          &.likes {
            color: #f39c12;
          }
        }
      }
    }
  }
}
</style>
