<script setup>
import {ref} from "vue";


const tableData = ref([
  {
    id: 1,
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    name: '我是帅哥',
    score: 99,
    rank: 1
  },
  {
    id: 2,
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    name: '我是美女',
    score: 88,
    rank: 2
  },
  {
    id: 3,
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    name: '我是大叔',
    score: 77,
    rank: 3
  },
  {
    id: 4,
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    name: '我是小萌新',
    score: 66,
    rank: 4
  }
])
onMounted(() => {

})
</script>

<template>
  <el-card style="line-height: 1.5;  word-spacing: 4px;">
    <template #header>
      <span>今日得分排行榜</span>
    </template>
    <el-row v-for="item in tableData" :ket="item.id" class="rank-item">
      <el-col :span="4">
        <img :src="item.url" alt="" class="rank-item-url"/>
      </el-col>
      <el-col :span="12">
        {{ item.name }}
      </el-col>
      <el-col :span="6">
        {{ item.score }}
      </el-col>
      <el-col :span="2">
        {{ item.rank }}
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.rank-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
  .rank-item-url {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
