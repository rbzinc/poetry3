<script setup>
import {defineExpose} from 'vue';
import Textcartoon from '@/components/textcartoon/textcartoon.vue';
import AiPoetAside from '@/components/AiPoetAside/index.vue'
defineExpose(Textcartoon)
</script>

<template>

  <div class="bgc">
    <AiPoetAside />
    <Textcartoon></Textcartoon>
    <div class="home">
      <div class="row">
        <div class="box">
          <img src="./pic/图片1.png" alt="" class="img">
          <p>王维</p>
        </div>
        <div class="box">
          <img src="./pic/图片4.png" alt="" class="img">
          王维
        </div>
        <div class="box">
          <img src="./pic/图片3.png" alt="" class="img">
          杜甫
        </div>
        <div class="box">
          <img src="./pic/图片3.png" alt="" class="img">
          杜甫
        </div>
        <div class="box">
          <img src="./pic/图片4.png" alt="" class="img">
          王维
        </div>
        <div class="box">
          <img src="./pic/图片4.png" alt="" class="img">
          王维
        </div>
        <div class="box">
          <img src="./pic/图片5.png" alt="" class="img">
          苏轼
        </div>
        <div class="box">
          <img src="./pic/图片6.png" alt="" class="img">
          李清照
        </div>
      </div>

    </div>

  </div>

</template>

<style scoped lang="scss">
.bgc {
  width: 100%;
  height: 860px;
  background: url('./pic/微信图片_20241016021536.jpg');

  .home {
    display: flex;
    padding:0 200px;
    .row {
      display: flex;
      flex-wrap: wrap;
      column-gap: 70px;
      .box {
        text-align: center;
        width: 200px;
        height: 240px;
        font-size: 20px;
        font-style: oblique;
        text-decoration: none;
        p{
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
