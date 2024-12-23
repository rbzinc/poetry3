<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { userSearchStore } from '@/stores/modules/search.js'
const userSearch = userSearchStore()
const input = ref('')
const router = useRouter()

const handleSearch = () => {
  userSearch.userInput = input.value
  // router.push('/poetsearch')

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
  display: flex;
  background-color: rgb(194, 194, 194);
  opacity: 0.6;
  align-items: center;
  border-radius: 10px;
  margin: 10px 0;
  .el-input {
    border: 2px #aca9a9;
    border-radius: 50px;
    width: 80%;
    height: 50%;
    margin: 0 auto;
  }
}


</style>
