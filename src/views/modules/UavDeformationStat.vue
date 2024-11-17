<template>
  <chart-card-layout class="chart" title="采矿动态监测">
    <div class="chart-content" id="miningChart"></div>
  </chart-card-layout>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import ChartCardLayout from "@/components/ChartCardLayout.vue";

const props = defineProps({
  mineId: {
    type: Number,
    default: null,
  },
});

let miningChart = null;
const miningOption = ref({
  tooltip: {
    trigger: "axis",
    formatter(params) {
      let result = "";
      params.forEach(item => {
        result += `${item.seriesName}：${item.value} 平方公里<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: ["剥离区", "采坑", "排土区", "复垦区"],
    textStyle: {
      color: "#0efcff",
    },
  },
  grid: {
    height: "60%",
    left: "10%",
    right: "4%",
    bottom: "10%",
    containLabel: true,
  },
  toolbox: {
    top: "12%",
    iconStyle: {
      borderColor: "#0efcff",
    },
    feature: {
      dataZoom: { yAxisIndex: "none" },
      restore: {},
      dataView: {},
      magicType: { type: ["line", "bar"] },
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    nameGap: 22,
    data: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"],
    axisLine: {
      lineStyle: { color: "#0efcff" },
    },
    axisLabel: { color: "#0efcff" },
    name: "年份",
    nameLocation: "middle",
    nameTextStyle: { color: "#0efcff", fontSize: 12 },
  },
  yAxis: {
    type: "value",
    name: "面积（平方公里）",
    nameLocation: "middle",
    nameGap: 30,
    nameTextStyle: { color: "#0efcff", fontSize: 14 },
    axisLine: { lineStyle: { color: "#0efcff" } },
    axisLabel: { color: "#0efcff" },
    splitLine: {
      lineStyle: { color: "#0efcff", type: "dashed" },
    },
  },
  series: [
    {
      name: "剥离区",
      type: "line",
      data: [12, 14, 11, 16, 13, 15, 18],
      lineStyle: { color: "#ff6347" },
      itemStyle: { color: "#ff6347" },
    },
    {
      name: "采坑",
      type: "line",
      data: [8, 10, 9, 12, 11, 13, 14],
      lineStyle: { color: "#32cd32" },
      itemStyle: { color: "#32cd32" },
    },
    {
      name: "排土区",
      type: "line",
      data: [5, 6, 7, 6, 7, 8, 9],
      lineStyle: { color: "#1e90ff" },
      itemStyle: { color: "#1e90ff" },
    },
    {
      name: "复垦区",
      type: "line",
      data: [2, 3, 4, 4, 5, 6, 7],
      lineStyle: { color: "#ffeb3b" },
      itemStyle: { color: "#ffeb3b" },
    },
  ],
});

onMounted(() => {
  miningChart = echarts.init(document.getElementById("miningChart"));
  miningChart.setOption(miningOption.value);

  // 监听窗口大小调整
  window.addEventListener("resize", () => {
    miningChart.resize();
  });
});

watch(
  () => props.mineId,
  (newVal) => {
    if (newVal) {
      miningOption.value.series[0].data = [3, 2, 5, 3, 1, 2, 4];
      miningOption.value.series[1].data = [6, 3, 2, 6, 3, 4, 5];
      miningOption.value.series[2].data = [2, 1, 3, 5, 2, 4, 3];
      miningOption.value.series[3].data = [1, 4, 6, 7, 5, 6, 8];
    } else {
      miningOption.value.series[0].data = [12, 14, 11, 16, 13, 15, 18];
      miningOption.value.series[1].data = [8, 10, 9, 12, 11, 13, 14];
      miningOption.value.series[2].data = [5, 6, 7, 6, 7, 8, 9];
      miningOption.value.series[3].data = [2, 3, 4, 4, 5, 6, 7];
    }
    miningChart.setOption(miningOption.value);
  }
);
</script>

<style lang="less" scoped>
.chart {
  margin-top: 12px;
  height: 260px;

  .chart-content {
    box-sizing: border-box;
    height: 100%;
    padding: 12px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
