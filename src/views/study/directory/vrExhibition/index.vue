<script setup>
import { onMounted, ref } from "vue";
import router from "@/router/index.js";

const currentPage = ref(1);
const pageSize = ref(6);
const total = ref(0);

const fictitiousList = ref([
  {
    id: 1,
    url: "https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt.jpg",
    poem: "大漠孤烟直，长河落日圆",
  },
  {
    id: 2,
    url: "https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt2.jpg",
    poem: "青山横北郭，白水绕东城",
  },
  {
    id: 3,
    url: "https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt3.jpg",
    poem: "会当凌绝顶，一览众山小",
  },
  {
    id: 4,
    url: "https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt4.jpg",
    poem: "落霞与孤鹜齐飞，秋水共长天一色",
  },
  {
    id: 5,
    url: "https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt5.jpg",
    poem: "千山鸟飞绝，万径人踪灭",
  },
  {
    id: 6,
    url: "https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt6.jpg",
    poem: "一道残阳铺水中，半江瑟瑟半江红",
  },
]);

// 点击跳转到景点详情页
function goToDetail(item) {
  console.log(item);
  router.push(`/ai/vrExhibitionDetail?id=${item.id}`);
}

onMounted(() => {});
</script>
<template>
  <div class="fictitious-container">
    <h2 class="header-title">VR助学</h2>
    <div class="fictitious-container-list">
      <div class="elCard">
        <el-card
          class="elCard-item"
          v-for="item in fictitiousList"
          :key="item.id"
          shadow="hover"
          @click="goToDetail(item)"
        >
          <img :src="item.url" alt="image" style="width: 100%; height: 175px" />
          <template #footer>
            <div class="overlay">{{ item.poem }}</div>
          </template>
        </el-card>
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fictitious-container {
  background-image: url("@/assets/pic/study/799d4d5991388a52874f6b3b602989d.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .header-title {
    text-align: center;
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 30px;
    margin-top: 10px;
  }

  .fictitious-container-list {
    padding: 0 100px;

    .elCard {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      width: 100%;

      .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;

        font-size: 18px;
        font-weight: bold;
      }

      .el-card {
        --el-card-padding: 0px;
      }

      .elCard-item {
        width: 28%;
        height: 210px;
        margin-bottom: 20px;
        cursor: pointer;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease;
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 40px auto;
    width: 100%;
  }
}
</style>
