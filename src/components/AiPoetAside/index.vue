<template>
  <div class="sidebar">
    <ul class="sidebar-menu">
      <li class="sidebar-item">
        <i class="icon-home">tx</i>
      </li>
      <el-divider />
      <li class="sidebar-item">
        <i class="icon-ai-tool">1</i>
      </li>
      <li class="sidebar-item">
        <i class="icon-design">2</i>

      </li>
      <li class="sidebar-item">
        <i class="icon-program">3</i>

      </li>
      <li class="sidebar-item">
        <i class="icon-shopping">4</i>

      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style lang="scss" scoped>
.sidebar {
  width: 50px;
  background-color: #342e05;
  opacity: 0.6;
  position: fixed;
  height: 70%;
  margin-top: 60px;
  margin-left: 20px;
  z-index: 999;
  border-radius: 20px;



  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    height: 50px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #3a4a58;
      border-radius: 20px;
    }

    i {
      width: 24px;
      height: 24px;
      margin: 0 20px;
      font-size: 20px;
    }

  }

}

// Add media query for responsive design if needed
@media (min-width: 768px) {
  .sidebar-item span {
    display: inline;
  }
}

.el-divider--horizontal{
  margin: 6px 0;
}
</style>
