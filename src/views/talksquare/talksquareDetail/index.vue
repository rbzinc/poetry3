<script setup>
import {ref} from "vue";
import common from './comment/index.vue';
import Markdown from './markdown/index.vue'
import {useRoute} from 'vue-router';
import DayRecommend from '@/components/talksquare/DayRecommend/index.vue'
import ArticleRecommentDation from '@/components/talksquare/ArticleRecommendation/index.vue'
import {
  userLuntanDianzanGetApi,
  userLuntanDianzanrankGetApi,
  userLuntanGuanzhuGetApi,
  userLuntanIsguanzhuGetApi,
  userLuntanSelectConmmetsGetApi,
  userLuntanSelectxiangxiGetApi
} from "@/api/modules/talkSquare.js";
const pageContentMarkShow = ref(false); // 评论和内容展示状态
// const momentId = ref(1); // 评论区的 momentId
const postAddCommentForm = ref([]); // 评论区的表单
const route = useRoute();
const blogid = ref(route.params.id);
const userId = ref('') // 论坛详情页面的用户id
const userLuntanXiangxi = ref({}) // 论坛详情页面的用户信息
const userLuntanDianzanrankData = ref([]) // 论坛详情页面的点赞排行榜
const isFollowed = ref(false) // 关注状态
const content = ref('') // 文章内容
const comments = ref('') // 文章评论数量
/**
 * 更新关注状态
 * @returns {Promise<void>}
 */
const updateFollow = async () => {
  isFollowed.value =!isFollowed.value
  const res = await userLuntanGuanzhuGetApi(userId.value, isFollowed.value)
  if (res.data === '关注成功') {
    isFollowed.value = true
  } else if (res.data === '取消成功') {
    isFollowed.value = false
  }
}

/**
 * 获取论坛详情页面的用户信息
 * @returns {Promise<void>}
 */
const userLuntanSelectxiangxi = async () => {
  const res = await userLuntanSelectxiangxiGetApi(blogid.value)
  userId.value = res.data.userId
  userLuntanXiangxi.value = res.data
  content.value = res.data.content
  pageContentMarkShow.value = true
  comments.value = res.data.conmments
  // 等页面渲染之后再调用这个函数
  await userLuntanIsguanzhu();
}

/**
 *  更新点赞状态
 * @returns {Promise<void>}
 */
const updateLike = async () => {
  const res = await userLuntanDianzanGetApi(blogid.value)
  // console.log(res)
  await userLuntanDianzanrank();
  if (res.data === '点赞成功') {
    userLuntanXiangxi.value.blogLike = !userLuntanXiangxi.value.blogLike
    userLuntanXiangxi.value.liked += 1
  }
    if (res.data === '点赞取消') {
    userLuntanXiangxi.value.blogLike = !userLuntanXiangxi.value.blogLike
    userLuntanXiangxi.value.liked -= 1
  }

}

/**
 * 获取论坛详情页面的点赞排行榜
 * @returns {Promise<void>}
 */
const userLuntanDianzanrank = async () => {
  const res = await userLuntanDianzanrankGetApi(blogid.value)
  userLuntanDianzanrankData.value = res.data
}

/**
 * 获取关注状态
 * @returns {Promise<void>}
 */
const userLuntanIsguanzhu = async () => {
  const res = await userLuntanIsguanzhuGetApi(userId.value)
  if (res.data === '已关注') {
    isFollowed.value = true
  } else if (res.data === '未关注') {
    isFollowed.value = false
  }
}

/**
 * 获取评论区数据
 * @returns {Promise<void>}
 */
const userLuntanSelectConmmets = async () => {
  const res = await userLuntanSelectConmmetsGetApi(blogid.value)
  postAddCommentForm.value = res.data
}

onMounted(() => {
  userLuntanSelectxiangxi()
  userLuntanSelectConmmets();
  userLuntanDianzanrank();
});


</script>

<template>
  <div class="layout-container">
    <div style="width: 74%;">
      <el-card class="article-card">
        <div class="article-info">
          <h1 class="article-title">{{ userLuntanXiangxi.title }}</h1>
          <p class="article-meta">作者: {{ userLuntanXiangxi.username }} · {{ userLuntanXiangxi.createTime }} · 点赞量
            {{ userLuntanXiangxi.liked }}</p>
          <p class="article-quote">{{ userLuntanXiangxi.poemWord }}</p>
        </div>
        <div style="margin-top: 20px; padding: 0 20px; height: 100%;">
          <Markdown v-if="pageContentMarkShow" :content='content' />

        </div>
      </el-card>
      <common v-if="pageContentMarkShow" :comments="comments" />
    </div>

    <div class="author-container" style="width: 24%;">
      <el-card class="author-card">
        <div class="author-info">
          <img :src="userLuntanXiangxi.touxiang" alt="Avatar" class="author-avatar"/>
          <div>
            <h3 style="margin-bottom: 5px;">{{ userLuntanXiangxi.username }}</h3>
            <p>{{ userLuntanXiangxi.nameTager }}</p>
          </div>
        </div>
        <div class="author-stats">
          <div class="author-content">
            <p>{{ userLuntanXiangxi.liked }} 点赞量</p>
            <p>{{ userLuntanXiangxi.fans }} 粉丝</p>
          </div>
          <div class="buttons">
            <el-button type="primary" @click="updateFollow" style="height: 40px; width: 120px;">
              {{ isFollowed ? '取消关注' : '关注' }}
            </el-button>
            <el-button size="large" style="height: 40px; width: 120px;" @click="updateLike">
              {{ userLuntanXiangxi.blogLike ? '取消点赞' : '点赞' }}
            </el-button>
          </div>
        </div>
      </el-card>

      <el-card class="contents-card">
        <template #header>
          <span>文章前五名点赞列表</span>
        </template>
        <div>
          <div v-if="userLuntanDianzanrankData.length > 0">
            <div v-for="item in userLuntanDianzanrankData" :key="item.id"
                 style="display: flex; align-items: center; margin-bottom: 10px">
              <img :src="item.touxiang" style="width: 40px; height: 40px; border-radius: 50%;">
              <p style="margin-left: 12px; font-size: 17px;">{{ item.name }}</p>
            </div>
          </div>
          <div v-else style="display: flex; align-items: center; margin-bottom: 10px">
            暂无用户点赞
          </div>
        </div>
      </el-card>

     <ArticleRecommentDation />

     <DayRecommend style="margin-top: 30px;"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  padding: 0 100px;
  justify-content: space-between;
  margin-top: 30px;

  .article-card {
    .article-title {
      justify-content: center;
      display: flex;
      font-size: 24px;
      font-weight: bold;
    }

    .article-meta {
      justify-content: center;
      display: flex;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .article-quote {
      display: flex;
      justify-content: center;
    }
  }

  .author-container {
    .author-card {
      height: 220px;

      .author-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .author-avatar {
          border-radius: 50%;
          margin-right: 12px;
          width: 80px;
          height: 80px;
        }

        h3 {
          margin: 0;
          font-size: 18px;
        }

        p {
          color: #666;
        }
      }

      .author-stats {
        .author-content {
          display: flex;
          justify-content: space-around;
          font-size: 16px;
        }

        p {
          margin: 5px 0;
          font-weight: bold;
        }

        .buttons {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
        }
      }
    }

    .contents-card {
      margin-top: 30px;
    }
  }
}
</style>
