<script setup>
import {defineExpose} from 'vue';
import wangwei from './pic/王维.png'
import zhoudunyi from './pic/周敦颐.png'
import dufu from './pic/杜甫.png'
import baijvyi from './pic/白居易.png'
import sushi from './pic/苏轼.png'
import taoyuanming from './pic/陶渊明.png'
import liqingzhao from './pic/李清照.png'
import libai from "./pic/李白.png";
import Textcartoon from '@/components/textcartoon/textcartoon.vue';
import AiPoetAside from '@/components/AiPoetAside/index.vue'
import { useRouter } from 'vue-router';
const router = useRouter();
defineExpose(Textcartoon)

const poetryAi = [
  {
    id: 1,
    title: '王维',
    url: wangwei
  },
  {
    id: 2,
    title: '周敦颐',
    url: zhoudunyi
  },
  {
    id: 3,
    title: '李清照',
    url: liqingzhao,
  },
  {
    id: 4,
    title: '李白',
    url: libai,
  },
  {
    id: 5,
    title: '杜甫',
    url: dufu
  },
  {
    id: 6,
    title:'白居易',
    url: baijvyi
  },
  {
    id: 7,
    title: '苏轼',
    url: sushi
  },
  {
    id: 8,
    title: '陶渊明',
    url: taoyuanming
  },
]

const changeChat = (id)=>{

  router.push(`/chattochat/${id}`)
}
</script>

<template>

  <div class="bgc">
    <AiPoetAside/>
    <Textcartoon></Textcartoon>
    <div class="home">
      <div class="row" >
        <div class="box" v-for="item in poetryAi" :key="item.id">
          <img :src="item.url" alt="" class="img" @click="changeChat(item.id)">
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.bgc {


  background: url('./pic/微信图片_20241016021536.jpg');

  .home {
    display: flex;
    padding: 0 200px;

    .row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      column-gap: 40px;

      .box {
        text-align: center;
        width: 200px;
        height: 240px;
        font-size: 20px;
        font-style: oblique;
        text-decoration: none;

        p {
          margin-top: 4px;
        }
      }

      .foot {
        width: 1200px;
        text-align: right;
        font-size: 30px;
        background-color: #cc9595;
        opacity: 0.5;
      }
    }

  }
}

.img {
  width: 200px;
  height: 200px;
  border-radius: 20%;
}


</style>
