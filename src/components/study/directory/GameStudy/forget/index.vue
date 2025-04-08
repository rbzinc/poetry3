<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted } from 'vue'

const target = ref(null)
let mChart = null

// 获取今天日期和未来6天的日期
const getDates = () => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    dates.push(`${date.getMonth() + 1}.${date.getDate()}`)
  }
  return dates
}

const information = ref({
  area: getDates(),
  legend: ['已背诵',  '计划背诵'],
  data: [
    [3, 4, 4, 5, 5, 6, 6],
    [1, 1, 2, 2, 2, 2, 2],
  ],
  colors: ['#67C23A', '#F56C6C'],
})

const renderChart = () => {
  const option = {
    backgroundColor: '#FFFFFF',
    title: {
      text: '诗词学习计划',
      left: 'center',
    },
    color: information.value.colors,
    legend: {
      top: '10%',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#333',
        fontSize: 14,
      },
      data: information.value.legend,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 14,
      },
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((item) => {
          result += `${item.marker}${item.seriesName}：${item.value}首<br/>`
        })
        return result
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '25%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: information.value.area,
      axisLabel: {
        color: '#333',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
    yAxis: {
      name: '数量（首）',
      type: 'value',
      axisLabel: {
        color: '#333',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#eee',
        },
      },
    },
    series: information.value.legend.map((name, index) => ({
      name,
      type: 'bar',
      stack: '总量',
      barWidth: '50%',
      data: information.value.data[index],
      emphasis: {
        focus: 'series',
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{c}首',
      },
    })),
  }

  mChart?.setOption(option)
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  mChart?.resize()
}

onMounted(() => {
  try {
    mChart = echarts.init(target.value)
    renderChart()
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  mChart?.dispose()
})
</script>

<template>
  <el-card class="forget-chart">
    <template #header>
      <div class="chart-header">学习计划</div>
    </template>
    <div ref="target" class="chart-container"></div>
  </el-card>
</template>

<style lang="scss" scoped>
.forget-chart {
  height: 100%; // 使用全部可用高度
  display: flex;
  flex-direction: column;
  
  .chart-header {
    font-size: 16px;
    font-weight: bold;
    padding: 8px 0;
  }
  
  .chart-container {
    flex: 1; // 占用剩余空间
    min-height: 280px;
    width: 100%;
    transition: all 0.3s ease;
  }
}
</style>
