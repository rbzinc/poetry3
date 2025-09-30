<script setup>
// 引入必要的 Vue 组件和工具
import { ref, reactive, computed, watch } from 'vue'
import SecondComment from './SecondComment/index.vue' // 子评论组件
import { useUserInfoStore } from '@/stores/index.js' // 用户信息存储
import { userLuntanFabacommentPostApi } from '@/api/modules/talkSquare.js' // 评论相关 API
import { ElMessage } from 'element-plus' // Element Plus 消息组件

// 定义组件接收的属性
const props = defineProps({
  blogId: {
    type: [String, Number],
    required: true, // 博客ID，必需参数
  },
  commentData: {
    type: Array,
    default: () => [], // 评论数据，默认为空数组
  },
  isLoadingComments: {
    type: Boolean,
    default: false, // 评论加载状态，默认为 false
  },
  comments: {
    type: Number,
    default: 0, // 评论总数，默认为 0
  },
})

// 定义组件触发的事件
const emit = defineEmits(['refresh-comments']) // 刷新评论事件

// 状态管理
const userInfo = useUserInfoStore() // 获取用户信息存储
const currentUserName = computed(() => userInfo.userInfo.name) // 计算当前用户名
const currentUserAvatar = computed(() => userInfo.userInfo.touxiang) // 计算当前用户头像

// 评论相关状态
const rootCommentInput = ref('') // 根评论输入内容
const replyInputs = reactive({}) // 回复输入内容，格式: { commentId: '内容' }
const showReplyInputs = reactive({}) // 控制回复框显示状态，格式: { commentId: true/false }
const showChildComments = reactive({}) // 控制子评论显示状态，格式: { commentId: true/false }

// 提交状态管理
const isSubmittingRoot = ref(false) // 根评论提交状态
const isSubmittingReply = reactive({}) // 回复评论提交状态，格式: { commentId: true/false }

// 监听评论数据变化，初始化相关状态
watch(
  () => props.commentData,
  (newComments) => {
    if (Array.isArray(newComments)) {
      newComments.forEach((item) => {
        // 初始化根评论状态，保留已有状态避免覆盖
        if (!(item.id in showChildComments)) {
          showChildComments[item.id] = false // 默认折叠子评论
        }
        if (!(item.id in showReplyInputs)) {
          showReplyInputs[item.id] = false // 默认隐藏回复框
        }
        if (!(item.id in replyInputs)) {
          replyInputs[item.id] = '' // 初始化回复内容为空
        }
        if (!(item.id in isSubmittingReply)) {
          isSubmittingReply[item.id] = false // 初始化提交状态为非提交中
        }

        // 初始化子评论状态
        if (item.children && Array.isArray(item.children)) {
          item.children.forEach((child) => {
            if (!(child.id in showReplyInputs)) {
              showReplyInputs[child.id] = false // 默认隐藏子评论回复框
            }
            if (!(child.id in replyInputs)) {
              replyInputs[child.id] = '' // 初始化子评论回复内容为空
            }
            if (!(child.id in isSubmittingReply)) {
              isSubmittingReply[child.id] = false // 初始化子评论提交状态为非提交中
            }
          })
        }
      })
    }
  },
  { immediate: true, deep: true }, // 立即执行并深度监听
)

/**
 * 提交根评论方法
 * 处理用户发布新评论的逻辑
 */
const submitRootComment = async () => {
  const content = rootCommentInput.value.trim() // 获取并去除首尾空格
  if (!content) {
    ElMessage.warning('评论内容不能为空') // 内容为空时提示
    return
  }

  isSubmittingRoot.value = true // 设置提交状态为提交中
  try {
    // 调用 API 发布评论，parentId 为 -1 表示根评论
    const res = await userLuntanFabacommentPostApi(-1, '', content, props.blogId)
    if (res.data === '发布成功') {
      ElMessage.success('发布成功') // 提示成功
      rootCommentInput.value = '' // 清空输入框
      emit('refresh-comments') // 通知父组件刷新评论列表
    } else {
      ElMessage.error(res.message || '发布失败') // 提示失败原因
    }
  } catch (error) {
    console.error('发布根评论失败:', error) // 记录错误
    ElMessage.error('发布评论失败，请检查网络') // 提示网络错误
  } finally {
    isSubmittingRoot.value = false // 无论成功失败，重置提交状态
  }
}

/**
 * 提交回复评论方法
 * 处理用户回复他人评论的逻辑
 * @param {number} parentId - 被回复评论的 ID
 * @param {string} parentName - 被回复用户的名字
 */
const submitReply = async (parentId, parentName) => {
  const content = replyInputs[parentId]?.trim() || '' // 获取并去除首尾空格
  if (!content) {
    ElMessage.warning('回复内容不能为空') // 内容为空时提示
    return
  }

  isSubmittingReply[parentId] = true // 设置当前回复的提交状态为提交中
  try {
    // 调用 API 发布回复
    const res = await userLuntanFabacommentPostApi(parentId, parentName, content, props.blogId)
    if (res.data === '发布成功') {
      ElMessage.success('回复成功') // 提示成功
      replyInputs[parentId] = '' // 清空对应输入框
      showReplyInputs[parentId] = false // 关闭回复框
      emit('refresh-comments') // 通知父组件刷新评论列表
    } else {
      ElMessage.error(res.message || '回复失败') // 提示失败原因
    }
  } catch (error) {
    console.error('回复评论失败:', error) // 记录错误
    ElMessage.error('回复评论失败，请检查网络') // 提示网络错误
  } finally {
    // 重置提交状态在 API 响应后自动处理
  }
}

/**
 * 切换回复输入框显示状态
 * 确保同一时间只有一个回复框显示
 * @param {object} commentItem - 被点击回复的评论对象
 */
const toggleReplyInput = (commentItem) => {
  const commentId = commentItem.id
  // 先关闭所有打开的回复框，确保只有一个回复框显示
  Object.keys(showReplyInputs).forEach((key) => {
    showReplyInputs[key] = false
  })

  // 切换当前点击的回复框状态
  showReplyInputs[commentId] = !showReplyInputs[commentId]

  // 如果是打开状态，清空可能残留的输入内容
  if (showReplyInputs[commentId]) {
    replyInputs[commentId] = ''
  }
}
</script>

<template>
  <div class="comments">
    <!-- 评论卡片容器，带加载状态 -->
    <el-card v-loading="props.isLoadingComments">
      <!-- 头部：评论计数 -->
      <template #header>
        <div class="comments-header">
          <h3>评论 {{ comments }}</h3>
        </div>
      </template>

      <!-- 评论输入区 -->
      <div class="editbox">
        <div class="editbox-left">
          <el-avatar :size="45" :src="currentUserAvatar" />
        </div>
        <div class="editbox-middle">
          <el-input
            placeholder="与其赞同别人的话语，不如自己畅所欲言..."
            v-model.trim="rootCommentInput"
            :disabled="isSubmittingRoot"
          ></el-input>
        </div>
        <div class="editbox-right">
          <el-button @click="submitRootComment" :loading="isSubmittingRoot" type="primary">
            {{ isSubmittingRoot ? '发布中...' : '发布' }}
          </el-button>
        </div>
      </div>

      <!-- 评论列表区 -->
      <div class="listbox" v-for="item in props.commentData" :key="item.id">
        <!-- 根评论内容 -->
        <div class="top-level">
          <div class="listbox-top-user">
            <el-avatar :size="38" :src="item.touxiang" />
            <p>
              <span>{{ item.name }}</span>
            </p>
          </div>
          <div class="listbox-middle-root">{{ item.context }}</div>
          <div class="listbox-bottom">
            <span>发布时间：{{ item.createTiem }}</span>
            <span v-show="item.name !== currentUserName" @click="toggleReplyInput(item)">回复</span>
          </div>
        </div>

        <!-- 子评论展开/折叠控制 -->
        <div
          v-if="item.children && item.children.length"
          class="view-more-toggle"
          @click="showChildComments[item.id] = !showChildComments[item.id]"
        >
          {{ showChildComments[item.id] ? '收起评论' : `查看 ${item.children.length} 条回复` }}
          <el-icon v-if="!showChildComments[item.id]"><ArrowDown /></el-icon>
          <el-icon v-else><ArrowUp /></el-icon>
        </div>

        <!-- 子评论组件 -->
        <div v-if="item.children && item.children.length && showChildComments[item.id]">
          <SecondComment
            :secondComments="item.children"
            :parentName="item.name"
            :currentUserName="currentUserName"
            @to-reply="toggleReplyInput"
            style="margin-left: 60px"
          />
        </div>

        <!-- 根评论回复框 -->
        <div class="reply-box-container" v-show="showReplyInputs[item.id]">
          <div class="replybox" :id="'reply-box-' + item.id">
            <div class="replybox-left">
              <el-avatar :size="30" :src="currentUserAvatar" />
            </div>
            <div class="replybox-middle">
              <el-input
                :placeholder="`回复 ${item.name}`"
                v-model.trim="replyInputs[item.id]"
                :disabled="isSubmittingReply[item.id]"
              ></el-input>
            </div>
            <div class="replybox-right">
              <el-button @click="submitReply(item.id, item.name)" :loading="isSubmittingReply[item.id]" type="primary">
                {{ isSubmittingReply[item.id] ? '提交中...' : '提交' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 子评论回复框 -->
        <div v-if="item.children && item.children.length">
          <div v-for="childItem in item.children" :key="`child-${childItem.id}`">
            <div class="reply-box-container" v-show="showReplyInputs[childItem.id]">
              <div class="replybox" :id="'reply-box-' + childItem.id">
                <div class="replybox-left">
                  <el-avatar :size="30" :src="currentUserAvatar" />
                </div>
                <div class="replybox-middle">
                  <el-input
                    :placeholder="`回复 ${childItem.name}`"
                    v-model.trim="replyInputs[childItem.id]"
                    :disabled="isSubmittingReply[childItem.id]"
                  ></el-input>
                </div>
                <div class="replybox-right">
                  <el-button
                    @click="submitReply(childItem.id, childItem.name)"
                    :loading="isSubmittingReply[childItem.id]"
                    type="primary"
                  >
                    {{ isSubmittingReply[childItem.id] ? '提交中...' : '提交' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无评论时显示空状态 -->
      <el-empty v-if="!props.isLoadingComments && comments === 0" description="还没有评论，快来抢沙发吧！" />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.comments {
  margin-top: 0;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  :deep(.el-card) {
    border: none;
    box-shadow: none;

    .el-card__header {
      padding: 0 0 24px 0;
      border-bottom: 2px solid #f0f0f0;
    }

    .el-card__body {
      padding: 0;
    }
  }

  .comments-header {
    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  .editbox {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 24px 0;
    border-bottom: 2px solid #f0f0f0;

    .editbox-left {
      flex-shrink: 0;
    }

    .editbox-middle {
      flex: 1;

      :deep(.el-input__wrapper) {
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        &.is-focus {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
        }
      }
    }

    .editbox-right {
      flex-shrink: 0;

      .el-button {
        height: 45px;
        padding: 0 28px;
        border-radius: 12px;
        font-weight: 500;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }

  .listbox {
    padding: 24px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .top-level {
      .listbox-top-user {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .el-avatar {
          flex-shrink: 0;
        }

        p {
          margin: 0;
          
          span {
            font-size: 15px;
            font-weight: 600;
            color: #333;
          }
        }
      }

      .listbox-middle-root {
        margin-left: 50px;
        font-size: 15px;
        line-height: 1.8;
        color: #555;
        word-wrap: break-word;
        margin-bottom: 12px;
      }

      .listbox-bottom {
        margin-left: 50px;
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 13px;
        color: #999;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: #667eea;
          }

          &:last-child {
            color: #667eea;
            font-weight: 500;

            &:hover {
              color: #764ba2;
            }
          }
        }
      }
    }

    .view-more-toggle {
      margin: 16px 0 0 50px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(102, 126, 234, 0.08);
      border-radius: 8px;
      font-size: 13px;
      color: #667eea;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 14px;
      }

      &:hover {
        background: rgba(102, 126, 234, 0.15);
        transform: translateX(4px);
      }
    }

    .reply-box-container {
      margin-left: 50px;
      margin-top: 16px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 12px;

      .replybox {
        display: flex;
        gap: 12px;
        align-items: flex-start;

        .replybox-left {
          flex-shrink: 0;
        }

        .replybox-middle {
          flex: 1;

          :deep(.el-input__wrapper) {
            border-radius: 10px;
            padding: 10px 14px;
            background: white;
          }
        }

        .replybox-right {
          flex-shrink: 0;

          .el-button {
            height: 36px;
            padding: 0 20px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
          }
        }
      }
    }
  }
}
</style>
