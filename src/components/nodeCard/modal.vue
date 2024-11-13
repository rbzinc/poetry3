<script setup>
import { CloseBold } from '@element-plus/icons-vue';
import { defineProps,ref,onMounted,defineEmits } from 'vue'
import { talkSquareStore } from '../../stores/modules/talksquare'
const talkstore = talkSquareStore()
const props = defineProps({
    title:{
    default:'发表帖子',
    }
})

// let isModel = ref(talkstore.ismodel)
// const change = () =>{
//   talkstore.funmodel()
//   isModel.value = talkstore.ismodel
// }
// onMounted(() => {
//   isModel.value = talkstore.ismodel
// })
let open = ref(true)
</script>

<template>
<div class="modal" v-if="open">
  <div class="head">
    <div class="name">{{ title }}</div>
    <span><el-icon class="close" @click="change"><CloseBold /></el-icon></span>
  </div>
  <div class="main">
    <slot ></slot>
    <div class="slot"></div>
  </div>
</div>
</template>

<style scoped lang="scss">
.modal{
  width: 360px;
  height: 948px;
  position: fixed;
  right: 0;
  top: 80px;
  background-color: #fff;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  .head{
     display: flex;
     justify-content: space-between;
     padding: 20px;
     padding-bottom: 20px;
     box-sizing: border-box;
     .name{
      font-size: 16px;
      font-weight: 600;
      color: #616161;
     }
     .close{
      color: #616161;
      cursor: pointer;
     }
  }
  .main{
    font-size: 16px;
    // border:1px solid black;
    // background-color: #ecebeb;
    height:80%;
    overflow-y: auto;
    padding-bottom: 116px;
    box-sizing: border-box;
  }
  .slot{
    height: 1200px;
    // border:1px solid black;
  }
}
</style>