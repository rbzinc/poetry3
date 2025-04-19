<template>
  <div id="main" class="markdow-page">
    <!-- 直接绑定 props.content 到 value -->
    <Viewer ref="markDownRef" :locale="zh" :value="props.content" :plugins="plugins" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Viewer } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import frontmatter from '@bytemd/plugin-frontmatter' // 解析前题
import mediumZoom from '@bytemd/plugin-medium-zoom' // 缩放图片
import breaks from '@bytemd/plugin-breaks'
import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/default.css'
import 'juejin-markdown-themes/dist/juejin.min.css'

// 定义 props
const props = defineProps({
  content: {
    type: String,
    required: true,
    default: '', // 添加默认值，避免潜在的 undefined 问题
  },
})

const plugins = [gfm(), gemoji(), highlight(), frontmatter(), mediumZoom(), breaks()]
const zh = zhHans
const markDownRef = ref(null)
</script>
<style lang="scss" scoped>
.markdow-page {
  width: 100%;

  :deep(pre code.hljs) {
    background-color: #e5e7ec; /* 深灰色背景 */
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
  }
  :deep(p) {
    text-indent: 2em;
  }
}
</style>
