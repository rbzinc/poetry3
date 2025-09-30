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
  <div class="forum-container">
    <!-- 背景装饰 -->
    <div class="background-decoration" :style="{ backgroundImage: `url(${FORUM_BG})` }"></div>

    <!-- 页面头部 -->
    <div class="forum-header">
      <div class="header-content">
        <div class="header-title">
          <el-icon class="title-icon"><ChatLineSquare /></el-icon>
          <div>
            <h1>诗词论坛</h1>
            <p class="subtitle">分享交流，品味诗词文化之美</p>
          </div>
        </div>
        
        <!-- 分类标签 -->
        <div class="category-tabs">
          <div
            v-for="item in menuData"
            :key="item.id"
            class="category-tab"
            :class="{ active: state.activeIndex === item.id }"
            @click="handleMenuClick(item)"
          >
            <i :class="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="forum-content">
      <!-- 左侧内容区 -->
      <main class="forum-main" v-loading="state.isLoading">
        <!-- 排序标签 -->
        <div class="sort-tabs">
          <div
            class="sort-tab"
            :class="{ active: state.activeName === 'new' }"
            @click="state.activeName = 'new'"
          >
            <el-icon><Clock /></el-icon>
            <span>最新</span>
          </div>
          <div
            class="sort-tab"
            :class="{ active: state.activeName === 'heat' }"
            @click="state.activeName = 'heat'"
          >
            <el-icon><TrendCharts /></el-icon>
            <span>最热</span>
          </div>
        </div>

        <!-- 帖子列表 -->
        <div v-if="state.activeName === 'new'">
          <el-empty v-if="state.isError" description="加载失败，请稍后重试" />
          <el-empty v-else-if="isListEmpty" description="暂无帖子" />
          <div v-else class="article-list">
            <div v-for="item in truncatedContent" :key="item.id" class="article-card" @click="goForumDetail(item.id)">
              <div class="card-content">
                <div class="card-header">
                  <h3 class="title">{{ item.title }}</h3>
                  <div class="author-info">
                    <span class="author-name">{{ item.username }}</span>
                    <span class="post-time">发布于 {{ item.createTime || '最近' }}</span>
                  </div>
                </div>
                
                <p class="content">{{ item.content }}</p>
                
                <div class="card-footer">
                  <div class="meta-left">
                    <span class="meta-item likes">
                      <el-icon><Star /></el-icon>
                      {{ item.liked }}
                    </span>
                    <span class="meta-item comments">
                      <el-icon><ChatDotRound /></el-icon>
                      {{ item.conmments }}
                    </span>
                    <span
                      v-if="item.poemWord && item.poemId"
                      class="meta-item quote"
                      @click.stop="goPoetClassDetail(item.poemId)"
                    >
                      <el-icon><Document /></el-icon>
                      {{ item.poemWord }}
                    </span>
                  </div>
                  
                  <div v-if="item.images" class="article-thumbnail">
                    <el-image :src="item.images" fit="cover" loading="lazy">
                      <template #error>
                        <div class="image-error">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最热功能开发中 -->
        <div v-else-if="state.activeName === 'heat'" class="empty-state">
          <el-empty description="最热功能正在开发中..." />
        </div>

        <!-- 分页 -->
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

      <!-- 右侧推荐 -->
      <aside class="forum-aside">
        <ArticleRecommendation />
        <DayRecommend />
      </aside>
    </div>

    <!-- 发布按钮 -->
    <el-button class="publish-btn" type="primary" circle @click="goForumEdit">
      <el-icon><CirclePlusFilled /></el-icon>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.forum-container {
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
    opacity: 0.03;
    z-index: 0;
  }

  // 页面头部
  .forum-header {
    position: relative;
    z-index: 1;
    background: white;
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 40px;

      .header-title {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 28px;

        .title-icon {
          font-size: 48px;
          color: #667eea;
          filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3));
        }

        h1 {
          margin: 0 0 4px 0;
          font-size: 32px;
          font-weight: 700;
          color: #333;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
          color: #999;
        }
      }

      .category-tabs {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .category-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #f5f5f5;
          border-radius: 12px;
          font-size: 15px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;

          i {
            font-size: 18px;
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

  // 主要内容区
  .forum-content {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 40px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 30px;

    .forum-main {
      // 排序标签
      .sort-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;

        .sort-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 16px;
          }

          &:hover {
            border-color: #667eea;
            color: #667eea;
          }

          &.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
        }
      }

      // 帖子列表
      .article-list {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .article-card {
          position: relative;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15);

            &::before {
              opacity: 1;
            }

            .title {
              color: #667eea;
            }
          }

          .card-content {
            padding: 24px;

            .card-header {
              margin-bottom: 16px;

              .title {
                margin: 0 0 12px 0;
                font-size: 20px;
                font-weight: 600;
                color: #333;
                transition: color 0.3s ease;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.5;
              }

              .author-info {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 13px;

                .author-name {
                  color: #667eea;
                  font-weight: 500;
                }

                .post-time {
                  color: #999;
                }
              }
            }

            .content {
              color: #666;
              line-height: 1.8;
              margin-bottom: 16px;
              font-size: 14px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .card-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 16px;
              border-top: 1px solid #f0f0f0;

              .meta-left {
                display: flex;
                gap: 20px;
                align-items: center;

                .meta-item {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 14px;
                  color: #999;
                  transition: color 0.3s ease;

                  .el-icon {
                    font-size: 16px;
                  }

                  &.likes:hover {
                    color: #f39c12;
                  }

                  &.comments:hover {
                    color: #667eea;
                  }

                  &.quote {
                    color: #667eea;
                    cursor: pointer;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &:hover {
                      color: #764ba2;
                      text-decoration: underline;
                    }
                  }
                }
              }

              .article-thumbnail {
                width: 80px;
                height: 80px;
                border-radius: 12px;
                overflow: hidden;
                flex-shrink: 0;

                .el-image {
                  width: 100%;
                  height: 100%;
                  display: block;
                }

                .image-error {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                  color: #667eea;
                  font-size: 24px;
                }
              }
            }
          }
        }
      }

      .empty-state {
        background: white;
        border-radius: 16px;
        padding: 60px 20px;
        text-align: center;
      }

      .pagination {
        margin-top: 32px;
        display: flex;
        justify-content: center;
      }
    }

    // 右侧边栏
    .forum-aside {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  // 发布按钮
  .publish-btn {
    width: 64px;
    height: 64px;
    position: fixed;
    right: 40px;
    bottom: 40px;
    font-size: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    z-index: 999;

    &:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    }

    &:active {
      transform: translateY(-2px) scale(1.02);
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .forum-container {
    .forum-header {
      .header-content {
        padding: 24px 20px;
      }
    }

    .forum-content {
      grid-template-columns: 1fr;
      padding: 20px;

      .forum-aside {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .forum-container {
    .forum-header {
      .header-content {
        padding: 20px 15px;

        .header-title {
          .title-icon {
            font-size: 36px;
          }

          h1 {
            font-size: 24px;
          }
        }

        .category-tabs {
          gap: 8px;

          .category-tab {
            padding: 8px 16px;
            font-size: 13px;

            i {
              font-size: 16px;
            }
          }
        }
      }
    }

    .forum-content {
      padding: 15px;

      .forum-main {
        .sort-tabs {
          gap: 8px;

          .sort-tab {
            padding: 8px 16px;
            font-size: 13px;
          }
        }

        .article-list {
          gap: 15px;

          .article-card {
            .card-content {
              padding: 20px;

              .card-header {
                .title {
                  font-size: 18px;
                }
              }

              .content {
                font-size: 13px;
              }

              .card-footer {
                flex-direction: column-reverse;
                gap: 16px;
                align-items: flex-start;

                .meta-left {
                  width: 100%;
                  flex-wrap: wrap;
                }

                .article-thumbnail {
                  align-self: flex-end;
                }
              }
            }
          }
        }
      }
    }

    .publish-btn {
      width: 56px;
      height: 56px;
      right: 20px;
      bottom: 20px;
      font-size: 24px;
    }
  }
}
</style>
