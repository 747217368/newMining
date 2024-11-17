<template>
  <div>
    <el-form
      :model="state.form"
      :rules="state.rules"
      ref="formRef"
      label-position="top"
    >
      <div class="line-chart" ref="lineChartRef"></div>

      <el-form-item label="测量名称" prop="name">
        <el-input
          v-model="state.form.name"
          placeholder="请输入测量名称"
          maxlength="50"
        />
      </el-form-item>

      <el-form-item label="台阶高度">
        <el-input :value="state.form.height">
          <template #suffix>m</template>
        </el-input>
      </el-form-item>

      <el-form-item label="台阶坡面角">
        <el-input :value="state.form.slope">
          <template #suffix>°</template>
        </el-input>
      </el-form-item>

      <el-form-item label="台阶宽度">
        <el-input :value="state.form.width">
          <template #suffix>m</template>
        </el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="state.form.remark"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
          placeholder="请输入备注"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 剖面测量表单
 */
import * as echarts from "echarts";
import useEarthMapStore from "@/store/modules/earthMap";
const earthStore = useEarthMapStore();

const lineChartRef = ref();
const { proxy } = getCurrentInstance();
const state = reactive({
  form: {
    unit: "m",
    slope: 0,
    height: 0,
    width: 0,
  },
  rules: {
    name: [
      { required: true, message: "测量名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 50,
        message: "测量名称长度必须介于 2 和 50 之间",
        trigger: "blur",
      },
    ],
  },
});

const validate = (callback) => {
  proxy.$refs["formRef"].validate((valid) => {
    callback(valid);
  });
};

onMounted(() => {
  console.log("测量结果", earthStore.measuredResult);
  const positions = earthStore.measuredResult.coordinates;
  // 台阶高度
  state.form.height = (positions[1][2] - positions[0][2]).toFixed(1);
  // 台阶宽度
  state.form.width = (
    earthStore.measuredResult.distance -
    earthStore.measuredResult.distanceLastFd
  ).toFixed(1);
  // 边坡角度
  const c = earthStore.measuredResult.distanceLastFd;
  const a_angle = (Math.asin(Number(state.form.height) / c) * 180) / Math.PI;
  state.form.slope = a_angle.toFixed(1);
  const lineData = positions.map((item) => item[2]);
  // return;
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const { dataIndex, value, axisValue } = params[0];
        return `海拔：${value}米`;
      },
    },

    toolbox: {
      feature: {
        saveAsImage: {
          name:'工作面参数测量结果',
          pixelRatio: 5,
          backgroundColor: "rgba(0,0,0,0)",
        },
      },
    },
    grid: {
      top: "14%",
      left: "0%",
      right: "2%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["坡底线", "坡顶线", "上级台阶坡底线"],
      axisLabel: {
        align: "right",
      },
    },
    yAxis: {
      name: "高程(米)",
      type: "value",
      min: function (value) {
        return value.min - 2;
      },
      // max: "dataMax",
      axisLabel: {
        formatter: "{value}",
      },
    },

    series: [
      {
        data: lineData,
        type: "line",
        showSymbol: false,
        smooth: false,
        itemStyle: {
          color: "rgb(255, 70, 131)",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 158, 68)",
            },
            {
              offset: 1,
              color: "rgb(255, 70, 131)",
            },
          ]),
        },
      },
    ],
  };

  setTimeout(() => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(lineChartRef.value);
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  }, 800);
});

defineExpose({ validate, form: state.form });
</script>

<style lang="scss" scoped>
.line-chart {
  margin: 0px -12px;
  height: 235px;
  //   background-color: rgba($color: #000000, $alpha: 0.05);
  margin-bottom: 12px;
}
</style>
