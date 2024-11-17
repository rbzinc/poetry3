<script setup>
import { ref, watch } from 'vue'
import MarkdownRenderer from "./markdownRenderer/index.vue"

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const markdown = ref(props.content)

</script>

<template>
  <MarkdownRenderer :source="markdown" />
</template>
<style lang="scss">
</style>
