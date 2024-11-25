<script setup>
import { ref } from 'vue'
import { useRouter,useRoute } from "vue-router"
import { userSearchStore } from '../../stores/modules/search'
const userSearch = userSearchStore()
const input = ref('')
const router = useRouter()
const handleSearch = () => {
  userSearch.userinput = input.value
  router.push('/poetsearch')
}

</script>

<template>
 <div class="search">
    <el-input v-model="input" 
    class="el-input"
    placeholder="回车进行搜索"
    @keyup.enter="handleSearch" />
 </div>
</template>

<style scoped lang="scss">
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
</style>