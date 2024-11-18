<script setup>
import {defineProps, defineEmits, ref} from "vue";
import ChildComment from "../ChildComment/index.vue";
import {useUserInfoStore} from "@/stores/index.js";
// 接收父组件传过来的值
const username = ref('')
const userInfo = useUserInfoStore()
username.value = userInfo.userInfo.username
const props = defineProps({
  secondComments: {
    type: Array,
    default: [],
  },
  parentName: {
    type: String,
    required: true,
  }
});
const secondComments = props.secondComments;
const parentName = props.parentName;
console.log(props.secondComments)
console.log(props.parentName)
// console.log("🚀 ~ parentName:", parentName);
// console.log("🚀 ~ childComments:", childComments);

// 声明需要抛出的事件
const emit = defineEmits(["to-reply"]);

const handleReply = (rootCommentId, parentId) => {
  // 【注意】这里不以对象形式包裹发送，会导致嵌套；父组件中回复一级评论与子级评论共用一个传值方法
  emit("to-reply", rootCommentId, parentId);
};
</script>


<!-- 三级及以上评论 -->
<template>
  <div class="sub-reply-container" v-if="secondComments && secondComments.length">
    <div class="sub-reply" v-for="(child, index) in secondComments" :key="index">
      <!-- 渲染内容 -->
      <div class="listbox-top-user">
<!--        <el-avatar :size="30" :src="child.userImg" />-->
        <el-avatar :size="30" :src="child.touxiang" />
        <p>
          <span>{{ child.name }}</span>
          <span>{{ child.context }}</span>
          回复
          <span>@{{ parentName }}</span>
        </p>
      </div>
      <div class="listbox-middle-root">{{ child.context }}</div>
      <div class="listbox-bottom">
<!--        <span>发布时间：{{ child.createdAt }}</span>-->
        <span>发布时间：{{child.create_time }}</span>
        <span v-show="child.name !== username" @click="handleReply(child.rootCommentId, child.id)">回复</span>
      </div>

      <!-- 递归地渲染子评论的子评论：调用自己 -->
<!--      :parentName="child.createdBy"-->

    </div>
  </div>
</template>

<style lang="scss" scoped>
$second-text: #666;
$title-color: #0c9dd2;

.listbox-top-user {
  display: flex;

  p {
    margin-left: 10px;
    width: 100%;

    // 姓名条
    span:first-child {
      color: $second-text;
    }

    // 身份标签
    span:nth-child(2) {
      margin-left: 5px;
      font-size: 8px;
      padding: 2px;
      background-color: $title-color;
      color: white;
      border-radius: 5px;
      position: relative;
      bottom: 4px;
    }

    // 父级姓名条
    span:last-child {
      color: #0c9dd2;
    }
  }
}

.listbox-middle-root,
.listbox-bottom {
  margin-left: 38px;
}

.listbox-bottom {
  font-size: 12px;
  color: #9499a0;
  margin: 10px 0 10px 35px;
  display: flex;

  span {
    display: block;
    margin-right: 20px;
  }

  span:last-child:hover {
    cursor: pointer;
    color: $title-color;
  }
}
</style>
