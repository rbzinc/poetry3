<script setup>
import DayCommon from '@/components/talksquare/DayRecommend/index.vue'
import Ranking from '@/components/game/Ranking/index.vue'
import Forget from '@/components/game/forget/index.vue'
import { Plus } from '@element-plus/icons-vue';
</script>

<template>
  <div class="game">
    <div class="content">
      <el-card style="max-width: 100%;max-height: 560px;" class="el-card">
        <router-view></router-view>
      </el-card>
    </div>
    <div class="sidebar">
      <Ranking />
      <Forget class="card" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game{
  display: flex;
  .content{
    width: 66%;
    margin: 30px 80px;
    height: 560px;
    position: relative;
    .el-card{
      height: 560px;
      display: flex;
      overflow-y: auto;
      ::-webkit-scrollbar {
        width: 6px; /* 滚动条宽度 */
        height: 100%; /* 滚动条高度 */
      }
      /* 滚动条轨道 */
      ::-webkit-scrollbar-track {
        background: #efc0c0; /* 轨道背景色 */
        border-radius: 5px; /* 轨道圆角 */
      }
      /* 滚动条滑块 */
      ::-webkit-scrollbar-thumb {
        background: #f68585; /* 滑块背景色 */
        border-radius: 5px; /* 滑块圆角 */
      }
    }
    .add{
        width: 100px;
        height: 100px;
        background-color: #2d2c2c;
        border-radius: 100%;
        position: absolute;
        bottom: 160px;
        right: 130px;
        opacity: 60%;
        .icon{
          text-align: center;
          justify-content: center;
          color: #fff;
          width: 24px;
          height: 24px;
        }
      }
  }
  .sidebar{
    width: 20%;
    .card{
      margin-top: 30px;
    }
  }

}
</style>se
