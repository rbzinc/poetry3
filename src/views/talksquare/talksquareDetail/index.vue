<script setup>
import { ref } from "vue";
import common from './comment/index.vue';

const momentId = ref(1); // 评论区的 momentId
const postAddCommentForm = ref(null); // 评论区的表单

// 定义反应式数据，用于存储文章信息以及目录内容
const data = ref({
  title: '陶瓷艺术的创新之路',
  author: 'CulturalHeritage',
  date: '2024-10-14',
  like: 66,
  isLiked: false,
});

const contents = ref(['这是第一个大标题', '这是第二个大标题', '这是第三个大标题', '这是第四个大标题', '这是第五个大标题']);
const judgeContent = ref(true);

// 点赞功能的方法
const AddLike = () => {
  try {
    data.value.isLiked = !data.value.isLiked;
    data.value.like += data.value.isLiked ? 1 : -1; // 切换状态时更新点赞数
  } catch (error) {
    console.error("点赞操作失败:", error);
    alert("点赞操作失败，请重试。");
  }
};

// 更新目录内容的方法
const updateContent = () => {
  try {
    contents.value = judgeContent.value ? [] : [...contents.value];
    judgeContent.value = !judgeContent.value; // 切换状态
  } catch (error) {
    console.error("更新目录内容失败:", error);
    alert("更新目录内容失败，请重试。");
  }
};

</script>

<template>
  <div class="layout-container">
    <div style="width: 74%;">
      <el-card class="article-card">
        <div class="article-info">
          <h1 class="article-title">{{ data.title }}</h1>
          <p class="article-meta">作者: {{ data.author }} · {{ data.date }}</p>
          <p class="article-quote">我是一首很好听的古诗，唱的很动听，大家一定要欣赏哦！</p>
        </div>
        <div class="article-content">

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
            <el-button type="primary" @click="AddLike" style="height: 40px; width: 120px;">
              {{ data.isLiked ? '取消关注' : '关注' }}
            </el-button>
            <el-button size="large" style="height: 40px; width: 120px;">私信</el-button>
          </div>
        </div>
      </el-card>

      <el-card class="contents-card">
        <template #header>
          <span>文章前五名点赞列表</span>
        </template>
        <div style="display: flex; align-items: center; margin-bottom: 15px" v-for="index in 5" :key="index">
          <img src="https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/tx.png" style="width: 40px; height: 40px; border-radius: 50%;">
          <p style="margin-left: 12px; font-size: 17px;">人的名字</p>
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
    .article-quote{
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
