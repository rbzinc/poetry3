<script setup>

import Header from '@/Layout/Header/index.vue';
</script>

<template>
 <div>
  <Header v-show="$route.path!=='/login'"> </Header>
  <router-view></router-view>
 </div>

</template>

<style scoped>

</style>
