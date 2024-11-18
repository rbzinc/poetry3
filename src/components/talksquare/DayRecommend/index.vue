<script setup>
import {ref} from "vue";
import {userPoetryGetVeryGoodPoemGetApi} from "@/api/modules/talkSquare.js";

const todayPoemData = ref({}) // 今日古诗推荐

const userPoetryGetVeryGoodPoem = async ()=>{
  const res = await userPoetryGetVeryGoodPoemGetApi()
  todayPoemData.value = res.data

}

onMounted(()=>{
  userPoetryGetVeryGoodPoem()
})
</script>

<template>
  <el-card style="line-height: 1.5;  word-spacing: 4px;">
    <template #header>
      <span>今日古诗推荐</span>
    </template>
    <p style="text-align: center;">{{todayPoemData.title}}</p>
    <p style="text-align: center;">{{todayPoemData.writer}}</p>
    <p v-html="todayPoemData.content" style="text-indent: 2em"></p>
  </el-card>
</template>

<style lang="scss" scoped>

</style>
