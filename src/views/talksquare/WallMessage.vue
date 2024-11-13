<script setup>
import { defineExpose,ref } from "vue"
import { CirclePlusFilled } from '@element-plus/icons-vue'
import NodeCard from '../../components/nodeCard/index.vue'
import LtModel from '../../components/nodeCard/modal.vue'
import NewCard from "../../components/nodeCard/newcard.vue"
import { talkSquareStore } from '../../stores/modules/talksquare'
const talkstore = talkSquareStore()
defineExpose({
  NodeCard,
  LtModel,
  NewCard
})
let idlable = ref(-1)
const fontChange = () =>{
  idlable == 1 
}
const cardChange = () =>{
  talkstore.funmodel()
  console.log(talkstore.ismodel)
}
</script>

<template>
<div class="wallmessage">
  <div class="title">有什么想法都在这里交流吧！</div>
  <div class="classify">
    <div class="lable" :class="{lbseleted:idlable==-1}" @click="fontChange">全部</div>
    <div class="label">赏析</div>
    <div class="label">推荐</div>
    <div class="label">诗人</div>
    <div class="label">古诗</div>
    <div class="label">学习</div>
    <div class="label">生活</div>
    <div class="label">其他</div>
  </div>
  <div class="nodecard">
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
    <NodeCard></NodeCard>
  </div>
  <div class="add" >
    <el-icon size="56px" @click="cardChange"><CirclePlusFilled /></el-icon>
  </div>
  <div>
  <LtModel>
    <NewCard></NewCard>
  </LtModel>
</div>
</div>
</template>

<style scoped lang="scss">
.wallmessage{
  padding-top: 52px;
  .title{
    font-size: 30px;
    text-align: center;
    margin-bottom: 60px;
  }
  .classify{
    margin: 0 auto 60px;
    // background-color: rgb(191, 237, 196);
    width: 1200px;
    height: 40px;
    display: flex;
    justify-content: center;
    .label{
      // background-color: rgb(250, 184, 216);
      width: 80px;
      height: 40px;
      margin-right: 10px;
      text-align: center;
      line-height: 40px;
      color: #595858;
    }
    .lbseleted{
      width: 80px;
      height: 40px;
      margin-right: 10px;
      text-align: center;
      line-height: 40px;
      border: 2px solid #343333;
      color: #343333;
      border-radius: 24px;
    }
  }
  .nodecard{
    width: 1540px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
  }
  .add{
    width: 56px;
    height: 56px;
    background-color: #c3ecea;
    border-radius: 28px;
    position: fixed;
    right: 30px;
    bottom: 30px;
    transition: all 0.3s;

  }
}
</style>