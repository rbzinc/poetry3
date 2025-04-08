<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { goDictionaryTextList } from '@/router/helpers.js'
const router = useRouter()
const props = defineProps({
  title: String,
  content: String,
})
</script>

<template>
  <el-tooltip :content="content" placement="bottom" effect="light">
    <div class="box" @click="goDictionaryTextList()">
      <div class="title">{{ title }}</div>
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
.box {
  background-image: url('@/assets/pic/study/f18e59c7edb7edc404e6f3301fd5112.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 10px;
  width: 170px;
  height: 220px;
  float: left;
  background-color: #ededed;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }
  .title {
    width: 36px;
    height: 170px;
    margin-top: 25px;
    margin-left: 22px;
    background-color: #fff;
    line-height: 36px;
    text-align: center;
    font-size: 20px;
    font-family: '汉仪尚巍手书', cursive;
    font-weight: bold;
    writing-mode: vertical-rl;
    background-image: url('@/assets/pic/study/65a0c2be7443a0a865c684d6c6ac023.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  p {
    font-size: 16px;
    line-height: 120px;
    text-align: center;
  }
}
</style>
