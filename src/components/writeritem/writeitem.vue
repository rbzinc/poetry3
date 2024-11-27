<script setup>
import { defineProps } from 'vue';
 import { Star,VideoPlay } from '@element-plus/icons-vue';
import { useRouter } from "vue-router";

const props = defineProps({
  name:String,
  content:String,
  dynasty:String
})
const router =useRouter()
const writerDetails =()=>{
  router.push(`/writer${item.id}`)
}
</script>

<template>
 <div class="poetry-component">
    <div class="title" @click="writerDetails">
      <div class="headimage"></div>
      {{ name }}
      <div class="author">（{{ dynasty }}）</div>
    </div>
    
    <div class="stanza">
      <p class="line">
        {{ content }}
      </p>
    </div>
    <div class="footer">
      <el-icon  size ='24' class="icon"  @click="toggleIconColor"><Star /> </el-icon>
      <el-icon size ='24' class="icon" @click="toggleIconColor"><VideoPlay /> </el-icon>
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
        height: 70px;
      font-size: 30px;
      color: #5c5c5c;
      text-decoration: none;
      display: flex;
      line-height: 70px;
      .headimage{
        width: 60px;
        height: 60px;
        margin-right: 10px;
        background-color: #d7f5c9;
        border-radius: 100%;      
        }
      }
      p {
        margin:0 10px;
        text-decoration: none;
        color: #5c5c5c;
      }
    .author {
      font-style: italic;
      font-size: 17px;
      text-align: center;
      color: #777;
      text-align: center;
      text-decoration: none;
      margin-top: 5px;
    }
   .stanza {
      margin: 0 15px;
      text-align: center;
      align-items: center; 
    }

   .line {
      margin: 10px 0;
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