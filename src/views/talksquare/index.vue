<script setup>
import {ref} from 'vue'
import router from "@/router/index.js";
import {userLuntanSelecttiezTypesGetApi} from "@/api/modules/talkSquare.js";
import DayRecommend from "@/components/talksquare/DayRecommend/index.vue";
import ArticleRecommendation from "@/components/talksquare/ArticleRecommendation/index.vue";
import { computed } from 'vue';
const activeName = ref('new') // 当前激活的tab
const activeIndex = ref('1') // 当前激活的tab
const pageSize = ref(5)// 每页显示的条数
const currentPage = ref(1) // 当前页
const nowMenuData = ref(1) // 当前选择的分类
const totalPage = ref(1) // 总页数

const userLuntanSelecttiezTypesData = ref([]) // 根据分类选择的列表
// 自定义数据
const menuData = ref([
  {
    id: '1',
    name: '诗词创作',
    icon: 'iconfont icon-chuangzuo'
  },
  {
    id: '2',
    name: '诗词赏析',
    icon: 'iconfont icon-shuhuashangxi'
  },
  {
    id: '3',
    name: '诗词学习',
    icon: 'iconfont icon-xinshouxuetang'
  },
  {
    id: '4',
    name: '诗词活动',
    icon: 'iconfont icon-huodong'
  },
  {
    id: '5',
    name: '诗词资源',
    icon: 'iconfont icon-ziyuan'
  },
  {
    id: '6',
    name: '诗词杂谈',
    icon: 'iconfont icon-zatan'
  }
]);
const handleClick = (tab, event) => {
  // console.log(tab, event)
}
const handlePageChange = (page) => {
  currentPage.value = page
  userLuntanSelecttiezTypes()
}
const handleMenuClick = (item) => {
  nowMenuData.value = item.id

  userLuntanSelecttiezTypes()
}
const goToDetail = (item) => {
  router.push(`/forum/detail?id=${item.id}`);
}
const EditPublic = () => {
  router.push('/forum/edit');
}
const userLuntanSelecttiezTypes = async() => {
  const res = await userLuntanSelecttiezTypesGetApi(currentPage.value, pageSize.value, nowMenuData.value)
  totalPage.value=res.data.total
  userLuntanSelecttiezTypesData.value = res.data.records
}


const truncatedContent = computed(() => {
  return userLuntanSelecttiezTypesData.value.map(item => {
    return {
      ...item,
      content: item.content.length > 100 ? item.content.slice(0, 100) + '...' : item.content
    };
  });
});

/**
 * 跳转到诗词详情页
 * @param item
 * @constructor
 */
const JumpPoemDetails = (item)=>{
  router.push(`/poedetails?id=${item.poemId}`)
}


onMounted(()=>{
  userLuntanSelecttiezTypes()
})
</script>
<template>

  <div class="bgc">
    <div class="article-container">
      <div class="article-left">
        <el-menu
            mode="vertical"
            :default-active="activeIndex"
        >
          <el-menu-item v-for="item in menuData" :key="item.id" :index="item.id" @click="handleMenuClick(item)">
            <i :class="item.icon" style="margin-right: 10px;"/>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="article-middle">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="最新" name="new">
            <div class="article" v-for="(item, index) in truncatedContent" @click="goToDetail(item)" :key="index">
              <div class="article-list">
                <div class="list-left">
                  <h3 class="list-title">{{item.title}}</h3>
                  <p class="list-content" style="margin: 5px 0; text-indent: 2em;">{{item.content}}</p>
                  <div class="list-footer" style="margin-top: 25px;">
                    <p style="margin-right: 12px;">作者: {{item.username}}</p>
                    <p style="margin-right: 12px;">赞 {{item.liked}}</p>
                    <p style="margin-right: 12px;">评 {{item.conmments}}</p>
                    <p v-if="item.poemWord" style="cursor: pointer;" @click.stop="JumpPoemDetails(item)" >引用 “{{item.poemWord}}” </p>
                  </div>
                </div>
                <div class="list-right" style=" height: 100px; width:100px;">
                  <img alt="" :src="item.images" style="width: 100%; height: 100%;">
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
              :total="totalPage"
          />
        </div>

      </div>

      <div class="article-right">
        <ArticleRecommendation />
        <DayRecommend />
      </div>

      <div class="add" >
        <el-icon size="56px" @click="EditPublic"><CirclePlusFilled /></el-icon>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.bgc {
  width: 100%;
  height: 1000px;
  background-image: url('@/assets/pic/forum/c0b5d3eab10bd3a732987c09aff12b7.jpg');
  background-size: 100% 100%;

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
            width: 90%;

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

    .add {
      width: 56px;
      height: 56px;
      background-color: #c3ecea;
      border-radius: 28px;
      position: fixed;
      right: 30px;
      bottom: 30px;
      transition: all 0.3s;
      cursor: pointer;


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
}
</style>
