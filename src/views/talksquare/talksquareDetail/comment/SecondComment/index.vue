<script setup>
// 移除 ref
import { defineProps, defineEmits } from 'vue'
// 移除 useUserInfoStore，用户信息从 props 传入

// 定义属性
const props = defineProps({
  secondComments: {
    type: Array,
    default: () => [],
  },
  parentName: {
    // 根评论的作者名
    type: String,
    required: true,
  },
  currentUserName: {
    type: String,
    required: true,
  },
})
console.log(props)
// 移除 commentList 和 showInput

const emit = defineEmits(['to-reply'])

// 处理回复操作 (直接 emit)
const handleReply = (commentItem) => {
  // 传递整个评论对象给父组件，方便父组件获取 id 和 name
  emit('to-reply', commentItem)
}
</script>

<template>
  <!-- 直接判断 props.secondComments 是否有内容 -->
  <div class="sub-reply-container" v-if="props.secondComments.length">
    <!-- 直接遍历 props.secondComments -->
    <div class="sub-reply" v-for="item in props.secondComments" :key="item.id">
      <!-- 使用 item.id 作为 key -->
      <div class q="listbox-top-user">
        <!-- 头像部分，添加默认头像 -->
        <el-avatar v-if="item.touxiang" :size="30" :src="item.touxiang" />
        <el-avatar v-else :size="30" icon="UserFilled" />
        <!-- 姓名，回复信息 -->
        <p>
          <span>{{ item.name }}</span>
          <!-- 判断 tagerrName 是否存在且不等于根评论作者名，表示是回复子评论 -->
          <template v-if="item.tagerrName">
            <span class="reply-text">回复</span>
            <span class="reply-target">@{{ item.tagerrName }}</span>
          </template>
          <!-- 如果 tagerrName 等于根评论作者名，则不需要显示 "回复 @xxx" -->
        </p>
      </div>
      <!-- 内容 -->
      <div class="listbox-middle-root">{{ item.context }}</div>
      <!-- 底部信息 -->
      <div class="listbox-bottom">
        <span>发布时间：{{ item.createTiem }}</span>
        <span v-show="item.name !== props.currentUserName" @click="handleReply(item)">回复</span>
      </div>
      <!-- 子评论的回复框由父组件根据 showReplyInputs[item.id] 控制 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
$second-text: #666;
$title-color: #0c9dd2; // 考虑统一使用主题色 $primary-color
$primary-color: #409eff;

.sub-reply-container {
  margin-top: 10px; // 与父评论内容间距
}

.sub-reply {
  padding: 10px 0 10px 10px; // 增加左侧内边距，形成缩进感
  border-left: 2px solid #eee; // 添加左侧边框
  margin-bottom: 10px; // 子评论间距
  &:last-child {
    margin-bottom: 0;
  }
}

.listbox-top-user {
  display: flex;
  align-items: center; // 垂直居中

  .el-avatar {
    flex-shrink: 0;
  }

  p {
    margin-left: 10px;
    width: 100%;
    line-height: 1.4;
    font-size: 13px; // 调整字号

    span {
      margin-right: 5px; // 调整间距
    }
    // 姓名条
    span:first-child {
      color: $second-text;
      font-weight: 500;
    }
    // "回复" 文字
    .reply-text {
      color: #909399;
      font-size: 12px;
    }
    // "@xxx"
    .reply-target {
      color: $primary-color; // 使用主题色
      font-weight: 500;
    }
  }
}

.listbox-middle-root {
  margin: 5px 0 5px 40px; // 对齐头像下方
  font-size: 13px; // 调整字号
  line-height: 1.6;
  color: #555; // 调整颜色
  word-wrap: break-word;
}

.listbox-bottom {
  font-size: 12px;
  color: #9499a0;
  margin: 8px 0 0 40px; // 调整边距
  display: flex;
  align-items: center;

  span {
    display: block;
    margin-right: 15px;
  }

  span:last-child {
    cursor: pointer;
    &:hover {
      color: $primary-color; // 使用主题色
    }
  }
}
</style>
