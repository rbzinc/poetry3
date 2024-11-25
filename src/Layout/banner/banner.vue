<script setup>

</script>

<template>
 <div class="body">
  <div class="banner">
    <keep-alive>
      <router-link to="/poet">古诗</router-link>
    </keep-alive>
      <router-link to="/poet/writer">作者</router-link>
      <router-link to="/poet/sentence">名句</router-link>
      <img src="../banner/pic/98903ef06c7b8f687f0dade7485098b.jpg" alt="" width="230px" height="590px" >
  </div>
 
 </div>
</template>

<style scoped lang="scss">
.banner{
  width: 230px;
  height: 800px;
  background-color: #fefefe;
  display: flex;
  flex-direction: column; 
  a{
    font-size: 18px;
    text-align: center;
    line-height: 70px ;
    text-decoration: none;
    color: #8d8c8c;
    display: block;
    width: 210px;
    height:70px;
    background-color: #fefefe;
    &:hover{
      border-left: 6px solid rgb(181, 181, 181);
      color: rgb(133, 133, 133);
      box-shadow: 0 4px 8px rgba(169, 169, 169, 0.6)
  }
}
}
</style>