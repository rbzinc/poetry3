<script setup>
import Textcard from '@/components/study/directory/GameStudy/textcard/index.vue'
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { BOOK_BG, GAME_BG, STUDY_BG } from '@/constants/bgUrl.js'

const searchQuery = ref('')
const dialogVisible = ref(false)
const newCategory = ref({
  name: '',
  description: '',
})

const dictionary = ref([
  {
    id: '0',
    name: '初中古诗词',
    content: '有65首诗，23首词',
    icon: '📚',
    progress: 30,
    description: '涵盖初中语文教材中的古诗词',
  },
  {
    id: '1',
    name: '高中古诗词',
    content: '有156首诗，32首词',
    icon: '📖',
    progress: 15,
    description: '高中语文必修教材中的古诗词',
  },
  {
    id: '2',
    name: '唐诗三百首',
    content: '有300首诗',
    icon: '🏮',
    progress: 5,
    description: '精选唐代诗歌三百首',
  },
])

// 搜索过滤
const filteredDictionary = computed(() => {
  return dictionary.value.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 添加新分类
const addNewCategory = () => {
  if (!newCategory.value.name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  dictionary.value.push({
    id: String(dictionary.value.length),
    name: newCategory.value.name,
    content: newCategory.value.description || '暂无内容',
    icon: '📝',
    progress: 0,
    description: newCategory.value.description,
  })

  dialogVisible.value = false
  newCategory.value = { name: '', description: '' }
  ElMessage.success('添加成功')
}
</script>

<template>
  <el-card
    class="dictionary-card"
    :style="{
      background: `url(${GAME_BG})`,
    }"
  >
    <template #header>
      <div class="card-header">
        <h2>诗词学习</h2>
        <el-input v-model="searchQuery" placeholder="搜索分类..." prefix-icon="Search" clearable class="search-input" />
      </div>
    </template>

    <div class="dictbox">
      <div v-for="item in filteredDictionary" :key="item.id" class="category-item">
        <Textcard
          :title="item.name"
          :content="item.content"
          :icon="item.icon"
          :progress="item.progress"
          :description="item.description"
        />
      </div>

      <div class="add" @click="dialogVisible = true">
        <el-icon class="icon"><Plus /></el-icon>
        <span>添加新分类</span>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="添加新分类" width="30%" :close-on-click-modal="false">
      <el-form :model="newCategory" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="newCategory.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newCategory.description" type="textarea" placeholder="请输入分类描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNewCategory">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped lang="scss">
.dictionary-card {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .search-input {
      width: 200px;
    }
  }

  .dictbox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;

    .category-item {
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .add {
      margin: 10px;
      width: 170px;
      height: 220px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border: 2px dashed #797878;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: #666;
      }

      .icon {
        font-size: 40px;
        color: #666;
        margin-bottom: 10px;
      }

      span {
        color: #666;
        font-size: 16px;
      }
    }
  }
}

:deep(.el-card__body) {
  padding: 0;
  overflow-y: auto;
  height: calc(100% - 60px);
}
</style>
