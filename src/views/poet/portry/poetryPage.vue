<script setup>

import { storeToRefs } from "pinia"
import { defineExpose } from "vue";
import { userSearchStore } from "@/stores/index.js";
import Poetryitem from "../../../components/poetryitem/poetryitem.vue";
import Search from "../../../components/search/search.vue";
const poetstore = userSearchStore()
const { dynastyList,classList} = storeToRefs(poetstore)
defineExpose({
  Poetryitem,
  Search
})
console.log(dynastyList.value);

</script>

<template>
  <Search></Search>
 <div class="book">
  <div class="box">
      <h2>朝代</h2>
      <div class="dy" >
        <div class="dy-content" v-for="item in dynastyList" :key="item.id">
          {{ item.data }}
        </div>
      </div>
      <h2>分类</h2>
      <div class="dy">
        <div class="dy-content" v-for="item in classList" :key="item.id">
          {{ item.data }}
        </div>
      </div>
      <Poetryitem></Poetryitem>
  </div>
 </div>

</template>

<style scoped>
.book {
    width: 1000px;
    background-color: rgb(0, 255, 98);
    box-sizing: border-box;
    margin: 0 auto;
    padding: 30px 30px;
    .box{
      width: 940px;
      background-color: #f594b3;
      box-sizing: border-box;
      .dy {
        margin: 0 auto;
        border: 1px solid #000;
        padding: 20px;
        width: 840px;
        box-sizing: border-box;
        background-color: #dfefac;
        .content {
          font-size: 5px;
          color: #333;
        }
      }

    }
  }
</style>
