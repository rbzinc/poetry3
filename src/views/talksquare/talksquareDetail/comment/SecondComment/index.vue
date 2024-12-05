<script setup>
import {defineProps, defineEmits, ref } from "vue";
import {useUserInfoStore} from "@/stores/index.js";

// 获取用户信息
const userInfo = useUserInfoStore();
const name = ref(userInfo.userInfo.name || '');

// 定义属性
const props = defineProps({
  secondComments: {
    type: Array,
    default: () => [],
  },
  parentName: {
    type: String,
    required: true,
  }
});

// 将属性简化赋值
const { secondComments = [], parentName, replyComment } = props;

// 初始化评论列表
const commentList = ref([{ comments: secondComments, parent: parentName}]);
const showInput = ref({});

const emit = defineEmits(["to-reply"]);

// 处理回复操作
const handleReply = (parentId, tagerrName) => {
  console.log(parentId, tagerrName)
  emit("to-reply", parentId, tagerrName);
};
</script>

<template>
  <div class="sub-reply-container" v-if="commentList[0].comments.length">
    <div class="sub-reply" v-for="(item, index) in commentList[0].comments" :key="index">
      <div class="listbox-top-user">
<!--头像部分-->
        <el-avatar :size="30" :src="item.touxiang"/>
<!--姓名，回复框-->
        <p>
          <span>{{ item.name }}</span>
          <span v-if="item.tagerrName === commentList[0].parent">回复</span>
          <span style="color: #0c9dd2;" v-if="item.tagerrName === commentList[0].parent">@{{ parentName }}</span>
        </p>
<!--内容-->
      </div>
      <div class="listbox-middle-root">{{ item.context }}</div>
      <div class="listbox-bottom">
        <span>发布时间：{{ item.createTiem }}</span>
        <span v-show="item.name !== name" @click="handleReply(item.id, item.tagerrName)">回复</span>
      </div>
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
    span {
      margin-right: 10px;
    }
    // 姓名条
    span:first-child {
      color: $second-text;
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
