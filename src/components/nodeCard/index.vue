<script setup>
import { ChatDotRound,Star, StarFilled } from '@element-plus/icons-vue';
</script>

<template>
 <div class="card">
  <div class="top">
    <div class="image"></div>
    <div class="message">
      <div class="title">李白诗集</div>
      <div class="content">
        关于这首诗的写作时间，说法不一。郁贤皓《李白集》认为此诗约作于开元二十四年（公元736年）前后。黄锡珪《李太白编年诗集目录》系于天宝十一载（752）。一般认为这是李白天宝年间离京后，漫游梁、宋，与友人岑勋、元丹丘相会时所作。
      </div>
    </div>
  </div>
  <div class="foot">
    <div class="left">
      <div class="icon">
        <span><el-icon size="16px" ><ChatDotRound /></el-icon></span>
        <span class="value">4</span>
      </div>
      <div class="icon">
        <span><el-icon size="20px" class="custom-icon"><StarFilled/></el-icon></span>
        <span class="value">4</span>
      </div>
    </div>
    <div class="name">作者：李白</div>
  </div>
 </div>
</template>

<style scoped lang="scss">
.card{
  width: 900px;
  height: 200px;
  padding: 10px 10px ;
  box-sizing: border-box;
  background-color: #c5edf3;
  position: relative;
  margin: 20px auto 20px;
  .top{
    width: 880px;
    height: 140px;
    background: none;
    display: flex;
    box-sizing: border-box;
    .image{
      width: 160px;
      height: 140px;
      background-color: #d2eade;
      box-sizing: border-box;
    }
    .message{
      height: 140px;
      font-family: HanziPenSC-W3;
      font-size: 14px;
      color: #4a4949;
      .title{
        width: 720px;
        font-size: 22px;
        font-weight: 600;
        color: #616161;
        margin-bottom: 10px;
      }
      .content{
        width: 720px;
        font-size: 16px;
        color: #7d7b7b;
      }
    }
  }
  
  .foot{
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 16px;
    left: 0;
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
    .left{
      display: flex;
      .icon{
        padding-right: 8px;
        display: flex;
        align-items: center;
        color: #797878;
          .value{
            padding-left: 4px;
            font-size: 16px;
            line-height: 16px;
        }
          .custom-icon:hover {
          color: rgb(253, 147, 147); 
        }
      }
    }
    .name{
      font-size: 17px;
      color: #4a4949;
    }
  }
  
}
</style>