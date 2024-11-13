<script setup>
import { defineExpose } from "vue"
import Search from "../../components/search/search.vue"
defineExpose({
  Search
})
</script>

<template>
 <div class="home">
   <div class="header">
    <Search></Search>
   </div>
   <div class="nav">
        <router-link to="/writersearch">诗人</router-link>
        <router-link to="/poetsearch">古诗</router-link>
        <router-link to="/sensearch">名句</router-link>
   </div>
   <div class="body">
    <router-view></router-view>
   </div>

  </div>
</template>

<style scoped lang="scss">
.home{
  width: 1200px;
  height: 1000px;
  background-color: #befef0;
  margin: 10px auto 0; 
  .header{
    width: 1200px;
    height: 120px;
    background-color: #e8f0cc;
    text-align: center;
  }
  .nav{
    width: 1200px;
    height: 50px;
    background-color: #f1f6b8;
    padding: 10px 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    a{
      width: 60px;
      display: block;
      color: rgb(199, 155, 155);
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      transition: color 0.3s ease, transform 0.3s ease;
      &:hover{
          border-radius: 150px;
          background-color: #4CAF50; 
          transform: scale(1.1); 
      }
    }
  }
  .body{
      width: 1200px;
      height: 800px;
      background-color: #deb9e5;
    }
}
</style>