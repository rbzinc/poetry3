<template>
  <div id="main" class="markdow-page">
    <Viewer ref="markDownRef" :locale="zh" :value="value" :plugins="plugins" />
  </div>
</template>
<script setup>
import {reactive, toRefs, onMounted} from 'vue'
import {Viewer} from '@bytemd/vue-next'
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

const state = reactive({
  value: '',
  plugins: [gfm(), gemoji(), highlight(), frontmatter(), mediumZoom(), breaks()],
  zh: zhHans,
  cateList: [], // 目录内容
  offsetTopList: [], //文档流中锚点距离顶部距离集合
  anchor: 0,
})
const {value, plugins, zh, markDownRef} = toRefs(state)
const props = defineProps({
  content: {
    type: String,
    required: true,
  }
})
const markdown = props.content

onMounted(() => {
  state.value = markdown
})

</script>
<style lang="scss" scoped>
.markdow-page {
  width: 100%;
  height: 100%;

  :deep(pre code.hljs) {
    background-color: #e5e7ec; /* 深灰色背景 */
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
  }
  :deep(p){

    text-indent: 2em;

  }
}

</style>
