<script setup>
import {ref} from "vue";
import common from './comment/index.vue';
import Markdown from './markdown/index.vue'
import {useRoute} from 'vue-router';
import {
  userLuntanDianzanGetApi,
  userLuntanDianzanrankGetApi, userLuntanGuanzhuGetApi,
  userLuntanIsguanzhuGetApi, userLuntanSelectConmmetsGetApi,
  userLuntanSelectxiangxiGetApi
} from "@/api/modules/talkSquare.js";

const momentId = ref(1); // 评论区的 momentId
const postAddCommentForm = ref([]); // 评论区的表单
const route = useRoute();
const blogid = ref(route.params.id);
const userId = ref(1)
const userLuntanXiangxi = ref({}) // 论坛详情页面的用户信息
const userLuntanDianzanrankData = ref([]) // 论坛详情页面的点赞排行榜
const isFollowed = ref(false) // 关注状态
const content = ref('') // 文章内容
// 定义反应式数据，用于存储文章信息以及目录内容
const data = ref({
  title: '陶瓷艺术的创新之路',
  author: 'CulturalHeritage',
  date: '2024-10-14',
  like: 66,
  isLiked: false,
});

// 关注功能的方法
// TODO 关注功能后台有BUG 无论传的是true还是false 都是关注成功
const updateFollow = async() => {
  const res = await userLuntanGuanzhuGetApi(userId.value, isFollowed.value)
  isFollowed.value = res.data === '关注成功';
}

// TODO 拿到的userId是空字符串  并且有follow功能但是没有数量
const userLuntanSelectxiangxi = async () => {
  const res = await userLuntanSelectxiangxiGetApi(blogid.value)
  console.log(res)
  userLuntanXiangxi.value = res.data
  content.value = res.data.content
  userId.value = res.data.userId
}

// TODO 点赞功能后台有BUG
const updateLike = async () => {
  const res = await userLuntanDianzanGetApi(blogid.value)
  if(res.data === '点赞成功') {
    userLuntanXiangxi.value.blogLike = !userLuntanXiangxi.value.blogLike
    userLuntanXiangxi.value.liked += 1
  }else if(res.data === '点过了'){
    userLuntanXiangxi.value.liked -= 1
    userLuntanXiangxi.value.blogLike = !userLuntanXiangxi.value.blogLike
  }
}

const userLuntanDianzanrank = async () => {
  const res = await userLuntanDianzanrankGetApi(blogid.value)
  userLuntanDianzanrankData.value = res.data
}

const userLuntanIsguanzhu = async () => {
  const res = await userLuntanIsguanzhuGetApi(userId.value)
  console.log(res)
  isFollowed.value = res.msg !== '未关注'
}

const userLuntanSelectConmmets = async () => {
  const res = await userLuntanSelectConmmetsGetApi(blogid.value)
  postAddCommentForm.value = res.data

}
onMounted(()=>{
  userLuntanSelectxiangxi()
  userLuntanDianzanrank()
  // userLuntanIsguanzhu()

})

nextTick(async() => {
  await userLuntanSelectConmmets()
})
</script>

<template>
  <div class="layout-container">
    <div style="width: 74%;">
      <el-card class="article-card">
        <div class="article-info">
          <h1 class="article-title">{{ userLuntanXiangxi.title }}</h1>
          <p class="article-meta">作者: {{ userLuntanXiangxi.username }} · {{ userLuntanXiangxi.createTime }} · 点赞量 {{ userLuntanXiangxi.liked }}</p>
          <p class="article-quote">{{ userLuntanXiangxi.poemWord }}</p>
        </div>
        <div style="margin-top: 20px; padding: 0 20px;">
          <Markdown :content='content' />
        </div>
      </el-card>
      <common :momentId="momentId" :postAddCommentForm="postAddCommentForm"/>
    </div>

    <div class="author-container" style="width: 24%;">
      <el-card class="author-card">
        <div class="author-info">
          <img src="https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/tx.png" alt="Avatar" class="author-avatar"/>
          <div>
            <h3 style="margin-bottom: 5px;">{{ data.author }}</h3>
            <p>年度资深创作者</p>
          </div>
        </div>
        <div class="author-stats">
          <div class="author-content">
            <p>8 文章</p>
            <p>{{ data.like }} 粉丝</p>
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
            <div v-for="item in userLuntanDianzanrankData" :key="item.id" style="display: flex; align-items: center; margin-bottom: 10px">
              <img :src="item.touxiang" style="width: 40px; height: 40px; border-radius: 50%;">
              <p style="margin-left: 12px; font-size: 17px;">{{ item.name }}</p>
            </div>
          </div>
          <div v-else style="display: flex; align-items: center; margin-bottom: 10px">
            暂无用户点赞
          </div>
        </div>
      </el-card>

      <el-card class="contents-card">
        <div>
          <h2>相关文章</h2>
        </div>
        <el-divider style="margin: 16px 0"/>
        <div v-for="(item, index) in 5" :key="index" style="margin-bottom: 16px; margin-left: 5px; cursor: pointer;">
          <h3 style="margin-bottom: 10px;">这是文章标题</h3>
          <div style="display: flex; color: #666;">
            <p style="margin-right: 16px;">阅读量123 · </p>
            <p>点赞量31</p>
          </div>
        </div>
      </el-card>

      <el-card class="contents-card">
        <template #header>
          <span>今日古诗推荐</span>
        </template>
        <p>我是一个大帅哥</p>
        <p>我是一个大帅哥</p>
        <p>我是一个大帅哥</p>
        <p>我是一个大帅哥</p>
      </el-card>
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
