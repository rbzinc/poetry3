<script setup>
import DayCommon from '@/components/talksquare/DayRecommend/index.vue'
import Ranking from '@/components/game/Ranking/index.vue'
import Forget from '@/components/game/forget/index.vue'
</script>

<template>
  <div class="game">
    <div class="content">
      <el-card style="max-width: 100%;max-height: 100%;">
        <p v-for="o in 100" :key="o" class="text item">{{ 'List item ' + o }}</p>
      </el-card>
    </div>
    <div class="sidebar">
<!--      <DayCommon />-->
      <Ranking />
      <Forget class="el-card" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game{
  display: flex;
  .content{
    width: 66%;
    margin: 30px 80px 0;
    height: 560px;
  }
  .sidebar{
    width: 20%;
    .el-card{
      margin-top: 30px;
    }
  }
}
</style>se
