<script setup>
import { ref, computed, onMounted } from 'vue'
import { userLuntanSelecttiezTypesGetApi } from '@/api/modules/talkSquare.js'
import DayRecommend from '@/components/talksquare/DayRecommend/index.vue'
import ArticleRecommendation from '@/components/talksquare/ArticleRecommendation/index.vue'
import { goForumDetail, goForumEdit, goPoetClassDetail } from '@/router/helpers.js'
import { CirclePlusFilled } from '@element-plus/icons-vue'

// 状态管理
const state = ref({
  activeName: 'new',
  activeIndex: '1',
  pageSize: 5,
  currentPage: 1,
  nowMenuData: 1,
  totalPage: 1,
  userLuntanSelecttiezTypesData: [],
})

// 菜单配置
const menuData = ref([
  { id: '1', name: '诗词创作', icon: 'iconfont icon-chuangzuo' },
  { id: '2', name: '诗词赏析', icon: 'iconfont icon-shuhuashangxi' },
  { id: '3', name: '诗词学习', icon: 'iconfont icon-xinshouxuetang' },
  { id: '4', name: '诗词活动', icon: 'iconfont icon-huodong' },
  { id: '5', name: '诗词资源', icon: 'iconfont icon-ziyuan' },
  { id: '6', name: '诗词杂谈', icon: 'iconfont icon-zatan' },
])

// 计算属性
const truncatedContent = computed(() => {
  return state.value.userLuntanSelecttiezTypesData.map((item) => ({
    ...item,
    content: item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content,
  }))
})

// 方法
const handlePageChange = async (page) => {
  state.value.currentPage = page
  await fetchForumData()
}

const handleMenuClick = async (item) => {
  state.value.nowMenuData = item.id
  await fetchForumData()
}

const fetchForumData = async () => {
  try {
    const res = await userLuntanSelecttiezTypesGetApi(
      state.value.currentPage,
      state.value.pageSize,
      state.value.nowMenuData,
    )
    state.value.totalPage = res.data.total
    state.value.userLuntanSelecttiezTypesData = res.data.records
  } catch (error) {
    console.error('获取论坛数据失败：', error)
  }
}

onMounted(fetchForumData)
</script>

<template>
  <div class="forum-container">
    <div class="forum-content">
      <!-- 左侧菜单 -->
      <aside class="forum-sidebar">
        <el-menu mode="vertical" :default-active="state.activeIndex">
          <el-menu-item v-for="item in menuData" :key="item.id" :index="item.id" @click="handleMenuClick(item)">
            <i :class="item.icon" />
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 中间内容区 -->
      <main class="forum-main">
        <el-tabs v-model="state.activeName">
          <el-tab-pane label="最新" name="new">
            <div class="article-list">
              <div
                v-for="(item, index) in truncatedContent"
                :key="index"
                class="article-item"
                @click="goForumDetail(item.id)"
              >
                <div class="article-content">
                  <h3 class="title">{{ item.title }}</h3>
                  <p class="content">{{ item.content }}</p>
                  <div class="meta">
                    <span class="author">作者: {{ item.username }}</span>
                    <span class="likes">赞 {{ item.liked }}</span>
                    <span class="comments">评 {{ item.conmments }}</span>
                    <span v-if="item.poemWord" class="quote" @click.stop="goPoetClassDetail(item.poemId)">
                      引用 "{{ item.poemWord }}"
                    </span>
                  </div>
                </div>
                <div class="article-image">
                  <el-image :src="item.images" fit="cover" loading="lazy" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="最热" name="heat">
            <!-- 最热内容待实现 -->
          </el-tab-pane>
        </el-tabs>

        <el-pagination
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

<style lang="scss" scoped>
.forum-container {
  min-height: 100vh;
  background-image: url('@/assets/pic/forum/c0b5d3eab10bd3a732987c09aff12b7.jpg');
  background-size: cover;
  background-attachment: fixed;

  .forum-content {
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    gap: 20px;
    border-radius: 8px;
    padding: 20px;

    .forum-sidebar {
      .el-menu-item {
        i {
          margin-right: 8px;
          font-size: 18px;
        }
      }
    }

    .forum-main {
      .article-list {
        .article-item {
          display: flex;
          padding: 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #f5f7fa;
          }

          .article-content {
            flex: 1;
            margin-right: 20px;

            .title {
              font-size: 18px;
              color: #333;
              margin-bottom: 10px;
            }

            .content {
              color: #666;
              line-height: 1.6;
              margin-bottom: 15px;
            }

            .meta {
              display: flex;
              align-items: center;
              gap: 15px;
              color: #999;

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
      }

      .pagination {
        margin-top: 30px;
        display: flex;
        justify-content: center;
      }
    }
  }
  .publish-btn {
    width: 56px;
    height: 56px;
    background-color: #181b1b;
    border-radius: 28px;
    position: fixed;
    right: 30px;
    bottom: 30px;
    transition: all 0.3s;
    cursor: pointer;
  }
}
</style>
