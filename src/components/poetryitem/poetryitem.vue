<script setup>
import { defineProps } from 'vue';
import { Star,VideoPlay } from '@element-plus/icons-vue';
import { useRouter } from "vue-router";

const props = defineProps({
  poetitle:String,
  writer:String,
  content:String,
  dynasty:String
})
const router =useRouter()
const poetDetails =()=>{
  router.push(`/poedetails${item.id}`)
}

</script>

<template>
 <div class="poetry-component">
    <div class="title" @click="poetDetails">
      {{poetitle}}
    </div>
    <div class="author">
      {{writer}}——（{{ dynasty }}）
    </div>
    <div class="stanza">
      <p class="line">
        {{ content }}</p>
    </div>
    <div class="footer">
      <el-icon  size ='24' class="icon" ><Star /></el-icon>
      <el-icon size ='24' class="icon" ><VideoPlay /></el-icon>
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
      &:hover{
      color: rgb(133, 133, 133);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
      cursor: pointer
  }
      .title{
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
      text-align: center;
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
    .footer{
      width: 970px;
      height: 40px;
      background: none;
      display: flex;
     .icon{
      width: 40px;
      height: 40px;
     }

    
    }
  }
</style>