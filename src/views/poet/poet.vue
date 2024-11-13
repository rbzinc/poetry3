<script setup>
import { RouterView } from 'vue-router';
import { defineExpose } from 'vue';
import Banner from '../../Layout/banner/banner.vue';
defineExpose({
  Banner,
  })
</script>

<template>
  <div class="bgc">
 <div class="home">
  <div class="ban">
    <Banner></Banner>
  </div>
  <div class="book">
    <router-view ></router-view>
  </div>
  
 </div>
</div>
 
</template>

<style scoped>
.bgc{
  width: 100%;
  height: 100%;
  background-image:url('./pic/微信图片_20241016040103.jpg');
  background-size: 100% 2000px
}
.home{
  width: 1300px;
  height: 2000px;
  background:none;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  .ban{
    height: 900px;
    width: 200px;
    background:none;
  }
  .book {
    width: 1100px;
    height: 900px;
    background: none;
    box-sizing: border-box;
    margin: 0 auto;
  }

}

</style>