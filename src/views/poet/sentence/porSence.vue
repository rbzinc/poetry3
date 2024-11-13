<script setup>
import { ref, onMounted } from 'vue'
import Search from "../../../components/search/search.vue"
import { getsenRandomData,getSentenceData } from "../../../api/modules/poePavilion"
import { defineExpose } from "vue"
defineExpose({
  Search
})
const randomList =ref([])
let getList = ref([])
let poetname = ref('')
let usePoetName = ref('')
const isopen =ref(false)
let pagetotal = ref()
const getsenRandom = async () =>{
  const res = await getsenRandomData()
  getList.value=res.data
}
const getSentence = async (poetname,pagenum) =>{
  usePoetName.value = poetname
  const res = await getSentenceData(poetname,pagenum)
  getList.value=res.data.records
  pagetotal = res.data.total
  console.log(pagetotal.value)
}
//分页查询名句
const currentChange = (pagenum) =>{
  getSentence(usePoetName.value,pagenum)
}

const toggleopened = () =>{
    isopen.value = !isopen.value
  }

onMounted(() => {
  getsenRandom()
})


</script>

<template>
  <div>
    <Search v-model="searchKeyword"></Search>
    <div class="book">
      <div class="box">
        <div class="son">
          <div class="left">诗人 :</div>
          <div :class="[isopen ? 'change' : 'right']" @click="toggleopened">
            <div class="buon" @click="getSentence('李白')">李白</div>
            <div class="buon" @click="getSentence('杜甫')">杜甫</div>
            <div class="buon" @click="getSentence('李清照')">李清照</div>
            <div class="buon" @click="getSentence('白居易')">白居易</div>
            <div class="buon" @click="getSentence('苏轼')">苏轼</div>
            <div class="buon" @click="getSentence('李商隐')">李商隐</div>
            <div class="buon" @click="getSentence('刘禹锡')">刘禹锡</div>
            <div class="buon" @click="getSentence('高适')">高适</div>
            <div class="buon" @click="getSentence('孟浩然')">孟浩然</div>
            <div class="buon" @click="getSentence('王安石')">王安石</div>
            <div class="buon" @click="getSentence('欧阳修')">欧阳修</div>
            <div class="buon" @click="getSentence('王勃')">王勃</div>
            <div class="buon" @click="getSentence('曹植')">曹植</div>
            <div class="buon" @click="getSentence('晏殊')">晏殊</div>
            <div class="buon" @click="getSentence('杨万里')">杨万里</div>
            <div class="buon" @click="getSentence('黄庭坚')">黄庭坚</div> 
            <div class="buon" @click="getSentence('杜牧')">杜牧</div> 
            <div class="buon" @click="getSentence('岑参')">岑参</div> 
            <div class="buon" @click="getSentence('李贺')">李贺</div>
            <div class="buon" @click="getSentence('元稹')">元稹</div> 
            <div class="buon" @click="getSentence('纳兰性德')">纳兰性德</div> 
          </div>
          <div :class="[isopen ? 'open' : 'chopen']" @click="toggleopened">
            <img src="https://ziyuan.guwendao.net/siteimg/jianBtn.png" alt="" width="13px" height="13px">
          </div>
        </div>
      </div>
      <div class="dy" v-for="item in getList" :key="item.id"> 
        {{ item.name }}——{{ item.fromm }}</div>
        <el-pagination
          :page-size="pagesize"
          :pager-count="11"
          layout="prev, pager, next"
          :total="pagetotal"
          @current-change="currentChange"
        />
      </div>
  </div>
</template>

<style scoped>
.book {
    width: 1100px;
    background:none;
    box-sizing: border-box;
    padding: 30px 40px;
    .dy {
      margin: 0 auto 10px;
      border: 1px solid #000; 
      padding: 20px; 
      width: 1000px; 
      box-sizing: border-box; 
      background-color: #e5e6e4;
      border-radius: 10px;
      opacity: 50%;
      .content {
        line-height: 20px;
        font-size: 5px;
        color: #333;
      }
    }
    .box{
      width: 1000px;
      box-sizing: border-box;
      background: #f3f2f2;
      opacity: 70%;
      margin: 0 auto;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
     .son{
      width: 970px;
      background: none;
      display: flex;
      .left{
        width: 60px;
        height: 50px;
        background: none;
        text-align: center;
        line-height: 50px;
        font-size: 17px;
        display: flex; 
        align-items: center; 
        justify-content: center; 
      }
      .right{
        width: 850px;
        background: none;
        height: 50px; 
        transition: height 0.3s; 
        display: flex;
        overflow: hidden; 
        cursor: pointer;
        .buon{
          height: 50px;
          padding: 0 10px;
          background:none;
          box-sizing: border-box;
          white-space: nowrap;
          text-align: center;
          line-height: 50px;
        }
      }
      .change{
        width: 850px;
        background: none;
        height: auto; 
        transition: height 0.3s;
        display: flex;
        flex-wrap: wrap;
        cursor: pointer
        }
        .buon{
          height: 50px;
          padding: 0 10px;
          background:none;
          box-sizing: border-box;
          white-space: nowrap;
          text-align: center;
          line-height: 50px;
        }
      }
      .no-son{
      width: 970px;
      background: none;
      display: flex;
      border-bottom: none;
      }
    }
      .open{
        width: 60px;
        height: 50px;
        background: none;
        display: grid;
        place-items: center;
      }
      .chopen{
        width: 60px;
        height: 50px;
        background: none;
        display: grid;
        place-items: center;
        transition: transform 0.5s ease;
        transform: scaleY(-1)
      }
  }
</style>
