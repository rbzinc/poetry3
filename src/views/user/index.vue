<script setup>
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/modules/user.js'
import router from '@/router/index.js'
import { userLuntanSelectBlogGetApi } from '@/api/modules/talkSquare.js'
import { goUserEdit } from '@/router/helpers.js'
import { USER_BG_URL } from '@/constants/bgUrl.js'
import * as ROUTES from '@/constants/router.js'
import {
  Edit, MessageBox, Setting, Location, Loading, Close,
  TrophyBase, ChatDotSquare, Star, View, User, FolderOpened,
  ArrowRight, Check
} from '@element-plus/icons-vue'

// 状态管理
const state = ref({
  dialogVisible: false,
  pageNum: 1,
  pageSize: 6,
  activeIndex: '1',
  loading: false,
  hasMore: true,
})

const userStore = useUserInfoStore()
const userLuntanSelecttiezTypesData = ref([])
const scrollbarRef = ref(null)

// 判断用户是否登录
if (!userStore.userInfo) {
  ElMessage.error('请先登录！')
  router.push({ name: 'login' })
}

const achievement = ref([
  { icon: 'iconfont icon-zan', text: '获得过100次点赞' },
  { icon: 'iconfont icon-iconfontzhizuobiaozhun023130', text: '获得过50次分享' },
  { icon: 'iconfont icon-shoucang', text: '被收藏20次' },
  { icon: 'iconfont icon-pinglun', text: '获得过200次评论' },
  { icon: 'iconfont icon-icon-', text: '浏览量达到1000次' },
  { icon: 'iconfont icon-biaoqian', text: '被标记为有用10次' },
])

const myInterest = ref(['诗词创作', '诗词赏析', '诗词学习', '诗词活动', '诗词资源', '诗词杂谈'])

const interest = ref([
  { name: '诗词创作', active: true },
  { name: '诗词赏析', active: true },
  { name: '诗词学习', active: true },
  { name: '诗词活动', active: true },
  { name: '诗词资源', active: true },
  { name: '诗词杂谈', active: true },
])

// 加载更多数据
const loadMore = async () => {
  if (state.value.loading || !state.value.hasMore) return

  state.value.loading = true
  try {
    const res = await userLuntanSelectBlogGetApi(
      state.value.pageNum,
      state.value.pageSize,
      Number(userStore.userInfo.id),
    )
    if (res.data.records.length === 0) {
      state.value.hasMore = false
      return
    }
    userLuntanSelecttiezTypesData.value = [...userLuntanSelecttiezTypesData.value, ...res.data.records]
    state.value.pageNum++
  } catch (error) {
    console.error('加载失败：', error)
    ElMessage.error('加载失败，请重试')
  } finally {
    state.value.loading = false
  }
}

// 滚动处理
const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target
  if (scrollHeight - scrollTop - clientHeight < 50) {
    loadMore()
  }
}

// 移除兴趣
const removeInterest = (item) => {
  const indexInInterest = interest.value.findIndex((i) => i.name === item.name)
  if (indexInInterest > -1) {
    interest.value[indexInInterest].active = false
  }

  const indexInMyInterest = myInterest.value.indexOf(item.name)
  if (indexInMyInterest > -1) {
    myInterest.value.splice(indexInMyInterest, 1)
  }
}

// 关闭对话框
const handleDialogClose = () => {
  state.value.dialogVisible = false
  ElMessage.success('自定义兴趣领域成功')
}

// 管理文章
const goManageArticles = () => {
  router.push(ROUTES.USER_ARTICLES)
}

// 设置
const goSettings = () => {
  router.push(ROUTES.USER_SETTINGS)
}

// 查看文章详情
const goArticleDetail = (id) => {
  console.log(id)
  router.push({ path: ROUTES.FORUM_DETAIL, query: { id } })
}

// 内容截断处理
const truncatedContent = computed(() => {
  return userLuntanSelecttiezTypesData.value.map((item) => ({
    ...item,
    content: item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content,
  }))
})
console.log(userStore.userInfo)
onMounted(() => {
  loadMore()
})
</script>

<template>
  <div class="modern-user-center">
    <!-- 背景装饰 -->
    <div class="background-decoration" :style="{ backgroundImage: `url(${USER_BG_URL})` }"></div>
    
    <div class="container">
      <!-- 现代化用户信息卡片 -->
      <div class="modern-user-card">
        <!-- 渐变装饰背景 -->
        <div class="gradient-decoration"></div>
        
        <div class="user-card-content">
          <!-- 用户头像 -->
          <div class="user-avatar-wrapper">
            <div class="avatar-container">
              <div 
                class="user-avatar" 
                :class="{ 'has-image': userStore.userInfo.touxiang }"
                :style="userStore.userInfo.touxiang ? { backgroundImage: `url(${userStore.userInfo.touxiang})` } : {}"
              >
                <span v-if="!userStore.userInfo.touxiang" class="avatar-text">{{ userStore.userInfo.name?.slice(0, 2).toUpperCase() || 'U' }}</span>
              </div>
              <div class="avatar-border"></div>
            </div>
          </div>
          
          <!-- 用户信息 -->
          <div class="user-info-section">
            <div class="user-header">
              <h2 class="username">{{ userStore.userInfo.name }}</h2>
              <div class="user-location">
                <el-icon :size="14"><Location /></el-icon>
                <span>IP属地：江西省</span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
              <div class="action-buttons">
              <button class="action-btn primary" @click="goUserEdit">
                <el-icon :size="16"><Edit /></el-icon>
                <span>编辑资料</span>
              </button>
              <button class="action-btn secondary" @click="goManageArticles">
                <el-icon :size="16"><MessageBox /></el-icon>
                <span>管理文章</span>
              </button>
              <button class="action-btn secondary" @click="goSettings">
                <el-icon :size="16"><Setting /></el-icon>
                <span>设置</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 统计数据卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon view">
              <el-icon :size="24"><View /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">39,299</div>
              <div class="stat-label">访问量</div>
              </div>
            </div>
          
          <div class="stat-card">
            <div class="stat-icon article">
              <el-icon :size="24"><ChatDotSquare /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ userLuntanSelecttiezTypesData.length }}</div>
              <div class="stat-label">原创</div>
              </div>
              </div>
          
          <div class="stat-card">
            <div class="stat-icon fans">
              <el-icon :size="24"><User /></el-icon>
              </div>
            <div class="stat-content">
              <div class="stat-number">503</div>
              <div class="stat-label">粉丝</div>
              </div>
            </div>
          
          <div class="stat-card">
            <div class="stat-icon star">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">0</div>
              <div class="stat-label">铁粉</div>
            </div>
            </div>
          </div>
        </div>

      <div class="content-container">
        <!-- 左侧边栏 -->
        <aside class="sidebar">
          <!-- 兴趣领域卡片 -->
          <div class="modern-card interest-card">
            <div class="card-header">
              <div class="header-title">
                <el-icon :size="20" class="title-icon"><FolderOpened /></el-icon>
              <h3>兴趣领域</h3>
              </div>
              <button class="manage-btn" @click="state.dialogVisible = true">
                <span>管理</span>
                <el-icon :size="14"><ArrowRight /></el-icon>
              </button>
            </div>
            <div class="interest-tags">
              <div v-for="(item, index) in myInterest" :key="index" class="interest-tag">
                <span class="tag-dot"></span>
                <span>{{ item }}</span>
            </div>
              </div>
            </div>

          <!-- 个人成就卡片 -->
          <div class="modern-card achievement-card">
            <div class="card-header">
              <div class="header-title">
                <el-icon :size="20" class="title-icon"><TrophyBase /></el-icon>
            <h3>个人成就</h3>
              </div>
            </div>
            <div class="achievement-list">
            <div v-for="(item, index) in achievement" :key="index" class="achievement-item">
                <div class="achievement-icon">
              <i :class="item.icon"></i>
                </div>
                <span class="achievement-text">{{ item.text }}</span>
              </div>
            </div>
            </div>
        </aside>

        <!-- 主内容区 -->
        <main class="main-content">
          <div class="modern-card article-card">
            <!-- 导航标签 -->
            <div class="article-nav">
              <button
                v-for="(tab, index) in ['我的文章', '关注列表', '粉丝列表', '收藏列表']"
                :key="index"
                class="nav-tab"
                :class="{ active: state.activeIndex === String(index + 1) }"
                @click="state.activeIndex = String(index + 1)"
              >
                {{ tab }}
              </button>
            </div>

            <!-- 文章列表 -->
            <div class="article-list" @scroll="handleScroll" ref="scrollbarRef">
              <div 
                v-for="(item, index) in truncatedContent" 
                :key="index" 
                class="modern-article-item"
                @click="goArticleDetail(item.id)"
              >
                <div class="article-main">
                  <h3 class="article-title">{{ item.title }}</h3>
                  <p class="article-excerpt">{{ item.content }}</p>
                  <div class="article-meta">
                    <span class="meta-item">
                      <el-icon :size="14"><Star /></el-icon>
                      {{ item.liked }}
                    </span>
                    <span class="meta-item">
                      <el-icon :size="14"><ChatDotSquare /></el-icon>
                      {{ item.conmments }}
                    </span>
                    <span v-if="item.poemWord" class="meta-quote">
                      引用: "{{ item.poemWord }}"
                    </span>
                  </div>
                </div>
                <div v-if="item.images" class="article-thumbnail">
                  <img :src="item.images" alt="文章封面" />
                </div>
              </div>

              <div v-if="state.loading" class="loading-state">
                <el-icon class="loading-icon" :size="24"><Loading /></el-icon>
                <span>加载中...</span>
              </div>

              <div v-if="!state.hasMore && truncatedContent.length > 0" class="no-more-state">
                <span>没有更多内容了</span>
              </div>
              
              <div v-if="truncatedContent.length === 0 && !state.loading" class="empty-state">
                <el-icon :size="64" color="#BDC3C7"><FolderOpened /></el-icon>
                <p>还没有发布文章</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 兴趣设置对话框 -->
    <el-dialog v-model="state.dialogVisible" width="600px" class="modern-interest-dialog">
      <template #header>
        <div class="dialog-gradient-header">
          <el-icon :size="28"><FolderOpened /></el-icon>
          <span class="header-title">选择兴趣领域</span>
        </div>
      </template>
      
      <div class="dialog-body">
        <div class="interest-selector">
          <button
            v-for="(item, index) in interest"
            :key="index"
            class="interest-selector-item"
            :class="{ active: item.active }"
            @click="removeInterest(item)"
          >
            <span class="item-name">{{ item.name }}</span>
            <el-icon class="remove-icon"><Close /></el-icon>
          </button>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer-actions">
          <button class="footer-btn confirm-btn" @click="handleDialogClose">
            <el-icon><Check /></el-icon>
            <span>确定</span>
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
// 现代化用户中心
.modern-user-center {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8F9FA 0%, #ECF0F1 100%);
  position: relative;
  padding: 32px 0 60px;
  
  // 背景装饰
  .background-decoration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 320px;
  background-size: cover;
    background-position: center;
  background-attachment: fixed;
    opacity: 0.15;
    z-index: 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, transparent, #F8F9FA);
    }
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
}

// 现代化用户卡片
.modern-user-card {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  
  // 渐变装饰背景
  .gradient-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.08;
  }
  
  .user-card-content {
    position: relative;
        display: flex;
    gap: 32px;
    margin-bottom: 32px;
    
    // 用户头像
    .user-avatar-wrapper {
      .avatar-container {
        position: relative;
        width: 120px;
        height: 120px;

        .user-avatar {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 42px;
          font-weight: 700;
          
          &.has-image {
            .avatar-text {
              display: none;
            }
          }
          
          .avatar-text {
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
        }
        
        .avatar-border {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 26px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.2;
          z-index: -1;
        }
      }
    }
    
    // 用户信息
    .user-info-section {
          flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

          .user-header {
            .username {
          font-size: 32px;
          font-weight: 700;
          color: #2C3E50;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .user-location {
              display: flex;
          align-items: center;
          gap: 6px;
          color: #7F8C8D;
          font-size: 14px;
            }
          }

      // 操作按钮
      .action-buttons {
            display: flex;
        gap: 12px;
        margin-top: 20px;

        .action-btn {
              display: flex;
              align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            }
          }
          
          &.secondary {
            background: white;
            color: #7F8C8D;
            border: 2px solid #ECF0F1;
            
            &:hover {
              border-color: #667eea;
              color: #667eea;
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
  
  // 统计数据网格
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%);
      border-radius: 16px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #667eea;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
      }
      
      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        
        &.view {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
          color: #667eea;
        }
        
        &.article {
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
          color: #4A90E2;
        }
        
        &.fans {
          background: linear-gradient(135deg, rgba(245, 109, 154, 0.1) 0%, rgba(254, 97, 97, 0.05) 100%);
          color: #F56D9A;
        }
        
        &.star {
          background: linear-gradient(135deg, rgba(250, 208, 44, 0.1) 0%, rgba(255, 159, 64, 0.05) 100%);
          color: #FAD02C;
        }
      }
      
      .stat-content {
        flex: 1;
        
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
    }

// 内容容器
    .content-container {
      display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 1fr; // 让行高度一致
  gap: 24px;
  align-items: stretch; // 拉伸子元素填充整个网格区域
}

// 现代化卡片通用样式
.modern-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

          &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
    margin-bottom: 20px;
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .title-icon {
        color: #667eea;
      }

            h3 {
              margin: 0;
              font-size: 18px;
        font-weight: 600;
        color: #2C3E50;
      }
    }
    
    .manage-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #667eea;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
      }
    }
  }
}

// 侧边栏
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  // 兴趣领域卡片
  .interest-card {
    .interest-tags {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .interest-tag {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: #F8F9FA;
        border-radius: 12px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        
        .tag-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        &:hover {
          border-color: #667eea;
          transform: translateX(4px);
        }
      }
    }
  }
  
  // 个人成就卡片
  .achievement-card {
    .achievement-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

          .achievement-item {
            display: flex;
            align-items: center;
        gap: 12px;
        padding: 12px;
        background: #F8F9FA;
        border-radius: 12px;
        transition: all 0.3s ease;
        
        .achievement-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-radius: 8px;
          
          i {
              font-size: 18px;
            color: #667eea;
          }
        }
        
        .achievement-text {
          flex: 1;
          font-size: 14px;
          color: #2C3E50;
        }
        
        &:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.03) 100%);
          transform: translateX(4px);
        }
      }
    }
  }
}

// 主内容区
      .main-content {
        // 让文章卡片自动填充剩余高度
        display: flex;
        flex-direction: column;
        
        .article-card {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0; // 重要：允许flex item收缩
          
    // 导航标签
    .article-nav {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-bottom: 2px solid #ECF0F1;
      margin: -24px -24px 24px -24px;
      flex-shrink: 0; // 防止标签被压缩
      
      .nav-tab {
        padding: 10px 20px;
        background: transparent;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 500;
        color: #7F8C8D;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #F8F9FA;
          color: #2C3E50;
        }
        
        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      }
    }
    
    // 文章列表
    .article-list {
      flex: 1;
      overflow-y: auto;
      margin: -12px;
      padding: 12px;
      min-height: 0; // 重要：允许flex item收缩
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #BDC3C7;
        border-radius: 3px;
        
        &:hover {
          background: #7F8C8D;
        }
      }
      
      .modern-article-item {
            display: flex;
        gap: 20px;
            padding: 20px;
        background: white;
        border-radius: 16px;
        margin-bottom: 16px;
        border: 2px solid #ECF0F1;
        transition: all 0.3s ease;
        cursor: pointer;

            &:hover {
          border-color: #667eea;
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
            }

        .article-main {
              flex: 1;

          .article-title {
                font-size: 18px;
            font-weight: 600;
            color: #2C3E50;
            margin: 0 0 12px 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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
            gap: 20px;
            
            .meta-item {
                display: flex;
              align-items: center;
              gap: 6px;
              font-size: 13px;
              color: #BDC3C7;
            }
            
            .meta-quote {
              flex: 1;
              font-size: 13px;
              color: #667eea;
              font-style: italic;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
        }
        
        .article-thumbnail {
          width: 140px;
          height: 140px;
          border-radius: 12px;
              overflow: hidden;
          flex-shrink: 0;

          img {
                width: 100%;
                height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
        }
        
        &:hover .article-thumbnail img {
          transform: scale(1.1);
        }
      }
      
      // 加载状态
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 32px;
        color: #7F8C8D;

            .loading-icon {
          animation: spin 1s linear infinite;
          color: #667eea;
        }
      }
      
      // 没有更多
      .no-more-state {
        text-align: center;
        padding: 24px;
        color: #BDC3C7;
        font-size: 14px;
      }
      
      // 空状态
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 60px 20px;
        
        p {
          margin-top: 16px;
          color: #BDC3C7;
          font-size: 14px;
        }
      }
    }
  }
}

// 兴趣对话框
.modern-interest-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
    
    .el-dialog__header {
      padding: 0;
      margin: 0;
      border: none;
    }
    
    .el-dialog__body {
      padding: 0;
    }
    
    .el-dialog__footer {
      padding: 0;
      border: none;
    }
  }
  
  .dialog-gradient-header {
  display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .header-title {
      font-size: 20px;
      font-weight: 600;
    }
  }
  
  .dialog-body {
    padding: 32px;
    background: #F8F9FA;
    
    .interest-selector {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .interest-selector-item {
    display: flex;
    align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        background: white;
        border: 2px solid transparent;
        border-radius: 12px;
        font-size: 14px;
        color: #2C3E50;
    cursor: pointer;
    transition: all 0.3s ease;
        
        &:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

    &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          
          .remove-icon {
      color: white;
          }
        }
        
        .item-name {
          font-weight: 500;
    }

    .remove-icon {
          color: #BDC3C7;
          transition: color 0.3s ease;
          
          &:hover {
            color: #F56C6C;
          }
        }
      }
    }
  }
  
  .dialog-footer-actions {
    display: flex;
    justify-content: center;
    padding: 24px 32px;
    background: white;
    
    .footer-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 40px;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.confirm-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

      &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
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

// 响应式设计
@media (max-width: 992px) {
  .content-container {
    grid-template-columns: 1fr;
    
    .sidebar {
      order: 2;
    }
    
    .main-content {
      order: 1;
    }
  }
  
  .modern-user-card {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .modern-user-card {
    padding: 20px;
    
    .user-card-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .user-info-section {
        .action-buttons {
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .modern-article-item {
    flex-direction: column;
    
    .article-thumbnail {
      width: 100%;
      height: 200px;
    }
  }
}
</style>
