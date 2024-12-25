<script setup>
import DayCommon from '@/components/talksquare/DayRecommend/index.vue'
import Ranking from '@/components/study/directory/GameStudy/ranking/index.vue'
import Forget from '@/components/study/directory/GameStudy/forget/index.vue'
import {Plus} from '@element-plus/icons-vue';
</script>

<template>
  <div class="game">
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="sidebar">
      <Ranking/>
      <Forget class="card"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game {
  display: flex;

  .content {
    width: 66%;
    margin: 30px 80px;
    height: 560px;
    position: relative;

    .add {
      width: 100px;
      height: 100px;
      background-color: #2d2c2c;
      border-radius: 100%;
      position: absolute;
      bottom: 160px;
      right: 130px;
      opacity: 60%;

      .icon {
        text-align: center;
        justify-content: center;
        color: #fff;
        width: 24px;
        height: 24px;
      }
    }
  }

  .sidebar {
    width: 20%;

    .card {
      margin-top: 30px;
    }
  }

}
</style>se
