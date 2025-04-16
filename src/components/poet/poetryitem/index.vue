<script setup>
import { defineProps } from 'vue'
import { Star, VideoPlay } from '@element-plus/icons-vue'
import { userCollectPoem } from '@/api/index.js'
import { goPoetClassDetail } from '@/router/helpers.js'

const props = defineProps({
  content: String,
  dynasty: String,
  id: String,
  islike: Boolean,
  title: String,
  type: String,
  writer: String,
})
const poetDetails = () => {
  goPoetClassDetail(props.id)
}
const collect = async () => {
  event.stopPropagation()
  const res = await userCollectPoem(props.id)
  console.log(res.data)
}
</script>

<template>
  <div class="poetry-component">
    <div class="title" @click="poetDetails">
      {{ title }}
    </div>
    <div class="author">{{ writer }}——（{{ dynasty ? dynasty : '暂未收录' }}）</div>
    <div class="stanza">
      <p class="line">
        {{ content }}
      </p>
    </div>
    <div class="footer">
      <el-icon size="24" class="icon" :class="{ 'star-active': islike }" @click.stop="collect"><Star /></el-icon>
      <el-icon size="24" class="icon"><VideoPlay /></el-icon>
    </div>
  </div>
</template>

<style scoped>
.poetry-component {
  width: 970px;
  margin: 20px auto 0;
  padding: 10px;
  background-color: #f3f2f2;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-family: 'Georgia', serif;
  color: #333;
  line-height: 1.6;
  &:hover {
    color: rgb(133, 133, 133);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }
  .title {
    font-size: 30px;
    color: #5c5c5c;
    text-align: left;
    text-decoration: none;
  }
  p {
    margin: 1rem 0;
    text-decoration: none;
    color: #5c5c5c;
  }
  .author {
    font-style: italic;
    color: #777;
    text-align: left;
    text-decoration: none;
  }
  .stanza {
    margin: 1rem 0;
    text-align: center;
  }

  .line {
    margin: 0.5rem 0;
    text-align: left;
  }
  .footer {
    width: 970px;
    height: 40px;
    background: none;
    display: flex;
    .icon {
      width: 40px;
      height: 40px;
    }
    .star-active {
      color: #ffd700; /* 金黄色 */
    }
  }
}
</style>
