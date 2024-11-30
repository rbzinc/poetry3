<script setup>
import {defineExpose} from 'vue';
import Header from './components/header/header.vue';

defineExpose({
  Header,
});

</script>

<template>
  <div>
    <Header v-show="($route.path!=='/login' && $route.path!=='/register') && $route.path!=='/email'"></Header>
    <router-view></router-view>
  </div>

</template>

<style scoped>

</style>
