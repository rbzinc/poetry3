<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  title:String,
  content:String
})
const isopen = ref(true) 
const change = () => {
  isopen.value = !isopen.value;
}
</script>

<template>
<div class="content">
  <div :class="[isopen ? 'before' : 'after']">
    <p v-html="title"></p>
    <div v-html="content"></div>
  </div> 
  <div class="toggle" @click="change">
      {{ isopen ? '点击此处展开' : '点击此处收起' }}
  </div>
</div>
</template>

<style scoped lang="scss">
  .content{
    width: 1000px;
    margin: 0 auto;
    background: none ; 
    box-sizing: border-box;
    .before{
    border-radius: 10px 10px 0 0;
    transition: height 0.3s ease;
    height: 200px; 
    overflow: hidden;
    width: 1000px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative; 
    opacity: 70%;
    p{
      margin: 0 ;
      margin-bottom: 10px ;
      font-size: 15px;
    }
  }
  .after{
    border-radius: 10px 10px 0 0;
    transition: height 0.3s ease;
    width: 1000px;
    height: auto;
    margin: 0 auto ;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 70%;
    p{
      margin: 0 ;
      margin-bottom: 10px ;
      font-size: 15px;
    }
  }
  .toggle{
      width: 1000px;
      height: 40px;
      margin: 0 auto 30px;
      cursor: pointer;
      text-align: center;
      padding: 10px;
      background-color: #d1cfcf;
      background: linear-gradient(to top, #d1cfcf, #fff);
      box-sizing: border-box;
      opacity: 60%;
      border-radius: 0 0 10px 10px;
    }
  }
  
  
 
  </style>

  