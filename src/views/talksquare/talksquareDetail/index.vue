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
  <div class="layout-container">
    <!-- 左侧内容区 -->
    <!-- 添加 v-loading 和错误状态处理 -->
    <div style="width: 74%" v-loading="state.isLoading">
      <el-card v-if="!state.isError && state.userLuntanXiangxi.id" class="article-card">
        <div class="article-info">
          <h1 class="article-title">{{ state.userLuntanXiangxi.title }}</h1>
          <p class="article-meta">
            作者: {{ state.userLuntanXiangxi.username }} · {{ state.userLuntanXiangxi.createTime }} · 点赞量
            {{ state.userLuntanXiangxi.liked }}
          </p>
          <!-- 只有存在 poemWord 时才显示引用 -->
          <p v-if="state.userLuntanXiangxi.poemWord" class="article-quote" @click="jumpToPoemDetail">
            {{ state.userLuntanXiangxi.poemWord }}
          </p>
        </div>
        <!-- 使用 state.content -->
        <div style="margin-top: 20px; padding: 0 20px; min-height: 200px">
          <!-- 添加最小高度防止加载时塌陷 -->
          <Markdown v-if="state.pageContentMarkShow" :content="state.content" />
        </div>
      </el-card>
      <!-- 错误提示 -->
      <el-card v-else-if="state.isError" class="article-card error-card">
        <el-empty description="加载帖子失败，请刷新页面或稍后再试" />
      </el-card>

      <!-- 评论区，添加 v-loading -->
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
    <div class="author-container" style="width: 24%">
      <!-- 作者信息卡片，添加 v-if 判断数据是否存在 -->
      <el-card v-if="!state.isError && state.userLuntanXiangxi.id" class="author-card">
        <div class="author-info">
          <!-- 添加 v-if 防止头像为空 -->
          <img
            v-if="state.userLuntanXiangxi.touxiang"
            :src="state.userLuntanXiangxi.touxiang"
            alt="Avatar"
            class="author-avatar"
          />
          <!-- 可以给个默认头像 -->
          <el-avatar v-else :size="80" icon="UserFilled" class="author-avatar" />
          <div>
            <h3 style="margin-bottom: 5px">{{ state.userLuntanXiangxi.username }}</h3>
            <p>{{ state.userLuntanXiangxi.nameTager }}</p>
          </div>
        </div>
        <div class="author-stats">
          <div class="author-content">
            <p>{{ state.userLuntanXiangxi.liked || 0 }} 点赞量</p>
            <p>{{ state.userLuntanXiangxi.fans || 0 }} 粉丝</p>
          </div>
          <div class="buttons">
            <!-- 添加 :loading 和 :disabled 状态 -->
            <el-button
              type="primary"
              @click="updateFollow"
              style="height: 40px; width: 120px"
              :loading="state.isLoadingFollow"
              :disabled="state.isLoadingFollow || state.isLoading"
            >
              {{ state.isFollowed ? '取消关注' : '关注' }}
            </el-button>
            <el-button
              size="large"
              style="height: 40px; width: 120px"
              @click="updateLike"
              :loading="state.isLoadingLike"
              :disabled="state.isLoadingLike || state.isLoading"
            >
              {{ state.userLuntanXiangxi.blogLike ? '取消点赞' : '点赞' }}
            </el-button>
          </div>
        </div>
      </el-card>
      <!-- 错误时可以不显示作者卡片或显示占位 -->
      <el-card v-else-if="state.isError" class="author-card error-card">
        <!-- 可以留空或显示错误提示 -->
      </el-card>

      <!-- 点赞排行卡片，添加 v-loading -->
      <el-card class="contents-card" v-loading="state.isLoadingRank">
        <template #header>
          <span>文章点赞榜</span>
          <!-- 修改标题 -->
        </template>
        <div>
          <!-- 优化：使用 v-if 和 v-else 处理空状态 -->
          <div v-if="state.userLuntanDianzanrankData.length > 0">
            <div v-for="item in state.userLuntanDianzanrankData" :key="item.id" class="rank-item">
              <!-- 添加 v-if 防止头像为空 -->
              <img v-if="item.touxiang" :src="item.touxiang" class="rank-avatar" />
              <el-avatar v-else :size="40" icon="UserFilled" class="rank-avatar" />
              <p class="rank-name">{{ item.name }}</p>
            </div>
          </div>
          <!-- 使用 el-empty 显示空状态 -->
          <el-empty v-else description="暂无用户点赞" :image-size="60" />
        </div>
      </el-card>

      <!-- 推荐组件 -->
      <ArticleRecommentDation />
      <DayRecommend style="margin-top: 30px" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  padding: 0 100px; // 考虑在大屏下是否过宽，可设置 max-width
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px; // 使用 gap 控制间距

  // 左侧内容区
  .article-card {
    margin-bottom: 20px; // 与评论区拉开距离
    &.error-card {
      // 错误卡片样式
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px; // 给个最小高度
    }
    .article-info {
      padding: 20px 20px 0; // 调整内边距
    }
    .article-title {
      justify-content: center;
      display: flex;
      font-size: 28px; // 增大标题字号
      font-weight: 600; // 调整字重
      margin-bottom: 10px; // 调整间距
      color: #303133;
    }

    .article-meta {
      justify-content: center;
      display: flex;
      margin-top: 10px; // 调整间距
      margin-bottom: 20px; // 调整间距
      color: #909399; // 调整颜色
      font-size: 14px; // 调整字号
    }

    .article-quote {
      display: flex;
      justify-content: center;
      cursor: pointer;
      background-color: #f8f9fa; // 添加背景色
      padding: 10px 15px; // 添加内边距
      border-radius: 4px; // 添加圆角
      color: #606266; // 调整颜色
      font-size: 15px; // 调整字号
      margin: 0 20px 20px; // 调整外边距
      border-left: 3px solid #409eff; // 添加左边框

      &:hover {
        background-color: #e9ecef; // 添加 hover 效果
      }
    }
  }

  // 右侧容器
  .author-container {
    display: flex;
    flex-direction: column;
    gap: 20px; // 使用 gap 控制卡片间距

    .author-card {
      // height: 220px; // 移除固定高度，让其自适应
      padding-bottom: 15px; // 增加底部内边距
      &.error-card {
        // 错误卡片样式
        min-height: 200px; // 给个最小高度
      }

      .author-info {
        display: flex;
        align-items: center;
        margin-bottom: 15px; // 调整间距

        .author-avatar {
          border-radius: 50%;
          margin-right: 15px; // 调整间距
          width: 70px; // 调整大小
          height: 70px;
          flex-shrink: 0; // 防止被压缩
          // 添加边框或阴影效果
          border: 2px solid #eee;
        }

        h3 {
          margin: 0 0 5px; // 调整间距
          font-size: 18px;
          font-weight: 600; // 加粗
        }

        p {
          color: #666;
          font-size: 14px; // 调整字号
          margin: 0;
        }
      }

      .author-stats {
        .author-content {
          display: flex;
          justify-content: space-around;
          font-size: 15px; // 调整字号
          margin-bottom: 15px; // 调整间距
          text-align: center; // 居中对齐
          p {
            margin: 0;
            color: #303133;
            font-weight: 500; // 调整字重
            span {
              // 如果有点赞量/粉丝数标签
              display: block;
              font-size: 13px;
              color: #909399;
              margin-top: 3px;
            }
          }
        }

        .buttons {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          gap: 10px; // 使用 gap 控制按钮间距

          .el-button {
            // 统一设置按钮样式
            flex: 1; // 让按钮平分空间
            height: 38px; // 调整高度
            // 移除内联的 width
          }
        }
      }
    }

    .contents-card {
      // margin-top: 30px; // 由 gap 控制
      .rank-item {
        // 点赞排行项样式
        display: flex;
        align-items: center;
        margin-bottom: 12px; // 调整间距
        padding: 5px 0; // 增加垂直内边距

        .rank-avatar {
          width: 35px; // 调整头像大小
          height: 35px;
          border-radius: 50%;
          margin-right: 10px; // 调整间距
          flex-shrink: 0;
        }
        .rank-name {
          margin: 0;
          font-size: 15px; // 调整字号
          color: #606266;
          // 限制名字长度，防止过长
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
