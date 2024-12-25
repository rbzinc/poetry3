<script setup>
import {defineExpose} from 'vue';
import Textcartoon from '@/components/study/directory/AiStudy/textcartoon/index.vue';
import AiPoetAside from '@/components/study/directory/AiStudy/AiPoetAside/index.vue'
import { useRouter } from 'vue-router';
import {usePoemImgStore } from '@/stores/modules/poemImg.js'
const PoemImg = usePoemImgStore();
const router = useRouter();
defineExpose(Textcartoon)

const poetryAi = [
  {
    id: 1,
    title: '王维',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/71190bf4-1056-489c-80a6-27dcfa62be0b.png',
    content:'嘿，朋友！我是王维，山水间的行者。如果你向往宁静的田园生活，或是对禅意有所追求，不妨与我一同漫步于山水之间，共赏落日余晖。有什么心事，尽管向我诉说，或许我能以画笔为你描绘出心中的宁静。'
  },
  {
    id: 2,
    title: '周敦颐',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/ebc095b4-dddb-4a27-bc6f-5aa103196680.png',
    content:'你好啊，我是周敦颐，哲学的探索者。如果你对宇宙的奥秘和人生的哲理有所好奇，我们可以一起探讨‘太极’和‘无极’的奥秘。让我们在茶香中沉思，寻找生命的真谛。',
  },
  {
    id: 3,
    title: '李清照',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/db4dd8bd-6e12-4863-a806-91bb7479e2cf.png',
    content:'亲爱的朋友，我是李清照，婉约词派的代表。如果你心中有柔情似水的情感，或是对往昔的美好有所怀念，不妨与我分享。我们可以一起品茗，吟诗，感受那份细腻的情感流动。',
  },
  {
    id: 4,
    title: '李白',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/a22e7f70-d620-4f7b-b614-be3473542e4c.png',
    content:'嘿，朋友！我是李白，人称‘诗仙’。今日风和日丽，正是把酒言欢的好时光。有什么烦心事，尽管向我倾诉，或许我能以诗解忧。若你心中有疑问，也不妨直言，我虽不才，却也愿意与你畅谈天地。今朝有酒今朝醉，人生得意须尽欢，莫使金樽空对月。来，让我们不醉不归！'
  },
  {
    id: 5,
    title: '杜甫',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/aba47cbc-524e-4fab-9f16-b98f6fa0d84d.png',
    content:'嘿，伙计！我是杜甫，人称‘诗圣’。如果你对世间的苦难和人民的疾苦有所感触，我们可以一起探讨如何用诗歌来表达对这个世界的关怀。来，让我们以诗会友，共同感受那份深沉的情感。',
  },
  {
    id: 6,
    title:'白居易',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/54bb546c-77a6-4881-bdef-4d1d507d52c4.png',
    content:'你好，我是白居易，平易近人的诗人。如果你喜欢简单直接的交流，或是对日常生活有所感悟，我们可以一起聊聊。无论是市井小民的生活，还是朝堂之上的风云，我都愿意与你分享我的看法。',
  },
  {
    id: 7,
    title: '苏轼',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/52a6ca49-ba2f-4efd-a420-f6a71d3e29d3.png',
    content:'哈哈，我是苏轼，人称‘东坡居士’。如果你对美食、书法、绘画或是诗词有所热爱，我们可以一起探讨。无论是烹饪一道佳肴，还是挥毫泼墨，我都愿意与你共享这份乐趣。',
  },
  {
    id: 8,
    title: '陶渊明',
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/f9b50245-4a89-4d3e-bbf9-2c39d965a3ca.png',
    content:'朋友，我是陶渊明，归隐田园的诗人。如果你厌倦了都市的喧嚣，向往那份宁静与自由，我们可以一起耕种，品酒，享受那份简单的快乐。来，让我们在菊花下畅谈，忘却尘世的烦恼。',
  },
]
PoemImg.setPoemImg(poetryAi)
const changeChat = (item)=>{
  router.push(`/chattochat/${item.id}`)
}
</script>

<template>

  <div class="bgc">
    <AiPoetAside/>
    <Textcartoon></Textcartoon>
    <div class="home">
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in poetryAi" :key="item.id" class="item-row">
          <img :src="item.url" alt="" class="img" @click="changeChat(item)">
          <p class="title">{{item.title}}</p>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<style scoped lang="scss">
.bgc {
  background: url('@/assets/pic/study/9a9e79bde1bccac83dc7413c3035a26.png');
  background-size: cover;
  height: calc(100vh-80px);

  .home {
    display: flex;
    padding: 0 200px;
    .item-row{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;margin-bottom: 20px;
      .img {
        width: 200px;
        height: 200px;
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .title{
        font-size: 20px;
        margin-top: 4px;
      }
    }
  }
}

</style>
