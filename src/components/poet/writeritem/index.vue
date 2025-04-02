<script setup>
import { defineProps, ref } from "vue";
import { Star, VideoPlay } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { userCollectPoem } from "@/api/index.js";
const router = useRouter();
const props = defineProps({
  name: String,
  content: String,
  dynasty: String,
});
const bgcActive = ref(false);
const writerDetails = () => {
  router.push(`/writer${item.id}`);
};
const collect = async () => {
  const res = await userCollectPoem(item.id);
  bgcActive.value = !bgcActive.value;
};
</script>

<template>
  <div class="poetry-component">
    <div class="title" @click="writerDetails">
      {{ name }}
      <div class="author">（{{ dynasty }}）</div>
    </div>

    <div class="stanza">
      <p class="line">
        {{ content }}
      </p>
    </div>
    <div class="footer">
      <el-icon size="24" class="icon" @click="collect"><Star /> </el-icon>
      <el-icon size="24" class="icon"><VideoPlay /> </el-icon>
    </div>
  </div>
</template>

<style scoped>
.poetry-component {
  width: 970px;
  margin: 20px auto 0;
  padding: 10px;
  background-color: #f3f2f2;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-family: "Georgia", serif;
  color: #333;
  line-height: 1.6;
  &:hover {
    color: rgb(133, 133, 133);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }
  .title {
    height: 70px;
    font-size: 30px;
    color: #5c5c5c;
    text-decoration: none;
    display: flex;
    line-height: 70px;
    margin: 0 10px;
  }
  p {
    margin: 0 10px;
    text-decoration: none;
    color: #5c5c5c;
  }
  .author {
    font-style: italic;
    font-size: 17px;
    text-align: center;
    color: #777;
    text-align: center;
    text-decoration: none;
    margin-top: 5px;
  }
  .stanza {
    margin: 0 15px;
    text-align: center;
    align-items: center;
  }
  .line {
    margin: 10px 0;
    text-align: left;
  }
  .footer {
    width: 970px;
    height: 40px;
    background: none;
    display: flex;
    .active {
      width: 40px;
      height: 40px;
      background-color: #f6a4a4;
    }
    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
