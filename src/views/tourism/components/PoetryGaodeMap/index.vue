<script setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue' // 新增 nextTick
import { ElMessage } from 'element-plus'
// 移除 useRouter 和 ROUTES 的导入，因为路由跳转将由父组件处理
// import { useRouter } from 'vue-router'
// import * as ROUTES from '@/constants/router.js'
import { Loading } from '@element-plus/icons-vue' // 确保导入 Loading 图标

// --- Props ---
const props = defineProps({
  markersData: {
    type: Array,
    default: () => [],
  },
  // 可以添加更多 props 来自定义地图行为，例如初始中心点、缩放级别、图标等
  // initialCenter: { type: Array, default: () => [108.9538, 34.2631] },
  // initialZoom: { type: Number, default: 5 },
})

// --- Emits ---
// {{ 新增：定义组件可以发出的事件 }}
const emit = defineEmits(['marker-detail-click'])

// --- Refs ---
const map = ref(null) // 高德地图实例
const mapContainer = ref(null) // 地图容器 DOM 引用
const isLoading = ref(true) // 地图加载状态
let currentMarkers = [] // 存储当前地图上的 AMap.Marker 实例
let currentInfoWindow = null // 存储当前打开的 InfoWindow 实例，方便管理

// --- 地图初始化 ---
const initMap = (AMap) => {
  if (!mapContainer.value) {
    console.error('地图容器尚未准备好')
    isLoading.value = false
    return
  }
  map.value = new AMap.Map(mapContainer.value, {
    viewMode: '3D',
    zoom: 5, // 初始缩放级别
    center: [108.9538, 34.2631], // 初始中心点
    mapStyle: 'amap://styles/whitesmoke', // 地图样式
  })

  // 添加地图控件
  map.value.addControl(new AMap.Scale())
  map.value.addControl(new AMap.ToolBar({ position: 'RB' })) // 将工具栏放在右下角
  map.value.addControl(new AMap.MapType())

  // 监听 props.markersData 的变化来更新标记点
  watch(
    () => props.markersData,
    (newData, oldData) => {
      // 简单的比较，避免不必要的重绘（可根据需要进行更深层次比较）
      if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
        addMarkers(AMap, newData)
      }
    },
    { immediate: true, deep: true }
  )

  isLoading.value = false
  console.log('高德地图初始化完成')
}

// --- 添加/更新地图标记点 ---
const addMarkers = (AMap, data) => {
  if (!map.value || !AMap) {
    console.warn('地图实例或 AMap 对象尚未准备好，无法添加标记点')
    return
  }

  // 清除旧的标记点和可能存在的信息窗体
  map.value.remove(currentMarkers)
  currentMarkers = []
  if (currentInfoWindow) {
    currentInfoWindow.close()
    currentInfoWindow = null
  }

  if (!data || data.length === 0) {
    // 如果没有数据，重置视野到默认状态
    map.value.setZoomAndCenter(5, [108.9538, 34.2631])
    console.log('无标记点数据，重置地图视野')
    return
  }

  data.forEach((item) => {
    // 基础数据校验
    if (!item || !item.location || !Array.isArray(item.location) || item.location.length !== 2 || isNaN(item.location[0]) || isNaN(item.location[1])) {
      console.warn(`地标 "${item?.name || '未知'}" 缺少有效坐标:`, item?.location)
      return
    }

    // 创建标记点实例
    const marker = new AMap.Marker({
      position: item.location,
      title: item.name || '无标题',
      icon: new AMap.Icon({
        size: new AMap.Size(32, 32),
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png', // 默认蓝色标记点
        imageSize: new AMap.Size(32, 32),
      }),
      animation: 'AMAP_ANIMATION_DROP', // 落下动画
      clickable: true,
      extData: { id: item.id, name: item.name, description: item.description }, // 存储更多信息
    })

    // 点击标记点事件
    marker.on('click', (e) => {
      const clickedMarker = e.target
      const markerData = clickedMarker.getExtData() // 获取存储的数据

      // 关闭上一个信息窗体（如果存在）
      if (currentInfoWindow) {
        currentInfoWindow.close()
      }

      // 创建新的信息窗体内容
      const infoContent = `
        <div class="info-window poetry-info-window">
          <h4>${markerData.name || '详情'}</h4>
          ${markerData.description ? `<p>${markerData.description.substring(0, 80)}${markerData.description.length > 80 ? '...' : ''}</p>` : ''}
          <button class="info-btn" data-id="${markerData.id}">查看详情</button>
        </div>
      `

      // 创建并打开新的信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: infoContent,
        offset: new AMap.Pixel(0, -30), // 偏移量
        isCustom: true, // 使用自定义内容
        autoMove: true, // 点击标记点后地图自动平移至标记点中心
        closeWhenClickMap: true, // 点击地图其他区域关闭信息窗体
      })
      infoWindow.open(map.value, clickedMarker.getPosition())
      currentInfoWindow = infoWindow // 保存当前打开的窗体实例

      // 动态绑定按钮点击事件 (使用 setTimeout 确保 DOM 渲染)
      nextTick(() => {
        // 使用更精确的选择器，基于 InfoWindow 实例查找按钮
        const infoWindowDom = infoWindow.getContentDom()
        if (infoWindowDom) {
            const btn = infoWindowDom.querySelector(`.poetry-info-window button[data-id="${markerData.id}"]`)
            if (btn) {
              // 移除旧监听器（以防万一）
              btn.onclick = null
              // 添加新监听器，触发 emit 事件
              btn.onclick = () => {
                console.log('地图组件：点击详情按钮，ID:', markerData.id)
                emit('marker-detail-click', markerData.id) // {{ 修改：发出事件 }}
                infoWindow.close() // 关闭信息窗体
                currentInfoWindow = null
              }
            } else {
              console.warn('未能在信息窗体中找到详情按钮，ID:', markerData.id)
            }
        } else {
             console.warn('无法获取信息窗体的 DOM 元素')
        }
      })
    })

    currentMarkers.push(marker) // 添加到当前标记点列表
  })

  // 将所有新标记添加到地图上
  map.value.add(currentMarkers)

  // 自动调整视野
  focusOnMarkers(currentMarkers) // 调用内部方法调整视野
}

// --- 地图视野控制 ---
// {{ 新增：用于调整地图视野以适应传入的标记点 }}
const focusOnMarkers = (markersToFocus = currentMarkers) => {
  if (!map.value || !markersToFocus || markersToFocus.length === 0) {
    // 如果没有标记点，可以重置到默认视野或保持当前视野
    // map.value?.setZoomAndCenter(5, [108.9538, 34.2631]);
    return
  }

  // 使用 setFitView 自动调整视野和缩放级别
  // 参数：覆盖物数组, 是否立即过渡动画, 四周内边距[上, 右, 下, 左], 最大缩放级别
  map.value.setFitView(
    markersToFocus, // AMap.Marker 实例数组
    false, // 禁用过渡动画，立即调整
    [150, 100, 100, 100], // 四周留白，单位像素
    16 // 限制最大缩放级别，防止过大
  )

  // 单独处理只有一个标记点的情况，确保缩放级别不会过小
  if (markersToFocus.length === 1) {
    // 获取当前缩放级别，如果小于某个阈值（例如 12），则设置为该阈值
    const currentZoom = map.value.getZoom()
    if (currentZoom < 12) {
      map.value.setZoom(14) // 设置一个合适的默认缩放级别
    }
  }
  console.log(`视野已调整以适应 ${markersToFocus.length} 个标记点`)
}

// --- 生命周期钩子 ---
onMounted(() => {
  // {{ 重要提示：不应在生产环境中硬编码 Key 和安全密钥 }}
  // {{ 建议使用环境变量或其他配置方式管理 }}
  window._AMapSecurityConfig = {
    // securityJsCode: 'YOUR_SECURITY_JS_CODE', // 替换为你自己的安全密钥
    securityJsCode: 'df035b8f6029bcf2a23d64e6af753e6e', // 示例密钥
  }

  AMapLoader.load({
    // key: 'YOUR_AMAP_KEY', // 替换为你自己的 Key
    key: 'c826e163b010f8a66fb54abb4954a198', // 示例 Key
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.InfoWindow'], // 确保加载所需插件
  })
    .then(initMap) // 传入 AMap 对象给 initMap
    .catch((e) => {
      console.error('高德地图加载失败:', e)
      isLoading.value = false
      ElMessage.error('地图加载失败，请刷新重试或检查网络连接')
    })
})

onUnmounted(() => {
  // 销毁地图实例，释放资源
  if (map.value) {
    map.value.destroy()
    map.value = null
    console.log('高德地图实例已销毁')
  }
  // 清理可能存在的 InfoWindow 引用
  if (currentInfoWindow) {
      currentInfoWindow = null;
  }
})

// --- 暴露给父组件的方法 ---
// {{ 新增：暴露 focusOnMarkers 方法 }}
defineExpose({
  focusOnMarkers,
  getMapInstance: () => map.value // 可以选择性暴露地图实例本身
})

</script>

<template>
  <div class="map-container poetry-map-theme">
    <!-- 移除地图顶部的 Header，让父组件控制整体布局 -->
    <!--
    <div class="map-header">
      <h2>诗途地图</h2>
    </div>
    -->

    <!-- 地图内容区域 -->
    <div class="map-content">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-overlay">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>地图加载中...</p>
      </div>

      <!-- 地图容器 -->
      <div ref="mapContainer" id="container"></div>
    </div>

    <!-- 移除地图底部的 Footer -->
    <!--
    <div class="map-footer">
      <p>本地图展示了与诗词相关的地点，点击标记点查看简要信息与详情</p>
    </div>
    -->
  </div>
</template>

<style lang="scss" scoped>
.map-container.poetry-map-theme {
  height: 100%; // 占满父容器高度
  width: 100%; // 占满父容器宽度
  position: relative; // 使得 loading-overlay 可以绝对定位
}

.map-content {
  height: 100%; // 确保内容区也占满
  width: 100%;
  position: relative; // 使得 loading-overlay 可以绝对定位

  #container {
    height: 100%;
    width: 100%;
    background-color: #f5f5f5; // 添加一个背景色，防止加载时白屏
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.85); // 半透明背景
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100; // 确保在最上层
    pointer-events: none; // 允许下层地图交互（如果需要的话，但加载时通常不需要）

    .el-icon {
      font-size: 40px;
      color: #409eff;
      margin-bottom: 15px;
    }

    p {
      font-size: 16px; // 调整字体大小
      color: #555; // 调整颜色
    }
  }
}

// --- 信息窗体样式 (使用 :deep 穿透 Scoped CSS) ---
:deep(.poetry-info-window) {
  padding: 12px 18px; // 调整内边距
  min-width: 200px; // 最小宽度
  max-width: 300px; // 最大宽度
  background-color: #fff;
  border-radius: 6px; // 圆角更大
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); // 阴影效果
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif; // 更通用的字体栈
  border: 1px solid #ebeef5; // 添加细边框

  h4 {
    margin: 0 0 10px 0; // 调整下边距
    color: #303133; // 更深的标题颜色
    font-size: 16px;
    font-weight: 600; // 加粗
    line-height: 1.4;
  }

  p {
    margin: 0 0 12px 0; // 调整下边距
    color: #606266; // 标准正文颜色
    font-size: 14px;
    line-height: 1.6; // 增加行高
  }

  .info-btn {
    display: inline-block; // 改为 inline-block
    background-color: #409eff;
    color: white;
    border: none;
    padding: 7px 15px; // 调整按钮大小
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px; // 调整按钮字体大小
    transition: background-color 0.2s ease, box-shadow 0.2s ease; // 添加阴影过渡
    text-align: center;
    white-space: nowrap; // 防止按钮文字换行

    &:hover {
      background-color: #66b1ff;
      box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3); // 添加悬停阴影
    }

    &:active {
      background-color: #3a8ee6; // 点击时颜色
    }
  }
}

// --- 高德地图默认样式覆盖 (可选) ---
:deep(.amap-logo) {
  display: none !important; // 隐藏高德 Logo
  opacity: 0 !important;
  visibility: hidden !important;
}

:deep(.amap-copyright) {
  display: none !important; // 隐藏高德版权信息
  opacity: 0 !important;
  visibility: hidden !important;
}

:deep(.amap-toolbar) {
  // 自定义工具栏样式
}

:deep(.amap-info-close) {
  // 自定义信息窗体关闭按钮样式
  top: 10px !important;
  right: 10px !important;
}
</style>