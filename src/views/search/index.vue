<script setup>
import { defineExpose,ref} from "vue"
import { useRouter} from "vue-router"
import { userSearchStore } from '../../stores/modules/search'
import SearchSen from "../../components/search/searchsen.vue"
const userSearch = userSearchStore()
defineExpose({
  SearchSen
})
const input = ref('')
const activeNav = ref(null)
const router = useRouter()
const handleSearch = () => {
  userSearch.userinput = input.value
  router.push('/poetsearch')
}
const handleClick = (event) => {
  const navCards = document.querySelectorAll('.nav a')
  navCards.forEach(card => card.style.backgroundColor = '')
  event.target.style.backgroundColor = '#dcdbdb'
  activeNav.value = event.target
}

</script>

<template>
  <div class="home">
    <div class="header">
      <div class="search">
        <el-input v-model="input"
                  class="el-input"
                  placeholder="回车进行搜索"
                  @keyup.enter="handleSearch" />
      </div>
    </div>
    <div class="nav">
      <router-link to="/writersearch" @click="handleClick">诗人</router-link>
      <router-link to="/poetsearch"@click="handleClick">古诗</router-link>
      <router-link to="/sensearch"@click="handleClick">名句</router-link>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>

  </div>
</template>

<style scoped lang="scss">
.home{
  height: 1000px;
  background: none;
  margin: 10px auto 0;
  .header{
    width: 100%;
    height: 160px;
    padding-top: 30px;
    background: none;
    text-align: center;
    background-image: url('./pic/微信图片_20241116182414.jpg');
    background-size: 100% 100%;
    .search{
      width: 1000px;
      height: 80px;
      margin: 0 auto;
      display: flex;
      background-color: rgb(194, 194, 194);
      opacity: 0.6;
      box-sizing: border-box;
      text-align: center;
      align-items: center;
      border-radius: 10px;
    }
    .el-input{
      border: 2px #aca9a9 ;
      border-radius: 50px;
      width: 720px;
      height: 40px;
      margin: 0 auto;
    }
  }
  .nav{
    width: 1200px;
    height: 50px;
    background: none;
    padding: 10px 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    list-style: none;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    display: flex;
    a{
      width: 100px;
      display: block;
      line-height: 50px;
      color: rgb(112, 112, 112);
      text-align: center;
      text-decoration: none;
      border: 2px solid transparent;
      cursor: pointer;
      transition: border-color 0.3s, transform 0.3s;

      &:active{
        background-color: #dcdbdb;
        transform: scale(0.98);
      }
    }

  }
  .body{
    width: 1200px;
    background: none;
    margin: 0 auto;
  }
}
</style>
