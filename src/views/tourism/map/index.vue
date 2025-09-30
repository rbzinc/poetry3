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
      <PoetryGaodeMap
        ref="mapRef"
        :markers-data="mapMarkers"
        @marker-detail-click="handleMarkerDetailClick"
      />
    </div>

    <!-- 右侧省份探索区域 -->
    <div class="province-sidebar">
      <!-- 标题区域 -->
      <div class="sidebar-header">
        <div class="header-icon">
          <el-icon><Guide /></el-icon>
        </div>
        <div class="header-content">
          <h3>探索省份</h3>
          <p class="subtitle">选择省份查看相关景点</p>
        </div>
      </div>

      <!-- 省份列表 -->
      <div class="province-list">
        <div
          v-for="province in availableProvinces"
          :key="province.value"
          class="province-item"
          :class="{ active: selectedProvince === province.value }"
          @click="handleProvinceSelect(province.value)"
        >
          <div class="item-icon">
            <el-icon v-if="province.value !== 'all'"><Place /></el-icon>
            <el-icon v-else><Grid /></el-icon>
          </div>
          <span class="item-label">{{ province.label }}</span>
          <div class="item-arrow">
            <el-icon><Right /></el-icon>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="sidebar-footer">
        <el-icon><InfoFilled /></el-icon>
        <span>点击省份查看诗词景点分布</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tourism-map-container {
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
}

.map-area {
  flex: 0 0 70%;
  height: 100%;
  position: relative;
  margin: 20px 0 20px 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

// 右侧省份探索区域
.province-sidebar {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

  // 标题区域
  .sidebar-header {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 16px;

    .header-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

      .el-icon {
        font-size: 32px;
        color: white;
      }
    }

    .header-content {
      flex: 1;

      h3 {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 600;
        color: #333;
      }

      .subtitle {
        margin: 0;
        font-size: 13px;
        color: #999;
      }
    }
  }

  // 省份列表
  .province-list {
    flex: 1;
    background: white;
    border-radius: 16px;
    padding: 12px;
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;

      &:hover {
        background: linear-gradient(135deg, #5568d3 0%, #6a4190 100%);
      }
    }

    .province-item {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      margin-bottom: 8px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f9f9f9;
      border: 2px solid transparent;

      .item-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e8e8e8;
        border-radius: 10px;
        flex-shrink: 0;
        transition: all 0.3s ease;

        .el-icon {
          font-size: 18px;
          color: #666;
          transition: color 0.3s ease;
        }
      }

      .item-label {
        flex: 1;
        margin-left: 14px;
        font-size: 15px;
        font-weight: 500;
        color: #555;
        transition: color 0.3s ease;
      }

      .item-arrow {
        opacity: 0;
        transform: translateX(-8px);
        transition: all 0.3s ease;

        .el-icon {
          font-size: 16px;
          color: #667eea;
        }
      }

      &:hover {
        background: rgba(102, 126, 234, 0.08);
        transform: translateX(4px);

        .item-icon {
          background: rgba(102, 126, 234, 0.15);

          .el-icon {
            color: #667eea;
          }
        }

        .item-label {
          color: #667eea;
        }

        .item-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        .item-icon {
          background: rgba(255, 255, 255, 0.25);

          .el-icon {
            color: white;
          }
        }

        .item-label {
          color: white;
        }

        .item-arrow {
          opacity: 1;
          transform: translateX(0);

          .el-icon {
            color: white;
          }
        }

        &:hover {
          transform: translateX(0);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // 底部提示
  .sidebar-footer {
    margin-top: 16px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 2px solid rgba(102, 126, 234, 0.1);

    .el-icon {
      font-size: 18px;
      color: #667eea;
      flex-shrink: 0;
    }

    span {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .tourism-map-container {
    flex-direction: column;

    .map-area {
      flex: 0 0 60%;
      margin: 20px 20px 0 20px;
    }

    .province-sidebar {
      flex: 0 0 40%;
      padding: 0 20px 20px 20px;

      .sidebar-header {
        .header-icon {
          width: 48px;
          height: 48px;

          .el-icon {
            font-size: 26px;
          }
        }

        .header-content h3 {
          font-size: 18px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .tourism-map-container {
    .map-area {
      flex: 0 0 50%;
      margin: 15px;
      border-radius: 12px;
    }

    .province-sidebar {
      flex: 0 0 50%;
      padding: 0 15px 15px 15px;

      .sidebar-header {
        padding: 16px;

        .header-icon {
          width: 40px;
          height: 40px;

          .el-icon {
            font-size: 22px;
          }
        }

        .header-content {
          h3 {
            font-size: 16px;
          }

          .subtitle {
            font-size: 12px;
          }
        }
      }

      .province-list {
        .province-item {
          padding: 12px;

          .item-icon {
            width: 32px;
            height: 32px;

            .el-icon {
              font-size: 16px;
            }
          }

          .item-label {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>