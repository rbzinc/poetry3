<template>
  <!--  <last-page/>-->
  <div class="vr">
    <!-- 全景图容器 -->
    <div id="viewer"></div>
  </div>
</template>

<script setup>
import {ref, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import {Viewer} from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';


const route = useRoute();
const url = ref(null);
const fictitiousList = ref([
  {
    id: 1,
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/db735630-b8be-4e46-8ec9-eeb566705aa1.jpg',
    poem: '大漠孤烟直，长河落日圆'
  },
  {
    id: 2,
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/92fdd52d-f3e7-4a33-b420-ea9176bc2902.jpg',
    poem: '一道残阳铺水中，半江瑟瑟半江红'
  },
  {
    id: 3,
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/f1dbca4a-6fe6-42c3-90bf-8f613487ea66.jpg',
    poem: '会当凌绝顶，一览众山小'
  },
  {
    id: 4,
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/cdbfc399-a906-40ff-a6be-ef1e5d6c9114.jpg',
    poem: '落霞与孤鹜齐飞，秋水共长天一色'
  },
  {
    id: 5,
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/75076ab4-7499-43a3-b23d-a5d72d9a3f22.jpg',
    poem: '千山鸟飞绝，万径人踪灭'
  },
  {
    id: 6,
    url: 'https://webxiangmu.oss-cn-beijing.aliyuncs.com/lun/bf8747b3-418a-4e16-b5d7-bef232161dfb.jpg',
    poem: '青山横北郭，白水绕东城'
  },
])


// 监听 URL 的变化并初始化视图
watchEffect(() => {
  if (url.value) {
    initViewer(url.value);
  }
});

// 初始化全景图的函数
const initViewer = (panoramaUrl) => {
  const viewer = new Viewer({
    container: document.querySelector('#viewer'),
    panorama: panoramaUrl,
    navbar: [
      'autorotate',
      'zoom',
      'move',
      'caption',
      'fullscreen'
    ],
    size: {
      width: '100%',
      height: '100vh'
    }
  });
};

// 页面挂载后调用数据获取函数
url.value = fictitiousList.value[route.query.id].url;
</script>

<style scoped>
.vr {
  position: relative;
  overflow: hidden;
}
</style>
