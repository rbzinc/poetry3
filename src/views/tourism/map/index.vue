<script setup>
import { ref, computed, nextTick } from 'vue'
import PoetryGaodeMap from '../components/PoetryGaodeMap/index.vue'
import { useMapDataSceneryStore } from '@/stores/modules/mapData.js' // 确认路径
import { Grid, Place } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router' // {{ 重新导入 useRouter }}
import * as ROUTES from '@/constants/router.js' // {{ 重新导入 ROUTES }}

const mapDataStore = useMapDataSceneryStore()
const MARKERS_PER_PROVINCE = 3
const mapRef = ref(null)
const selectedProvince = ref('all')
const router = useRouter() // {{ 获取 router 实例 }}

const availableProvinces = computed(() => {
  // ... 省份计算逻辑不变 ...
  const provinces = new Set()
  mapDataStore.mapSceneryList.forEach((item) => {
    if (item.province) {
      provinces.add(item.province)
    }
  })
  const provinceList = Array.from(provinces).map((p) => ({ label: p, value: p }))
  return [{ label: '全部', value: 'all' }, ...provinceList]
})

const mapMarkers = computed(() => {
  // ... 标记点计算逻辑不变 ...
  const markers = []
  const provinceCounts = {}
  const allMapSceneryData = Array.isArray(mapDataStore.mapSceneryList) ? mapDataStore.mapSceneryList : []

  allMapSceneryData.forEach((scenery) => {
    if (
      scenery.province &&
      scenery.location &&
      Array.isArray(scenery.location) &&
      scenery.location.length === 2 &&
      !isNaN(scenery.location[0]) &&
      !isNaN(scenery.location[1])
    ) {
      if (selectedProvince.value !== 'all') {
        if (scenery.province === selectedProvince.value) {
          markers.push({
            id: scenery.id,
            name: scenery.name,
            location: scenery.location,
            description: scenery.description || `关于${scenery.name}的诗意描述...`,
            province: scenery.province,
          })
        }
      } else {
        const provinceKey = scenery.province
        if (!provinceCounts[provinceKey]) {
          provinceCounts[provinceKey] = 0
        }
        if (provinceCounts[provinceKey] < MARKERS_PER_PROVINCE) {
          markers.push({
            id: scenery.id,
            name: scenery.name,
            location: scenery.location,
            description: scenery.description || `关于${scenery.name}的诗意描述...`,
            province: scenery.province,
          })
          provinceCounts[provinceKey]++
        }
      }
    }
  })
  console.log(`地图标记点数据 (省份: ${selectedProvince.value}):`, markers)
  return markers
})

const handleProvinceSelect = (provinceValue) => {
  selectedProvince.value = provinceValue
  // {{ 延迟调用 focusOnMarkers，确保 mapMarkers 更新完毕 }}
  nextTick(() => {
    mapRef.value?.focusOnMarkers() // 调用子组件暴露的方法
  })
}

// {{ 新增：处理地图组件发出的事件 }}
const handleMarkerDetailClick = (sceneryId) => {
  console.log('父组件接收到 marker-detail-click 事件，ID:', sceneryId)
  if (sceneryId) {
    router.push({ path: ROUTES.TOURISM_SCENERY, query: { id: sceneryId } })
  } else {
    console.warn('接收到的景点 ID 无效')
  }
}

</script>

<template>
  <div class="tourism-map-container">
    <!-- 左侧地图区域 -->
    <div class="map-area">
      <!-- {{ 监听子组件事件 }} -->
      <PoetryGaodeMap
        ref="mapRef"
        :markers-data="mapMarkers"
        @marker-detail-click="handleMarkerDetailClick"
      />
    </div>

    <!-- 右侧信息展示区域 -->
    <div class="info-area province-list-area">
      <h3>探索省份</h3>
      <el-divider />
      <el-menu :default-active="selectedProvince" class="province-menu" @select="handleProvinceSelect">
        <el-menu-item v-for="province in availableProvinces" :key="province.value" :index="province.value">
          <el-icon v-if="province.value !== 'all'"><Place /></el-icon>
          <el-icon v-else><Grid /></el-icon>
          <span>{{ province.label }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ... 样式保持不变 ... */
.tourism-map-container {
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  overflow: hidden;
}

.map-area {
  flex: 0 0 70%; // {{ 恢复 70% 宽度或根据需要调整 }}
  height: 100%;
  position: relative;
}

.info-area.province-list-area {
  flex: 1; // {{ 占据剩余 30% }}
  height: 100%;
  background-color: #f8f9fa;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  h3 {
    margin: 0;
    padding: 20px;
    color: #333;
    text-align: center;
    flex-shrink: 0;
  }

  .el-divider {
    margin: 0 0 10px 0;
    flex-shrink: 0;
  }

  .province-menu {
    flex-grow: 1;
    overflow-y: auto;
    border-right: none;
    background-color: transparent;

    .el-menu-item {
      height: 45px;
      line-height: 45px;
      font-size: 15px;
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      &.is-active {
        background-color: #ecf5ff;
        color: #409eff;
      }

      &:hover {
        background-color: #f0f2f5;
      }
    }
  }
}
</style>