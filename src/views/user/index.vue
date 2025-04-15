<script setup>
import { computed, ref, onMounted } from 'vue'
import { ElCard, ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/modules/user.js'
import router from '@/router/index.js'
import { userLuntanSelectBlogGetApi } from '@/api/modules/talkSquare.js'
import { goUserEdit } from '@/router/helpers.js'
import { USER_BG_URL } from '@/constants/bgUrl.js'

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

// 内容截断处理
const truncatedContent = computed(() => {
  return userLuntanSelecttiezTypesData.value.map((item) => ({
    ...item,
    content: item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content,
  }))
})

onMounted(() => {
  loadMore()
})
</script>

<template>
  <div
    class="user-center"
    :style="{
      backgroundImage: `url(${USER_BG_URL})`,
    }"
  >
    <div class="container">
      <!-- 用户信息卡片 -->
      <el-card class="user-info-card" shadow="hover">
        <div class="user-info-wrapper">
          <div class="user-avatar">
            <img :src="userStore.userInfo.touxiang" alt="用户头像" />
          </div>
          <div class="user-detail">
            <div class="user-header">
              <h2 class="username">{{ userStore.userInfo.username }}</h2>
              <div class="action-buttons">
                <el-button @click="goUserEdit" round>
                  <el-icon><Edit /></el-icon>
                  编辑资料
                </el-button>
                <el-button round>
                  <el-icon><MessageBox /></el-icon>
                  管理文章
                </el-button>
                <el-button round>
                  <el-icon><Setting /></el-icon>
                  设置
                </el-button>
              </div>
            </div>
            <div class="user-stats">
              <div class="stat-item">
                <span class="number">39299</span>
                <span class="label">访问量</span>
              </div>
              <div class="stat-item">
                <span class="number">{{ userLuntanSelecttiezTypesData.length }}</span>
                <span class="label">原创</span>
              </div>
              <div class="stat-item">
                <span class="number">503</span>
                <span class="label">粉丝</span>
              </div>
              <div class="stat-item">
                <span class="number">0</span>
                <span class="label">铁粉</span>
              </div>
            </div>
            <div class="user-location">
              <i class="el-icon-location"></i>
              <span>IP属地：江西省</span>
            </div>
          </div>
        </div>
      </el-card>

      <div class="content-container">
        <!-- 左侧边栏 -->
        <aside class="sidebar">
          <el-card class="interest-card" shadow="hover">
            <div class="card-header">
              <h3>兴趣领域</h3>
              <el-button text type="primary" @click="state.dialogVisible = true">
                管理 <i class="el-icon-arrow-right"></i>
              </el-button>
            </div>
            <el-divider />
            <div class="interest-list">
              <div v-for="(item, index) in myInterest" :key="index" class="interest-item">
                {{ item }}
              </div>
            </div>
          </el-card>

          <el-card class="achievement-card" shadow="hover">
            <h3>个人成就</h3>
            <el-divider />
            <div v-for="(item, index) in achievement" :key="index" class="achievement-item">
              <i :class="item.icon"></i>
              <span>{{ item.text }}</span>
            </div>
          </el-card>
        </aside>

        <!-- 主内容区 -->
        <main class="main-content">
          <el-card class="article-card" shadow="hover">
            <template #header>
              <el-menu :default-active="state.activeIndex" mode="horizontal" class="nav-menu">
                <el-menu-item index="1">我的文章</el-menu-item>
                <el-menu-item index="2">关注列表</el-menu-item>
                <el-menu-item index="3">粉丝列表</el-menu-item>
                <el-menu-item index="4">收藏列表</el-menu-item>
              </el-menu>
            </template>

            <el-scrollbar height="540px" @scroll="handleScroll" ref="scrollbarRef">
              <div v-for="(item, index) in truncatedContent" :key="index" class="article-item">
                <div class="article-content">
                  <h3 class="title">{{ item.title }}</h3>
                  <p class="content">{{ item.content }}</p>
                  <div class="meta">
                    <span>赞 {{ item.liked }}</span>
                    <span>评 {{ item.conmments }}</span>
                    <span v-if="item.poemWord" class="quote"> 引用 "{{ item.poemWord }}" </span>
                  </div>
                </div>
                <div class="article-image">
                  <el-image :src="item.images" fit="cover" loading="lazy" />
                </div>
              </div>

              <div v-if="state.loading" class="loading-more">
                <el-icon class="loading-icon"><Loading /></el-icon>
                <span>加载中...</span>
              </div>

              <div v-if="!state.hasMore" class="no-more">没有更多内容了</div>
            </el-scrollbar>
          </el-card>
        </main>
      </div>
    </div>

    <!-- 兴趣设置对话框 -->
    <el-dialog v-model="state.dialogVisible" title="选择喜欢的兴趣领域" width="600px">
      <div class="interest-tags">
        <div v-for="(item, index) in interest" :key="index" class="interest-tag" :class="{ active: item.active }">
          {{ item.name }}
          <el-icon class="remove-icon" @click="removeInterest(item)">
            <Close />
          </el-icon>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleDialogClose"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-center {
  background-size: cover;
  background-attachment: fixed;
  padding: 20px 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .user-info-card {
      .user-info-wrapper {
        display: flex;
        gap: 20px;

        .user-avatar {
          img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            background-color: #409eff;
          }
        }

        .user-detail {
          flex: 1;

          .user-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            .username {
              font-size: 24px;
              font-weight: 500;
              margin: 0;
            }

            .action-buttons {
              display: flex;
              gap: 10px;
            }
          }

          .user-stats {
            display: flex;
            gap: 30px;
            margin-bottom: 15px;

            .stat-item {
              display: flex;
              flex-direction: column;
              align-items: center;

              .number {
                font-size: 20px;
                font-weight: 500;
                color: #333;
              }

              .label {
                font-size: 14px;
                color: #666;
              }
            }
          }

          .user-location {
            color: #666;
            font-size: 14px;

            i {
              margin-right: 5px;
            }
          }
        }
      }
    }

    .content-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
      margin-top: 20px;

      .sidebar {
        .interest-card,
        .achievement-card {
          margin-bottom: 20px;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-2px);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            h3 {
              margin: 0;
              font-size: 18px;
            }
          }

          .interest-list {
            .interest-item {
              padding: 8px 0;
              border-bottom: 1px solid #eee;

              &:last-child {
                border-bottom: none;
              }
            }
          }

          .achievement-item {
            display: flex;
            align-items: center;
            padding: 8px 0;

            i {
              margin-right: 10px;
              font-size: 18px;
              color: #409eff;
            }
          }
        }
      }

      .main-content {
        .article-card {
          .nav-menu {
            border-bottom: none;
          }

          .article-item {
            display: flex;
            padding: 20px;
            border-bottom: 1px solid #eee;
            transition: background-color 0.3s ease;

            &:hover {
              background-color: #f5f7fa;
            }

            .article-content {
              flex: 1;
              margin-right: 20px;

              .title {
                font-size: 18px;
                color: #333;
                margin: 0 0 10px;
              }

              .content {
                color: #666;
                line-height: 1.6;
                margin-bottom: 15px;
              }

              .meta {
                display: flex;
                gap: 15px;
                color: #999;
                font-size: 14px;

                .quote {
                  color: #409eff;
                }
              }
            }

            .article-image {
              width: 120px;
              height: 120px;
              border-radius: 4px;
              overflow: hidden;

              .el-image {
                width: 100%;
                height: 100%;
              }
            }
          }

          .loading-more {
            text-align: center;
            padding: 20px;
            color: #999;

            .loading-icon {
              animation: rotating 2s linear infinite;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .interest-tag {
    padding: 8px 15px;
    border-radius: 20px;
    background-color: #f5f7fa;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background-color: #409eff;
      color: white;
    }

    .remove-icon {
      font-size: 14px;

      &:hover {
        color: #f56c6c;
      }
    }
  }
}
</style>
