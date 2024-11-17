<template>
  <chart-card-layout
    class="chart"
    :title="`测点位移（${props.monitoringName}）`"
  >
    <template #extra>
      <div class="date-type">
        <div>
          <el-dropdown @command="onDateChange" size="small">
            <el-link type="primary" :underline="false">
              {{ dictDate[dateType] }} <el-icon> <ArrowDown /> </el-icon>
            </el-link>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1">近24小时</el-dropdown-item>
                <el-dropdown-item command="3">近3天</el-dropdown-item>
                <el-dropdown-item command="7">近7天</el-dropdown-item>
                <el-dropdown-item command="30">近30天</el-dropdown-item>
                <el-dropdown-item command="90">近90天</el-dropdown-item>
                <el-dropdown-item command="180">近180天</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
       
      </div>
    </template>
    <div
      class="chart-content"
      id="displacementLineChart"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.35)"
    ></div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, onMounted } from "vue";
import * as echarts from "echarts";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
import { getDisplaceinfo } from "@/api/slope";
import { getBeforeDateRange } from "@/utils";
import { ArrowDown } from "@element-plus/icons-vue";

const props = defineProps({
  monitoringid: {
    type: String,
    required: true,
  },
  monitoringName: {
    type: String,
    required: true,
    default: "测点",
  },
});

const dictUnit = {
  "03": "mm/1小时",
  "04": "mm/1天",
  "05": "mm/1周",
  "07": "mm/1月",
};

const dictDate = {
  1: "近24小时",
  3: "近3天",
  7: "近7天",
  30: "近30天",
  90: "近90天",
  180: "近180天",
};

let myChart;
const dateType = ref(1);
const unitType = ref("03");
const loading = ref(false);

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
    },
  },
  grid: {
    show: false,
    top: 28,
    left: 20,
    right: 8,
    bottom: 0,
    containLabel: true,
    borderWidth: 1,
    borderColor: "#577BD4",
  },
  xAxis: {
    type: "time",
    boundaryGap: false,
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
    boundaryGap: ["50%", "50%"],
    axisLabel: {
      show: true,
      //   fontSize: "1.2rem",
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
      name: "位移",
      type: "line",
      data: [],
      showSymbol: false,
      smooth: true,
      lineStyle: {
        color: "#4092FF",
        width: 1,
      },
    },
  ],
};

watch(
  () => props.monitoringid,
  (newVal, oldVal) => {
    loadChartData();
  },
);

const onDateChange = (command) => {
  dateType.value = command;
  loadChartData();
};

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(document.getElementById("displacementLineChart"));
  myChart.setOption(option);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
  loadChartData();
});

const loadChartData = () => {
  const dateRange = getBeforeDateRange(dateType.value);

  const params = {
    monitoringid: props.monitoringid,
    starttime: dateRange[0],
    endtime: dateRange[1],
  };
  loading.value = true;
  getDisplaceinfo(params)
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        const values = data.map((item) => [item.time, item.value]);
        option.series[0].data = values;
        myChart.setOption(option);
      }
    })
    .finally(() => {
      loading.value = false;
    });
  //
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
