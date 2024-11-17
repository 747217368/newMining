<template>
  <chart-card-layout class="chart" title="预警统计">
    <div class="chart-content">
      <div class="pie-chart" id="volumePiechart"></div>
      <div class="legend">
        <div class="item blue">蓝色预警<span>8 条</span></div>
        <div class="item yellow">黄色预警<span>4 条</span></div>
        <div class="item orange">橙色预警<span>2 条</span></div>
        <div class="item red">红色预警<span>1 条</span></div>
      </div>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, onMounted } from "vue";
import * as echarts from "echarts";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
const option = {
  tooltip: {
    trigger: "item",
    show: true,
  },
  legend: {
    show: false,
  },
  series: [
    {
      name: "预警统计",
      type: "pie",
      radius: ["55%", "90%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 8,
          name: "蓝色",
          itemStyle: {
            color: "#59ffff",
            shadowColor: "#59ffff",
            shadowBlur: 2,
          },
        },
        {
          value: 4,
          name: "黄色",
          itemStyle: {
            color: "#f5e74f",
            shadowColor: "#f5e74f",
            shadowBlur: 2,
          },
        },
        {
          value: 2,
          name: "橙色",
          itemStyle: {
            color: "#ffa940",
            shadowColor: "#ffa940",
            shadowBlur: 2,
          },
        },
        {
          value: 1,
          name: "红色",
          itemStyle: {
            color: "#ff4d4f",
            shadowColor: "#ff4d4f",
            shadowBlur: 2,
          },
        },
      ],
    },
  ],
};

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById("volumePiechart"));
  myChart.setOption(option);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
});
</script>

<style lang="less" scoped>
.chart {
  height: 240px;

  .chart-content {
    box-sizing: border-box;
    // border: 1px solid red;
    height: 100%;
    padding: 24px;
    display: flex;
    align-items: stretch;
    justify-content: center;

    .pie-chart {
      width: 140px;
    }

    .legend {
      // border: 1px solid #f5e74f;
      margin-left: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .item {
        color: #b4c0cc;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        margin-top: 8px;

        &:nth-child(1) {
          margin-top: 0px;
        }

        &.blue {
          span {
            color: #59ffff;
            margin-left: 8px;
          }
          &::before {
            content: "";
            display: inline-block;
            height: 4px;
            width: 4px;
            background-color: #59ffff;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 8px;
          }
        }

        &.yellow {
          span {
            color: #f5e74f;
            margin-left: 8px;
          }
          &::before {
            content: "";
            display: inline-block;
            height: 4px;
            width: 4px;
            background-color: #f5e74f;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 8px;
          }
        }

        &.orange {
          span {
            color: #ffa940;
            margin-left: 8px;
          }
          &::before {
            content: "";
            display: inline-block;
            height: 4px;
            width: 4px;
            background-color: #ffa940;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 8px;
          }
        }

        &.red {
          span {
            color: #ff4d4f;
            margin-left: 8px;
          }
          &::before {
            content: "";
            display: inline-block;
            height: 4px;
            width: 4px;
            background-color: #ff4d4f;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
