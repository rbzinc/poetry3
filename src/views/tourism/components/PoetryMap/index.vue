<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts/extension/bmap/bmap'

const mapContainer = ref(null)
const poetryLocations = ref([
  {
    name: '黄鹤楼',
    location: [114.3, 30.5],
    poems: [
      { title: '黄鹤楼送孟浩然之广陵', poet: '李白' },
      { title: '登黄鹤楼', poet: '崔颢' }
    ]
  },
  {
    name: '庐山',
    location: [115.98, 29.57],
    poems: [
      { title: '望庐山瀑布', poet: '李白' },
      { title: '庐山谣', poet: '白居易' }
    ]
  },
  {
    name: '西湖',
    location: [120.14, 30.25],
    poems: [
      { title: '饮湖上初晴后雨', poet: '苏轼' },
      { title: '平湖秋月', poet: '白居易' }
    ]
  }
])

onMounted(() => {
  const chart = echarts.init(mapContainer.value)
  const option = {
    bmap: {
      center: [114.3, 30.5],
      zoom: 5,
      roam: true
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'scatter',
      coordinateSystem: 'bmap',
      data: poetryLocations.value.map(loc => ({
        name: loc.name,
        value: [...loc.location, loc.poems.length]
      })),
      symbolSize: function (val) {
        return val[2] * 10
      },
      label: {
        show: true,
        formatter: '{b}'
      }
    }]
  }
  chart.setOption(option)
})
</script>