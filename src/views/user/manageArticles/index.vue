<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserInfoStore } from '@/stores/modules/user.js'
import { userLuntanSelectBlogGetApi } from '@/api/modules/talkSquare.js'
import * as ROUTES from '@/constants/router.js'
import {
  Edit, Delete, View, Star, ChatDotSquare, Search,
  Calendar, ArrowLeft, TrendCharts, Document, Loading
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserInfoStore()

// 状态管理
const state = ref({
  searchQuery: '',
  activeTab: 'all', // all, published, draft
  sortBy: 'time', // time, views, likes
  loading: false,
  hasMore: true,
  pageNum: 1,
  pageSize: 50
})

// 文章列表 - 从API获取
const articles = ref([])

// 加载文章数据
const loadArticles = async () => {
  if (state.value.loading) return
  
  state.value.loading = true
  try {
    const res = await userLuntanSelectBlogGetApi(
      state.value.pageNum,
      state.value.pageSize,
      Number(userStore.userInfo.id)
    )
    
    if (res.data && res.data.records) {
      articles.value = res.data.records
      state.value.hasMore = res.data.records.length >= state.value.pageSize
    } else {
      articles.value = []
      state.value.hasMore = false
    }
  } catch (error) {
    console.error('加载文章失败：', error)
    ElMessage.error('加载文章失败，请重试')
  } finally {
    state.value.loading = false
  }
}

// 过滤后的文章列表
const filteredArticles = computed(() => {
  let result = articles.value

  // 搜索筛选
  if (state.value.searchQuery) {
    const query = state.value.searchQuery.toLowerCase()
    result = result.filter(item =>
      item.title?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    )
  }

  // 排序
  if (state.value.sortBy === 'views') {
    result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0))
  } else if (state.value.sortBy === 'likes') {
    result = [...result].sort((a, b) => (b.liked || 0) - (a.liked || 0))
  } else {
    result = [...result].sort((a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0))
  }

  return result
})

// 统计数据
const statistics = computed(() => ({
  total: articles.value.length,
  published: articles.value.length, // API返回的都是已发布的
  draft: 0, // 暂无草稿功能
  totalViews: articles.value.reduce((sum, a) => sum + (a.views || 0), 0),
  totalLikes: articles.value.reduce((sum, a) => sum + (a.liked || 0), 0)
}))

// 返回个人中心
const goBack = () => {
  router.push(ROUTES.USER)
}

// 新建文章
const createArticle = () => {
  router.push(ROUTES.FORUM_EDIT)
}

// 编辑文章
const editArticle = (id) => {
  router.push({ path: ROUTES.FORUM_EDIT, query: { id } })
}

// 查看文章
const viewArticle = (id) => {
  router.push({ path: ROUTES.FORUM_DETAIL, query: { id } })
}

// 删除文章
const deleteArticle = (id) => {
  ElMessageBox.confirm(
    '确定要删除这篇文章吗？删除后无法恢复。',
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = articles.value.findIndex(a => a.id === id)
    if (index > -1) {
      articles.value.splice(index, 1)
      ElMessage.success('文章已删除')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 发布/取消发布
const togglePublish = (article) => {
  // TODO: 调用发布/取消发布API
  ElMessage.info('发布功能开发中...')
}

// 组件挂载时加载数据
onMounted(() => {
  loadArticles()
})
</script>

<template>
  <div class="manage-articles-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left">
        <el-button class="back-btn" @click="goBack" circle>
          <el-icon :size="20"><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-title">
          <h1>文章管理</h1>
          <p class="subtitle">管理您的所有文章内容</p>
        </div>
      </div>
      <el-button type="primary" size="large" @click="createArticle">
        <el-icon><Edit /></el-icon>
        <span>新建文章</span>
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <el-icon :size="28"><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.total }}</div>
          <div class="stat-label">全部文章</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon published">
          <el-icon :size="28"><ChatDotSquare /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.published }}</div>
          <div class="stat-label">已发布</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon draft">
          <el-icon :size="28"><Edit /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.draft }}</div>
          <div class="stat-label">草稿</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon views">
          <el-icon :size="28"><View /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.totalViews.toLocaleString() }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon likes">
          <el-icon :size="28"><Star /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.totalLikes }}</div>
          <div class="stat-label">总点赞数</div>
        </div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="filter-bar">
      <div class="filter-title">
        <h3>全部文章 ({{ statistics.total }})</h3>
      </div>

      <div class="filter-actions">
        <el-input
          v-model="state.searchQuery"
          placeholder="搜索文章标题或内容..."
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="state.sortBy" placeholder="排序方式" class="sort-select">
          <el-option label="按时间排序" value="time" />
          <el-option label="按浏览量排序" value="views" />
          <el-option label="按点赞数排序" value="likes" />
        </el-select>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-list">
      <!-- 加载状态 -->
      <div v-if="state.loading" class="loading-state">
        <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredArticles.length === 0" class="empty-state">
        <el-icon :size="64" color="#BDC3C7"><Document /></el-icon>
        <p>暂无文章</p>
        <el-button type="primary" @click="createArticle">创建第一篇文章</el-button>
      </div>

      <!-- 文章列表 -->
      <div v-else class="article-items">
        <div v-for="article in filteredArticles" :key="article.id" class="article-item">
          <div class="article-main" @click="viewArticle(article.id)">
            <div class="article-info">
              <div class="article-header">
                <h3 class="article-title">{{ article.title }}</h3>
                <el-tag type="success" size="small">已发布</el-tag>
              </div>
              
              <p class="article-excerpt">{{ article.content }}</p>
              
              <div class="article-meta">
                <span class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  {{ article.createTime }}
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ article.views || 0 }}
                </span>
                <span class="meta-item">
                  <el-icon><Star /></el-icon>
                  {{ article.liked || 0 }}
                </span>
                <span class="meta-item">
                  <el-icon><ChatDotSquare /></el-icon>
                  {{ article.conmments || 0 }}
                </span>
                <div v-if="article.poemWord" class="article-quote">
                  <el-tag size="small" type="info">引用: "{{ article.poemWord }}"</el-tag>
                </div>
              </div>
            </div>
            
            <div v-if="article.images" class="article-thumbnail">
              <img :src="article.images" alt="文章封面" />
            </div>
          </div>

          <div class="article-actions">
            <el-button size="small" @click.stop="viewArticle(article.id)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button size="small" @click.stop="editArticle(article.id)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click.stop="deleteArticle(article.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.manage-articles-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8F9FA 0%, #ECF0F1 100%);
  padding: 32px;

  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .back-btn {
        background: white;
        border: 2px solid #ECF0F1;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
          transform: translateX(-4px);
        }
      }

      .header-title {
        h1 {
          margin: 0 0 6px 0;
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
          color: #7F8C8D;
        }
      }
    }
  }

  // 统计卡片网格
  .statistics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 12px;

        &.total {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
          color: #667eea;
        }

        &.published {
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
          color: #4A90E2;
        }

        &.draft {
          background: linear-gradient(135deg, rgba(250, 208, 44, 0.1) 0%, rgba(255, 159, 64, 0.05) 100%);
          color: #FAD02C;
        }

        &.views {
          background: linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(142, 68, 173, 0.05) 100%);
          color: #9B59B6;
        }

        &.likes {
          background: linear-gradient(135deg, rgba(245, 109, 154, 0.1) 0%, rgba(254, 97, 97, 0.05) 100%);
          color: #F56D9A;
        }
      }

      .stat-content {
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #2C3E50;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #7F8C8D;
        }
      }
    }
  }

  // 筛选栏
  .filter-bar {
    background: white;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    .filter-title {
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #2C3E50;
      }
    }

    .filter-actions {
      display: flex;
      gap: 12px;

      .search-input {
        width: 280px;
      }

      .sort-select {
        width: 160px;
      }
    }
  }

  // 文章列表
  .articles-list {
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

      .loading-icon {
        animation: spin 1s linear infinite;
        color: #667eea;
      }

      p {
        margin-top: 16px;
        color: #7F8C8D;
        font-size: 16px;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

      p {
        margin: 16px 0 24px 0;
        color: #BDC3C7;
        font-size: 16px;
      }
    }

    .article-items {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .article-item {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .article-main {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          cursor: pointer;

          .article-info {
            flex: 1;

            .article-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;

              .article-title {
                flex: 1;
                font-size: 20px;
                font-weight: 600;
                color: #2C3E50;
                margin: 0;
                transition: color 0.3s ease;

                &:hover {
                  color: #667eea;
                }
              }
            }

            .article-excerpt {
              font-size: 14px;
              color: #7F8C8D;
              line-height: 1.6;
              margin: 0 0 16px 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

              .article-meta {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;

                .meta-item {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 13px;
                  color: #BDC3C7;
                }

                .article-quote {
                  flex: 1;
                  min-width: 200px;
                }
              }
          }

          .article-thumbnail {
            width: 160px;
            height: 120px;
            border-radius: 12px;
            overflow: hidden;
            flex-shrink: 0;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }

            &:hover img {
              transform: scale(1.1);
            }
          }
        }

        .article-actions {
          display: flex;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #ECF0F1;
        }
      }
    }
  }
}

// 旋转动画
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 响应式
@media (max-width: 768px) {
  .manage-articles-page {
    padding: 16px;

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .filter-bar {
      flex-direction: column;
      align-items: stretch;

      .filter-actions {
        flex-direction: column;

        .search-input,
        .sort-select {
          width: 100%;
        }
      }
    }

    .article-item .article-main {
      flex-direction: column;

      .article-thumbnail {
        width: 100%;
        height: 200px;
      }
    }
  }
}
</style>

