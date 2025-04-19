<script setup>
import { ref, computed, onMounted, reactive } from 'vue' // 引入 reactive
import { userLuntanSelecttiezTypesGetApi } from '@/api/modules/talkSquare.js'
import DayRecommend from '@/components/talksquare/DayRecommend/index.vue'
import ArticleRecommendation from '@/components/talksquare/ArticleRecommendation/index.vue'
import { goForumDetail, goForumEdit, goPoetClassDetail } from '@/router/helpers.js'
import { CirclePlusFilled } from '@element-plus/icons-vue'
import { FORUM_BG } from '@/constants/bgUrl.js'
import { ElMessage } from 'element-plus' // 引入 ElMessage

// 使用 reactive 组织状态，更聚合
const state = reactive({
  activeName: 'new', // 当前激活的 Tab (最新/最热)
  activeIndex: '1', // 当前激活的左侧菜单项 ID
  pageSize: 5,
  currentPage: 1,
  nowMenuData: '1', // 当前选中的菜单分类 ID (使用字符串以匹配 menuData 的 id)
  totalPage: 0, // 初始化为 0
  userLuntanSelecttiezTypesData: [],
  isLoading: false, // 新增：加载状态
  isError: false, // 新增：错误状态
})

// 菜单配置 (保持不变)
const menuData = ref([
  { id: '1', name: '诗词创作', icon: 'iconfont icon-chuangzuo' },
  { id: '2', name: '诗词赏析', icon: 'iconfont icon-shuhuashangxi' },
  { id: '3', name: '诗词学习', icon: 'iconfont icon-xinshouxuetang' },
  { id: '4', name: '诗词活动', icon: 'iconfont icon-huodong' },
  { id: '5', name: '诗词资源', icon: 'iconfont icon-ziyuan' },
  { id: '6', name: '诗词杂谈', icon: 'iconfont icon-zatan' },
])

// 计算属性 (保持不变，但源数据现在来自 state)
const truncatedContent = computed(() => {
  return state.userLuntanSelecttiezTypesData.map((item) => ({
    ...item,
    content: item.content && item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content || '', // 添加 item.content 存在性检查
  }))
})

// 新增：计算属性判断列表是否为空
const isListEmpty = computed(() => !state.isLoading && state.userLuntanSelecttiezTypesData.length === 0)

// 方法
const handlePageChange = async (page) => {
  state.currentPage = page
  await fetchForumData()
}

const handleMenuClick = async (item) => {
  // 点击菜单时，重置页码为 1
  state.currentPage = 1
  state.nowMenuData = item.id
  state.activeIndex = item.id // 更新激活菜单项
  await fetchForumData()
}

// 优化 fetchForumData 函数
const fetchForumData = async () => {
  state.isLoading = true // 开始加载
  state.isError = false // 重置错误状态
  try {
    const res = await userLuntanSelecttiezTypesGetApi(state.currentPage, state.pageSize, state.nowMenuData)
    // 确保 res.data 和 res.data.records 存在
    if (res && res.data) {
      state.totalPage = res.data.total || 0
      state.userLuntanSelecttiezTypesData = res.data.records || []
    } else {
      // 处理 API 返回数据结构不符合预期的情况
      state.totalPage = 0
      state.userLuntanSelecttiezTypesData = []
      ElMessage.warning('获取论坛数据格式有误')
    }
  } catch (error) {
    console.error('获取论坛数据失败：', error)
    state.isError = true // 标记错误状态
    state.userLuntanSelecttiezTypesData = [] // 清空数据
    state.totalPage = 0
    ElMessage.error('获取论坛数据失败，请稍后重试') // 用户友好的错误提示
  } finally {
    state.isLoading = false // 结束加载
  }
}

// 组件挂载时获取初始数据
onMounted(fetchForumData)
</script>

<template>
  <div class="forum-container" :style="{ backgroundImage: `url(${FORUM_BG})` }">
    <div class="forum-content">
      <!-- 左侧菜单 -->
      <aside class="forum-sidebar">
        <!-- 使用 state.activeIndex 作为 default-active -->
        <el-menu mode="vertical" :default-active="state.activeIndex">
          <el-menu-item v-for="item in menuData" :key="item.id" :index="item.id" @click="handleMenuClick(item)">
            <i :class="item.icon" />
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 中间内容区 -->
      <main class="forum-main" v-loading="state.isLoading">
        <el-tabs v-model="state.activeName">
          <el-tab-pane label="最新" name="new">
            <el-empty v-if="state.isError" description="加载失败，请稍后重试" />
            <el-empty v-else-if="isListEmpty" description="暂无帖子" />
            <div v-else class="article-list">
              <div v-for="item in truncatedContent" :key="item.id" class="article-item" @click="goForumDetail(item.id)">
                <div class="article-content">
                  <h3 class="title">{{ item.title }}</h3>
                  <p class="content">{{ item.content }}</p>
                  <div class="meta">
                    <span class="author">作者: {{ item.username }}</span>
                    <span class="likes">赞 {{ item.liked }}</span>
                    <span class="comments">评 {{ item.conmments }}</span>
                    <span
                      v-if="item.poemWord && item.poemId"
                      class="quote"
                      @click.stop="goPoetClassDetail(item.poemId)"
                    >
                      引用 "{{ item.poemWord }}"
                    </span>
                  </div>
                </div>
                <div class="article-image" v-if="item.images">
                  <el-image :src="item.images" fit="cover" loading="lazy">
                    <template #error>
                      <div class="image-slot">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="最热" name="heat">
            <el-empty description="“最热”功能正在开发中..." />
          </el-tab-pane>
        </el-tabs>

        <el-pagination
          v-if="!state.isError && state.totalPage > state.pageSize"
          v-model:current-page="state.currentPage"
          :page-size="state.pageSize"
          :total="state.totalPage"
          background
          layout="prev, pager, next"
          @current-change="handlePageChange"
          class="pagination"
        />
      </main>

      <!-- 右侧推荐 (保持不变) -->
      <aside class="forum-aside">
        <ArticleRecommendation />
        <DayRecommend />
      </aside>
    </div>

    <!-- 发布按钮 (保持不变) -->
    <el-button class="publish-btn" type="primary" circle @click="goForumEdit">
      <el-icon><CirclePlusFilled /></el-icon>
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.forum-container {
  min-height: 100vh;
  background-size: cover;
  background-attachment: fixed;
  padding: 10px;
  box-sizing: border-box;

  .forum-content {
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    gap: 20px;

    max-width: 1400px;
    margin: 0 auto;
    border-radius: 8px; // 重新应用圆角
    padding: 20px; // 重新应用内边距

    .forum-sidebar {
      background-color: #fff;
      border-radius: 4px;
      padding: 10px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      height: fit-content;

      .el-menu {
        border-right: none;
      }

      .el-menu-item {
        i {
          margin-right: 8px;
          font-size: 18px;
        }
        height: 45px;
        line-height: 45px;
        &:hover {
          background-color: #ecf5ff;
        }
        &.is-active {
          color: #409eff;
          background-color: #e8f4ff; // 激活项背景色
        }
      }
    }

    .forum-main {
      // 新增：主内容区样式优化
      background-color: #fff;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      .article-list {
        .article-item {
          display: flex;
          padding: 15px 10px; // 增加垂直内边距
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.3s; // 优化过渡效果

          &:hover {
            background-color: #f9fafc; // 调整 hover 背景色
          }

          &:last-child {
            border-bottom: none; // 移除最后一项的边框
          }

          .article-content {
            flex: 1;
            margin-right: 20px;
            display: flex; // 使用 flex 布局内部元素
            flex-direction: column; // 垂直排列

            .title {
              font-size: 18px;
              color: #303133; // 调整标题颜色
              margin-bottom: 8px; // 调整间距
              font-weight: 500; // 轻微加粗
              // 新增：限制标题行数，防止过长
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .content {
              color: #606266; // 调整内容颜色
              line-height: 1.7; // 调整行高
              margin-bottom: 12px; // 调整间距
              font-size: 14px; // 调整字体大小
              // 新增：限制内容行数
              display: -webkit-box;
              -webkit-line-clamp: 2; // 显示两行
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              flex-grow: 1; // 占据剩余空间，将 meta 推到底部
            }

            .meta {
              display: flex;
              align-items: center;
              gap: 15px;
              color: #909399; // 调整元信息颜色
              font-size: 13px; // 调整字体大小
              margin-top: auto; // 将 meta 推到底部

              .quote {
                color: #409eff;
                cursor: pointer;

                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }

          .article-image {
            width: 100px; // 调整图片尺寸
            height: 100px; // 调整图片尺寸
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0; // 防止图片被压缩

            .el-image {
              width: 100%;
              height: 100%;
              display: block; // 修复图片底部可能存在的空隙

              .image-slot {
                // 图片加载失败占位样式
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background: #f5f7fa;
                color: #c0c4cc;
                font-size: 24px;
              }
            }
          }
        }
      }
      // 新增：为 el-tabs 添加一些底部间距
      .el-tabs {
        margin-bottom: 20px;
      }

      .pagination {
        margin-top: 30px;
        display: flex;
        justify-content: center;
      }
    }
    // 新增：右侧边栏样式优化
    .forum-aside {
      display: flex;
      flex-direction: column;
      gap: 20px; // 为推荐组件之间添加间距

      // 可以为推荐组件添加统一的背景和圆角
      & > div {
        // 假设推荐组件是 div
        background-color: #fff;
        border-radius: 4px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
    }
  }
  .publish-btn {
    width: 56px;
    height: 56px;
    // background-color: #181b1b; // 使用 Element Plus 的 primary 颜色
    // border-radius: 28px; // el-button circle 属性会自动处理
    position: fixed;
    right: 40px; // 调整位置
    bottom: 40px; // 调整位置
    transition: all 0.3s;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); // 添加阴影
    font-size: 24px; // 调整图标大小

    &:hover {
      transform: scale(1.05); // 添加 hover 效果
    }
  }
}
</style>
