<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { goDictionaryTextList } from '@/router/helpers.js'
import { BOOK_BG, BOOK_CONTAINER_BG } from '@/constants/bgUrl.js'
const router = useRouter()
const props = defineProps({
  title: String,
  content: String,
})
</script>

<template>
  <el-tooltip :content="content" placement="bottom" effect="light">
    <div class="box" @click="goDictionaryTextList()" :style="{ backgroundImage: `url(${BOOK_BG})` }">
      <div class="title" :style="{ backgroundImage: `url(${BOOK_CONTAINER_BG})` }">{{ title }}</div>
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
.box {
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
