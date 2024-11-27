<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  title:String,
  content:String,
})

</script>

<template>
  <div class="box">
    <div class="title">{{ title }}</div>
    <p>{{ content }}</p>
  </div>
</template>

<style scoped lang="scss">
.box{
  margin: 10px;
  width: 190px;
  height: 200px;
  float: left;
  background-color: #d8d8d8;
  border-radius: 5px;
  opacity: 60%;
  &:hover{
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
    cursor: pointer
  }
  .title{
    width: 190px;
    height: 80px;
    background: none;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
    font-family: 'Georgia', serif;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
  }
  p{
    font-size: 16px;
    line-height: 120px;
    text-align: center;
  }
}

</style>