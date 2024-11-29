<script setup>
import {ref} from "vue";
import {userLuntanSelectForumGetApi} from "@/api/modules/talkSquare.js";

const RecommendationData = ref({}) // 今日古诗推荐

const userLuntanSelectForum = async () => {
  const res = await userLuntanSelectForumGetApi()
  RecommendationData.value = res.data
  console.log(RecommendationData.value)

}
const goToDetail = (item) => {
  console.log(item)
}
onMounted(() => {
  userLuntanSelectForum()
})
</script>

<template>

  <el-card class="contents-card">
    <div>
      <h2>文章推荐</h2>
    </div>
    <el-divider style="margin: 16px 0"/>
    <div v-for="item in RecommendationData" :key="item.blogid"
         style="margin-bottom: 16px; margin-left: 5px; cursor: pointer;" @click="goToDetail(item)">
      <h3 style=" margin-bottom: 10px;
    ">{{item.title}}</h3>
    <div style="display: flex; color: #666;justify-content: flex-end; ">
      <p style="margin-right: 16px;">评论 : {{item.conmments}}</p>
      <p><i class="iconfont icon-dianzan1"></i> {{item.liked}}</p>
    </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.contents-card{
  margin-bottom: 30px;
}
</style>
