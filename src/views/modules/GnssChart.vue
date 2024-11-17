<template>
  <chart-card-layout class="chart" :title="`GNSS数据监测`">
    <template #extra>
      <div class="date-type">
        <div>
          <el-dropdown @command="onCommand" size="small">
            <el-link type="primary" :underline="false">
              {{ gnssName }} <el-icon> <ArrowDown /> </el-icon>
            </el-link>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="GNSS001">GNSS001</el-dropdown-item>
                <el-dropdown-item command="GNSS002">GNSS002</el-dropdown-item>
                <el-dropdown-item command="GNSS003">GNSS003</el-dropdown-item>
                <el-dropdown-item command="GNSS004">GNSS004</el-dropdown-item>
                <el-dropdown-item command="GNSS005">GNSS005</el-dropdown-item>
                <el-dropdown-item command="GNSS006">GNSS006</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
    <div class="chart-content" id="gnssLineChart"></div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, onMounted } from "vue";
import * as echarts from "echarts";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
import { getDisplaceinfo } from "@/api/slope";
import { getBeforeDateRange, randomNumByRange } from "@/utils";
import { ArrowDown } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";

let myChart;

const gnssName = ref("GNSS001");

const option = {
  tooltip: {
    trigger: "axis",
    show: true,
    // formatter:"{c} mm/小时"
  },
  legend: {
    show: true,
    textStyle: {
      color: "#BBCFFF",
      fontSize: "10px",
    },
  },
  grid: {
    show: false,
    top: 54,
    left: 20,
    right: 8,
    bottom: 0,
    containLabel: true,
    borderWidth: 1,
    borderColor: "#577BD4",
  },
  xAxis: {
    type: "time",
    axisLabel: {
      show: true,
      //   fontSize: "1.2rem",
      color: "#BBCFFF",
      // rotate: 15,
      margin: 12,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#595959",
        width: 1,
      },
    },
  },
  yAxis: {
    type: "value",
    name: "mm",
    nameGap: 12,
    nameTextStyle: {
      //   fontSize: "1.4rem",
      color: "#BBCFFF",
    },
    boundaryGap: ["10%", "10%"],
    axisLabel: {
      show: true,
      color: "#BBCFFF",
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: "#577BD4",
        width: 1,
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: "#577BD4",
        width: 1,
      },
    },
  },
  series: [
    {
      name: "X位移",
      type: "line",
      data: [],
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
      },
    },
    {
      name: "Y偏移",
      type: "line",
      data: [],
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
      },
    },
    {
      name: "H偏移",
      type: "line",
      data: [],
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
      },
    },
    {
      name: "XY偏移",
      type: "line",
      data: [],
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
      },
    },
    {
      name: "XYH偏移",
      type: "line",
      data: [],
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 1,
      },
    },
  ],
};
const data1 = [],
  data2 = [],
  data3 = [],
  data4 = [],
  data5 = [];
const onCommand = (command) => {
  gnssName.value = command;
};

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(document.getElementById("gnssLineChart"));
  myChart.setOption(option);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
  loadChartData();
});
let dataLength = 200,
  timer = null;
const loadChartData = () => {
  timer && clearInterval(timer);
  // 先模拟n条数据
  for (let i = dataLength; i >= 0; i--) {
    const time = dayjs()
      .subtract(5 * i, "s")
      .format("YYYY-MM-DD HH:mm:ss");
    data1.push([time, randomNumByRange(50, 150)]);
    data2.push([time, randomNumByRange(20, 50)]);
    data3.push([time, randomNumByRange(0, -150)]);
    data4.push([time, randomNumByRange(-30, 30)]);
    data5.push([time, randomNumByRange(-10, 10)]);
  }
  option.series[0].data = data1;
  option.series[1].data = data2;
  option.series[2].data = data3;
  option.series[3].data = data4;
  option.series[4].data = data5;
  myChart.setOption(option);

  // 5s定时器
  timer = setInterval(() => {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    data1.push([time, randomNumByRange(50, 150)]);
    data2.push([time, randomNumByRange(20, 50)]);
    data3.push([time, randomNumByRange(0, -150)]);
    data4.push([time, randomNumByRange(-30, 30)]);
    data5.push([time, randomNumByRange(-10, 10)]);
    data1.shift();
    data2.shift();
    data3.shift();
    data4.shift();
    data5.shift();
    option.series[0].data = data1;
    option.series[1].data = data2;
    option.series[2].data = data3;
    option.series[3].data = data4;
    option.series[4].data = data5;
    myChart.setOption(option);
  }, 5 * 1000);
};
</script>

<style lang="less" scoped>
.chart {
  height: 260px;
  margin-top: 12px;
  .date-type {
    display: flex;
    align-items: center;
    // gap: 12px;

    div {
      color: #b4c0cc;
      // width: 60px;
      box-sizing: border-box;
      height: 28px;
      line-height: 28px;
      // background: #0f2839;
      text-align: center;
      margin: 0px 4px;
      pointer-events: all;

      a {
        color: #1fc6ff;
        display: inline-flex;
        align-items: center;
        // text-decoration: underline;

        i {
          margin-left: 4px;
        }
      }

      &.selected {
        border-top: 1px solid #1fc6ff;
        background: linear-gradient(
          180deg,
          rgba(31, 198, 255, 0.32) 0%,
          rgba(31, 198, 255, 0) 100%
        );
      }
    }

    div:hover {
      cursor: pointer;
    }
  }
  .chart-content {
    box-sizing: border-box;
    // border: 1px solid red;
    height: 100%;
    padding: 8px;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }
}
</style>
