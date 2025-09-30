<script setup>
// 引入 reactive 和 ElMessage
import { ref, onMounted, reactive } from 'vue'
import common from './comment/index.vue'
import Markdown from './markdown/index.vue'
import { useRoute } from 'vue-router' // 引入 useRouter
import DayRecommend from '@/components/talksquare/DayRecommend/index.vue'
import ArticleRecommentDation from '@/components/talksquare/ArticleRecommendation/index.vue'
import { ElMessage } from 'element-plus' // 引入 ElMessage
import {
  userLuntanDianzanGetApi,
  userLuntanDianzanrankGetApi,
  userLuntanGuanzhuGetApi,
  userLuntanIsguanzhuGetApi,
  userLuntanSelectConmmetsGetApi,
  userLuntanSelectxiangxiGetApi,
} from '@/api/modules/talkSquare.js'
import { goPoetClassDetail } from '@/router/helpers.js' // 引入跳转函数

const route = useRoute()
const blogId = ref(route.query.id)

// 使用 reactive 聚合状态
const state = reactive({
  isLoading: true, // 页面整体加载状态
  isLoadingFollow: false, // 关注操作加载状态
  isLoadingLike: false, // 点赞操作加载状态
  isLoadingRank: false, // 点赞排行加载状态
  isLoadingComments: false, // 评论加载状态
  isError: false, // 页面加载错误状态
  pageContentMarkShow: false, // 控制 Markdown 和评论区显示
  postAddCommentForm: [], // 评论数据
  userLuntanXiangxi: {}, // 帖子详情
  userLuntanDianzanrankData: [], // 点赞排行榜
  isFollowed: false, // 关注状态
  content: '', // 文章内容 (可以考虑直接用 state.userLuntanXiangxi.content)
  commentsCount: 0, // 文章评论数量 (使用数字类型)
  poemId: '', // 诗词id
  userId: '', // 作者id
})

/**
 * 获取论坛详情页面的用户信息
 */
const fetchForumDetail = async () => {
  state.isLoading = true
  state.isError = false
  try {
    const res = await userLuntanSelectxiangxiGetApi(blogId.value)
    if (res && res.data) {
      state.userLuntanXiangxi = res.data
      state.poemId = res.data.poemId
      state.userId = res.data.userId
      state.content = res.data.content
      state.commentsCount = Number(res.data.conmments) || 0 // 确保是数字
      state.pageContentMarkShow = true // 数据获取成功后显示内容区
      // 获取关注状态 (依赖 userId)
      await fetchFollowStatus()
    } else {
      throw new Error('获取帖子详情失败或数据格式错误')
    }
  } catch (error) {
    console.error('获取论坛详情失败：', error)
    state.isError = true
    ElMessage.error('加载帖子详情失败，请稍后重试')
  } finally {
    state.isLoading = false // 无论成功失败，结束整体加载状态
  }
}

/**
 * 获取关注状态
 */
const fetchFollowStatus = async () => {
  // 确保 userId 有效
  if (!state.userId) return
  try {
    const res = await userLuntanIsguanzhuGetApi(state.userId)
    // 假设 API 返回 '已关注' 或 '未关注'
    state.isFollowed = res.data === '已关注'
  } catch (error) {
    console.error('获取关注状态失败：', error)
    // 获取关注状态失败通常不阻塞页面，可以选择不提示用户或仅日志记录
  }
}

/**
 * 获取论坛详情页面的点赞排行榜
 */
const fetchLikeRank = async () => {
  state.isLoadingRank = true
  try {
    const res = await userLuntanDianzanrankGetApi(blogId.value)
    if (res && Array.isArray(res.data)) {
      state.userLuntanDianzanrankData = res.data
    } else {
      state.userLuntanDianzanrankData = [] // 确保是数组
    }
  } catch (error) {
    console.error('获取点赞排行失败：', error)
    ElMessage.error('加载点赞排行失败')
  } finally {
    state.isLoadingRank = false
  }
}

/**
 * 获取评论区数据
 */
const fetchComments = async () => {
  state.isLoadingComments = true
  try {
    const res = await userLuntanSelectConmmetsGetApi(blogId.value)
    if (res && Array.isArray(res.data)) {
      state.postAddCommentForm = res.data
    } else {
      state.postAddCommentForm = [] // 确保是数组
    }
  } catch (error) {
    console.error('获取评论失败：', error)
    ElMessage.error('加载评论失败')
  } finally {
    state.isLoadingComments = false
  }
}

/**
 * 更新关注状态
 */
const updateFollow = async () => {
  if (!state.userId) return // 防止 userId 未加载时点击
  state.isLoadingFollow = true
  const targetFollowState = !state.isFollowed // 预期操作后的状态
  try {
    const res = await userLuntanGuanzhuGetApi(state.userId, targetFollowState)
    // 根据 API 返回结果更新状态，而不是直接取反
    if (targetFollowState && res.data === '关注成功') {
      state.isFollowed = true
      state.userLuntanXiangxi.fans = (state.userLuntanXiangxi.fans || 0) + 1 // 更新粉丝数
      ElMessage.success('关注成功')
    } else if (!targetFollowState && res.data === '取消成功') {
      state.isFollowed = false
      state.userLuntanXiangxi.fans = Math.max(0, (state.userLuntanXiangxi.fans || 0) - 1) // 更新粉丝数
      ElMessage.success('取消关注成功')
    } else {
      // API 返回结果与预期不符
      ElMessage.warning(res.data || '操作失败，请稍后再试')
    }
  } catch (error) {
    console.error('更新关注状态失败：', error)
    ElMessage.error('操作失败，请检查网络')
  } finally {
    state.isLoadingFollow = false
  }
}

/**
 *  更新点赞状态
 */
const updateLike = async () => {
  state.isLoadingLike = true
  const targetLikeState = !state.userLuntanXiangxi.blogLike // 预期操作后的状态
  try {
    const res = await userLuntanDianzanGetApi(blogId.value)
    if (targetLikeState && res.data === '点赞成功') {
      state.userLuntanXiangxi.blogLike = true
      state.userLuntanXiangxi.liked = (state.userLuntanXiangxi.liked || 0) + 1
      ElMessage.success('点赞成功')
      await fetchLikeRank() // 点赞成功后刷新排行榜
    } else if (!targetLikeState && res.data === '点赞取消') {
      state.userLuntanXiangxi.blogLike = false
      state.userLuntanXiangxi.liked = Math.max(0, (state.userLuntanXiangxi.liked || 0) - 1)
      ElMessage.success('取消点赞成功')
      await fetchLikeRank() // 取消点赞成功后刷新排行榜
    } else {
      ElMessage.warning(res.data || '操作失败，请稍后再试')
    }
  } catch (error) {
    console.error('更新点赞状态失败：', error)
    ElMessage.error('操作失败，请检查网络')
  } finally {
    state.isLoadingLike = false
  }
}

/**
 * 跳转到诗词详情页
 */
const jumpToPoemDetail = () => {
  if (state.poemId) {
    goPoetClassDetail(state.poemId)
  } else {
    ElMessage.info('该帖子未引用诗词')
  }
}

// --- 生命周期钩子 ---
onMounted(async () => {
  // 并行获取帖子详情、评论和点赞排行
  await Promise.all([
    fetchForumDetail(), // 详情获取成功后会内部调用 fetchFollowStatus
    fetchComments(),
    fetchLikeRank(),
  ])
  // 可以在这里添加一个最终的加载完成状态，如果需要的话
})
</script>

<template>
  <div class="forum-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="$router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回论坛</span>
    </div>

    <!-- 主要内容区 -->
    <div class="detail-content">
      <!-- 左侧内容区 -->
      <div class="content-main" v-loading="state.isLoading">
        <!-- 文章卡片 -->
        <div v-if="!state.isError && state.userLuntanXiangxi.id" class="article-card">
          <div class="article-header">
            <h1 class="article-title">{{ state.userLuntanXiangxi.title }}</h1>
            
            <div class="article-meta">
              <div class="meta-left">
                <span class="author">
                  <el-icon><User /></el-icon>
                  {{ state.userLuntanXiangxi.username }}
                </span>
                <span class="time">
                  <el-icon><Clock /></el-icon>
                  {{ state.userLuntanXiangxi.createTime }}
                </span>
                <span class="likes">
                  <el-icon><Star /></el-icon>
                  {{ state.userLuntanXiangxi.liked }}
                </span>
              </div>
            </div>

            <!-- 诗词引用 -->
            <div v-if="state.userLuntanXiangxi.poemWord" class="article-quote" @click="jumpToPoemDetail">
              <el-icon><Document /></el-icon>
              <span>引用诗词：{{ state.userLuntanXiangxi.poemWord }}</span>
            </div>
          </div>

          <!-- 文章内容 -->
          <div class="article-body">
            <Markdown v-if="state.pageContentMarkShow" :content="state.content" />
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-else-if="state.isError" class="error-card">
          <el-empty description="加载帖子失败，请刷新页面或稍后再试" />
        </div>

        <!-- 评论区 -->
        <common
          v-if="state.pageContentMarkShow && !state.isError"
          :comments="state.commentsCount"
          :comment-data="state.postAddCommentForm"
          :is-loading-comments="state.isLoadingComments"
          :blog-id="blogId"
          @refresh-comments="fetchComments"
        />
      </div>

      <!-- 右侧作者信息与推荐 -->
      <aside class="sidebar">
        <!-- 作者信息卡片 -->
        <div v-if="!state.isError && state.userLuntanXiangxi.id" class="author-card">
          <div class="author-header">
            <img
              v-if="state.userLuntanXiangxi.touxiang"
              :src="state.userLuntanXiangxi.touxiang"
              alt="Avatar"
              class="author-avatar"
            />
            <el-avatar v-else :size="64" icon="UserFilled" class="author-avatar" />
            
            <div class="author-info">
              <h3 class="author-name">{{ state.userLuntanXiangxi.username }}</h3>
              <p class="author-tag">{{ state.userLuntanXiangxi.nameTager }}</p>
            </div>
          </div>

          <div class="author-stats">
            <div class="stat-item">
              <div class="stat-value">{{ state.userLuntanXiangxi.liked || 0 }}</div>
              <div class="stat-label">点赞量</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ state.userLuntanXiangxi.fans || 0 }}</div>
              <div class="stat-label">粉丝</div>
            </div>
          </div>

          <div class="action-buttons">
            <el-button
              type="primary"
              class="action-btn follow-btn"
              @click="updateFollow"
              :loading="state.isLoadingFollow"
              :disabled="state.isLoadingFollow || state.isLoading"
            >
              <el-icon><User /></el-icon>
              <span>{{ state.isFollowed ? '取消关注' : '关注' }}</span>
            </el-button>
            <el-button
              class="action-btn like-btn"
              @click="updateLike"
              :loading="state.isLoadingLike"
              :disabled="state.isLoadingLike || state.isLoading"
            >
              <el-icon><Star /></el-icon>
              <span>{{ state.userLuntanXiangxi.blogLike ? '已点赞' : '点赞' }}</span>
            </el-button>
          </div>
        </div>

        <!-- 点赞排行卡片 -->
        <div class="like-rank-card" v-loading="state.isLoadingRank">
          <div class="card-header">
            <el-icon class="header-icon"><TrendCharts /></el-icon>
            <h3>点赞排行</h3>
          </div>
          
          <div class="rank-list">
            <div v-if="state.userLuntanDianzanrankData.length > 0">
              <div v-for="(item, index) in state.userLuntanDianzanrankData" :key="item.id" class="rank-item">
                <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                <img v-if="item.touxiang" :src="item.touxiang" class="rank-avatar" />
                <el-avatar v-else :size="36" icon="UserFilled" class="rank-avatar" />
                <span class="rank-name">{{ item.name }}</span>
              </div>
            </div>
            <el-empty v-else description="暂无用户点赞" :image-size="60" />
          </div>
        </div>

        <!-- 推荐组件 -->
        <ArticleRecommentDation />
        <DayRecommend />
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.forum-detail-container {
  position: relative;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  padding: 30px 40px;

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: white;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .el-icon {
      font-size: 18px;
    }

    &:hover {
      color: #667eea;
      transform: translateX(-4px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }
  }

  .detail-content {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 30px;

    .content-main {
      .article-card {
        background: white;
        border-radius: 16px;
        padding: 40px;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

        .article-header {
          padding-bottom: 24px;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 32px;

          .article-title {
            margin: 0 0 20px 0;
            font-size: 32px;
            font-weight: 700;
            color: #333;
            line-height: 1.4;
          }

          .article-meta {
            display: flex;
            gap: 24px;
            margin-bottom: 16px;

            .meta-left {
              display: flex;
              gap: 24px;
              flex-wrap: wrap;

              span {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                color: #999;

                .el-icon {
                  font-size: 16px;
                }

                &.author {
                  color: #667eea;
                  font-weight: 500;
                }

                &.likes {
                  color: #f39c12;
                }
              }
            }
          }

          .article-quote {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
            border-left: 4px solid #667eea;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;

            .el-icon {
              font-size: 18px;
              color: #667eea;
            }

            span {
              color: #667eea;
              font-weight: 500;
              font-size: 14px;
            }

            &:hover {
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
              transform: translateX(4px);
            }
          }
        }

        .article-body {
          min-height: 300px;
          line-height: 1.8;
          font-size: 16px;
          color: #333;
        }
      }

      .error-card {
        background: white;
        border-radius: 16px;
        padding: 60px 20px;
        text-align: center;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      }
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .author-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

        .author-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;

          .author-avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 3px solid #f0f0f0;
            flex-shrink: 0;
          }

          .author-info {
            flex: 1;

            .author-name {
              margin: 0 0 6px 0;
              font-size: 18px;
              font-weight: 600;
              color: #333;
            }

            .author-tag {
              margin: 0;
              font-size: 13px;
              color: #999;
            }
          }
        }

        .author-stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 24px;
          padding: 20px 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 12px;

          .stat-item {
            text-align: center;

            .stat-value {
              font-size: 24px;
              font-weight: 700;
              color: #667eea;
              margin-bottom: 6px;
            }

            .stat-label {
              font-size: 13px;
              color: #999;
            }
          }

          .stat-divider {
            width: 1px;
            height: 40px;
            background: #e0e0e0;
          }
        }

        .action-buttons {
          display: flex;
          gap: 12px;

          .action-btn {
            flex: 1;
            height: 44px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.3s ease;

            &.follow-btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              color: white;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
              }
            }

            &.like-btn {
              border: 2px solid #667eea;
              color: #667eea;

              &:hover {
                background: rgba(102, 126, 234, 0.1);
                transform: translateY(-2px);
              }
            }
          }
        }
      }

      .like-rank-card {
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

        .rank-list {
          .rank-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            margin-bottom: 8px;
            background: #f9f9f9;
            border-radius: 12px;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(102, 126, 234, 0.08);
              transform: translateX(4px);
            }

            .rank-badge {
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 700;
              color: white;
              flex-shrink: 0;
              background: #999;

              &.rank-1 {
                background: linear-gradient(135deg, #f39c12, #e67e22);
              }

              &.rank-2 {
                background: linear-gradient(135deg, #95a5a6, #7f8c8d);
              }

              &.rank-3 {
                background: linear-gradient(135deg, #d35400, #c0392b);
              }
            }

            .rank-avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              flex-shrink: 0;
            }

            .rank-name {
              flex: 1;
              font-size: 14px;
              color: #666;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .forum-detail-container {
    padding: 20px;

    .detail-content {
      grid-template-columns: 1fr;

      .sidebar {
        .author-card,
        .like-rank-card {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .forum-detail-container {
    padding: 15px;

    .back-button {
      padding: 8px 16px;
      font-size: 13px;
    }

    .detail-content {
      .content-main {
        .article-card {
          padding: 24px 20px;

          .article-header {
            .article-title {
              font-size: 24px;
            }

            .article-meta {
              flex-direction: column;
              gap: 12px;

              .meta-left {
                gap: 16px;
              }
            }
          }

          .article-body {
            font-size: 15px;
          }
        }
      }
    }
  }
}
</style>
