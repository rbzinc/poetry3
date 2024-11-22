<script setup>

</script>

<template>
  <div>
    <el-card class="introduce-card" >
      <template #header>
        <div class="card-header">
          <span>人物名字</span>
        </div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer></template>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.introduce-card{
  margin-top: 30px;
  margin-left: 30px;
  width: 300px;
  height: 500px;
}
</style>
