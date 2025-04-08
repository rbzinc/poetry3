<template>
  <div id="viewer"></div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'
const route = useRoute()
const url = ref(null)
const fictitiousList = ref([
  {
    id: 1,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt.jpg',
    poem: '大漠孤烟直，长河落日圆',
  },
  {
    id: 2,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt2.jpg',
    poem: '青山横北郭，白水绕东城',
  },
  {
    id: 3,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt3.jpg',
    poem: '会当凌绝顶，一览众山小',
  },
  {
    id: 4,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt4.jpg',
    poem: '落霞与孤鹜齐飞，秋水共长天一色',
  },
  {
    id: 5,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt5.jpg',
    poem: '千山鸟飞绝，万径人踪灭',
  },
  {
    id: 6,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt6.jpg',
    poem: '一道残阳铺水中，半江瑟瑟半江红',
  },
])

// 监听 URL 的变化并初始化视图
watchEffect(() => {
  if (url.value) {
    initViewer(url.value)
  }
})

// 初始化全景图的函数
const initViewer = (panoramaUrl) => {
  new Viewer({
    container: document.querySelector('#viewer'),
    panorama: panoramaUrl,
    caption: 'Parc national du Mercantour <b>&copy; Damien Sorel</b>',
    description: '今天星期五，我在巴黎的Parc national du Mercantour参观。',
    navbar: ['fullscreen', 'autorotate', 'zoom', 'move', 'download', 'caption', 'description'],
    size: {
      width: '100%',
      height: '100vh',
    },
  })
}

// 页面挂载后调用数据获取函数
url.value = fictitiousList.value[route.query.id - 1].url
</script>

<style scoped></style>
