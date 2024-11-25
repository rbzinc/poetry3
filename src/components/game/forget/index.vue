<script setup>
import * as echarts from 'echarts'
import {onMounted, ref} from "vue";
// 1.初始Echarts实例对象
let mChart = null;
const target = ref(null);

onMounted(() => {
  try {
    mChart = echarts.init(target.value);
    renderChart();
  } catch (error) {
    console.error("Echarts 初始化失败:", error);
  }
});


let information = {
  area: [
    '11.5',
    '11.6',
    '11.7',
    '11.8',
    '11.9',
    '11.10',
    '11.11',

  ],
  legend: [
    "昨日已背诵",
    "今日需背诵",
    "明日目标",
  ],
  data: [
    [2, 4, 5, 1, 3, 5, 6],
    [2, 6, 3, 7, 3, 7, 1],
    [4, 5, 3, 2, 3, 5, 2],
  ],
  colors: ["#1165b2", "#b17706", "#af3b14"],
};


const renderChart = () => {
  const option = {
    backgroundColor: "#8297ae",
    color: information.colors,
    legend: {
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        //图例文字的样式
        color: "#b4e4ff",
        fontSize: 18,

      },
      data: information.legend,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(9,40,84,0.8)",
      borderColor: "rgba(9,40,84,0.8)",
      textStyle: {
        fontSize: 18,
        color: "#fff",
      },
    },
    grid: {
      left: "3%",
      right: "6%",
      bottom: "8%",
      top: "34%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: "#b4e4ff",
        fontSize: 20,
        margin: 20,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(180, 228, 255, 0.3)",
          width: 1,
        },
      },
      splitLine: {
        show: true,
        interval: information.area.length,
        lineStyle: {
          color: "rgba(180, 228, 255, 0.1)",

        },
      },
      data: information.area,
    },
    yAxis: {
      name: "单位：首",
      nameLocation: "end",
      nameTextStyle: {
        color: "#b4e4ff",
        fontSize: 20,
        padding: [0, 0, 0, 110],
      },
      type: "value",
      axisLabel: {
        color: "#b4e4ff",
        fontSize: 20,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(180, 228, 255, 0.3)",
          width: 2,
        },
      },
      axisTick: {
        show: false,
      },

      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(180, 228, 255, 0.1)",
        },
      },
    },
    series: [],
  };
  for (let i = 0; i < information.legend.length; i++) {
    option.series.push({
      name: information.legend[i],
      type: "bar",
      stack: "古诗背诵",
      barWidth: "25%",
      data: information.data[i],
    });
  }

  mChart.setOption(option);
};
</script>

<template>
    <div ref="target" style="width: 100%; height: 280px"></div>
</template>

<style lang="scss" scoped>

</style>
