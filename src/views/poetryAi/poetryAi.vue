<script setup>
import { defineExpose } from 'vue';
import Textcartoon from '../../components/textcartoon/textcartoon.vue';
defineExpose(Textcartoon)
</script>

<template>
  
  <div class="bgc">
    <Textcartoon></Textcartoon>
    <div class="home">
  <div class="row">
    <div class="box">
      <img src="./pic/图片1.png" alt="" class="img"  >
      白居易
    </div>
    <router-link to="/aiChat"class="box">
      <img src="./pic/图片2.png" alt="" class="img" >
      李白
    </router-link>
    <div class="box">
      <img src="./pic/图片3.png" alt="" class="img" >
      杜甫
    </div>
  </div>
  <div class="row">
    <div class="box">
      <img src="./pic/图片4.png" alt="" class="img" >
      王维
    </div>
    <div class="box">
      <img src="./pic/图片5.png" alt="" class="img" >
      苏轼
    </div>
    <div class="box">
      <img src="./pic/图片6.png" alt="" class="img" >
      李清照
    </div>
  </div>
</div>
<div class="footer">尽情期待...</div>
</div>

</template>

<style scoped>
.bgc{
  width: 100%;
  height: 860px;
  background-image: url('.\pic\微信图片_20241016021536.jpg');
}
.img{
  width: 200px;
  height: 200px;
  border-radius: 20%;
}
.home{
  width: 1200px;
  height: 700px;
  background-size: cover;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 40px;
  padding-left: 240px;
  display: flex; 
  flex-wrap: wrap; 
  gap: 30px; 
  .row {
    display: flex;
    gap: 30px; 
  }
  .box{
    text-align: center;
    width:200px;
    height: 240px;
    font-size: 20px;
    font-style: oblique;
    text-decoration: none;
  }
  .foot{
    width: 1200;
    text-align: right;
    font-size: 30px;
    background-color: #cc9595;
    opacity: 0.5;
  }
}

</style>