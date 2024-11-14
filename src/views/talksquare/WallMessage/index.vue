<script setup>
import {ref} from 'vue'

const activeName = ref('new')
const pageSize = ref(6)
const currentPage = ref(1)

const handleClick = (tab, event) => {
  console.log(tab, event)
}
const handlePageChange = () => {
  console.log(currentPage.value)
}

</script>
<template>

  <div class="article-container">
    <div class="article-left">
      <el-menu
          mode="vertical"
          :default-active="activeIndex"
      >
        <el-menu-item index="1" @click="handleMenuClick('1')">
          <el-icon>
            <Star/>
          </el-icon>
          <span>诗词创作</span>
        </el-menu-item>
        <el-menu-item index="2" @click="handleMenuClick('2')">
          <el-icon>
            <Service/>
          </el-icon>
          <span>诗词赏析</span>
        </el-menu-item>
        <el-menu-item index="3" @click="handleMenuClick('3')">
          <el-icon>
            <Setting/>
          </el-icon>
          <span>诗词学习</span>
        </el-menu-item>
        <el-menu-item index="4" @click="handleMenuClick('4')">
          <el-icon>
            <Odometer/>
          </el-icon>
          <span>诗词活动</span>
        </el-menu-item>
        <el-menu-item index="5" @click="handleMenuClick('5')">
          <el-icon>
            <Connection/>
          </el-icon>
          <span>诗词资源</span>
        </el-menu-item>
        <el-menu-item index="6" @click="handleMenuClick('6')">
          <el-icon>
            <Service/>
          </el-icon>
          <span>诗词杂谈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="article-middle">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最新" name="new">
          <div class="article" v-for="(item, index) in 6" :key="index">
            <div class="article-list">
              <div class="list-left">
                <h3 class="list-title">这是标题</h3>
                <p class="list-content" style="margin: 5px 0; text-indent: 2em;">这是内容</p>
                <div class="list-footer" style="margin-top: 25px;">
                  <p style="margin-right: 12px;">张三</p>
                  <p style="margin-right: 12px;">赞 120</p>
                  <p style="margin-right: 12px;">评 120</p>
                  <p>春风十里不如你, 吹尽狂沙始到金</p>
                </div>
              </div>
              <div class="list-right" style="background-color: skyblue; height: 100px; width: 150px;">
                <img alt="" src="#">
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="最热" name="heat"></el-tab-pane>
      </el-tabs>


      <div class="pagination-container">
        <el-pagination
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
            background
            layout="prev, pager, next"
            :total="66"
        />
      </div>

    </div>

    <div class="article-right">
      <el-card style="margin-bottom: 30px;">
        <template #header>
            <span>精选文章推荐</span>
        </template>
        <div v-for="(item, index) in 5" :key="index" style="margin-bottom: 10px;">
          <h4 >这是标题</h4>
        </div>

      </el-card>

      <el-card style="margin-bottom: 30px;">
        <template #header>
            <span>今日作者推荐</span>
        </template>
        老子是李白！
      </el-card>

      <el-card >
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


<style scoped lang="scss">
.article-container {
  max-width: 1300px;
  display: flex;
  margin: auto;
  padding: 20px;

  .article-left {
    margin: 20px 0;
    width: 20%;
  }

  .article-middle {
    width: 60%;
    margin: 0 20px;

    .article {
      display: flex;
      align-items: center;
      height: 120px;
      margin-bottom: 10px;

      .article-list {
        width: 100%;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;

        .list-left {
          .list-footer {
            display: flex;
          }
        }
      }

    }

  }

  .article-right {
    width: 20%;

  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 40px auto;
  width: 100%;
}

/* 未点赞状态 */
.unliked {
  background-color: white;
  color: black;
}

/* 已点赞状态 */
.liked {
  background-color: #3f7ef7;
  color: white;
}
</style>
