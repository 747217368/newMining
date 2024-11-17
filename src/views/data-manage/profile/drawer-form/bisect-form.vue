<template>
  <div>
    <el-form
      :model="state.form"
      :rules="state.rules"
      ref="formRef"
      label-position="top"
    >
      <div class="line-chart" ref="lineChartRef"></div>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="测量名称" prop="name">
            <el-input
              v-model="state.form.name"
              placeholder="请输入测量名称"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="长度单位" prop="unit">
            <el-select
              style="width: 100%"
              placeholder="请长度单位"
              v-model="state.form.unit"
              @change="onUnitChange"
            >
              <el-option label="米" value="m" />
              <el-option label="千米" value="km" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="道路长度">
            <el-input :value="state.form.distance">
              <template #suffix>{{ state.form.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平均坡度">
            <el-input :value="state.form.averageSlope">
              <template #suffix>°</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大坡度">
            <el-input :value="state.form.maxSlope">
              <template #suffix>°</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小坡度">
            <el-input :value="state.form.minSlope">
              <template #suffix>°</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="斜坡累计长度(大于0度)">
            <el-input :value="state.form.inclineSlopeLength">
              <template #suffix>{{ state.form.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="缓坡累计长度(坡度介于0~15度)">
            <el-input :value="state.form.gentleSlopeLength">
              <template #suffix>{{ state.form.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="陡坡累计长度(坡度介于30~60度)">
            <el-input :value="state.form.steepSlopeLength">
              <template #suffix>{{ state.form.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大海拔落差">
            <el-input :value="state.form.drop">
              <template #suffix>m</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="state.form.remark"
              type="textarea"
              :rows="2"
              maxlength="200"
              show-word-limit
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
    distance: earthStore.measuredResult.distance.toFixed(1),
    unit: "m",
    averageSlope: 0,
    maxSlope: 0,
    minSlope: 0,
    gentleSlopeLength: 0,
    inclineSlopeLength: 0,
    steepSlopeLength: 0,
    drop: 0,
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

const onUnitChange = (value) => {
  if (value == "m") {
    state.form.distance = state.form.distance * 1000;
    state.form.inclineSlopeLength = (
      state.form.inclineSlopeLength * 1000
    ).toFixed(1);
    state.form.gentleSlopeLength = (
      state.form.gentleSlopeLength * 1000
    ).toFixed(1);
    state.form.steepSlopeLength = (state.form.steepSlopeLength * 1000).toFixed(
      1,
    );
  } else {
    state.form.distance = (state.form.distance / 1000).toFixed(4);
    state.form.inclineSlopeLength = (
      state.form.inclineSlopeLength / 1000
    ).toFixed(4);
    state.form.gentleSlopeLength = (
      state.form.gentleSlopeLength / 1000
    ).toFixed(4);
    state.form.steepSlopeLength = (state.form.steepSlopeLength / 1000).toFixed(
      4,
    );
  }
};

onMounted(() => {
  const option = {
    tooltip: {
      trigger: "axis",
      // formatter: "距起点：{b}米<br />海拔：{c}米",
      formatter: (params) => {
        // console.log("数据集", params);
        const { dataIndex, value, axisValue } = params[0];
        // console.log("dataIndex", dataIndex);
        const point = earthStore.measuredResult.arrPoint[dataIndex];

        return `距起点：${axisValue}米<br />海拔：${value}米<br />经度：${point.lng}<br />纬度：${point.lat}`;
      },
    },

    toolbox: {
      feature: {
        saveAsImage: {
          name:'剖面分析结果',
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
      data: earthStore.measuredResult.arrLen,
      axisLabel: {
        formatter: "{value} 米",
      },
    },
    yAxis: {
      name: "高程(米)",
      type: "value",
      min: function (value) {
        return value.min - 10;
      },
      max: "dataMax",
      axisLabel: {
        formatter: "{value}",
      },
    },
    // dataZoom: [
    //   {
    //     type: "inside",
    //     start: 0,
    //     end: 50,
    //   },
    //   {
    //     start: 0,
    //     end: 50,
    //   },
    // ],
    series: [
      {
        data: earthStore.measuredResult.arrHB,
        type: "line",
        showSymbol: false,
        smooth: true,
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
  const max = Math.max(...earthStore.measuredResult.arrHB);
  const min = Math.min(...earthStore.measuredResult.arrHB);
  // 最大高度差
  state.form.drop = (max - min).toFixed(1);
  // 坡度参数计算
  computeSlopeOption(earthStore.measuredResult.arrPoint);
  setTimeout(() => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(lineChartRef.value);
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  }, 800);
});
/**
 * 根据路径，计算坡度相关信息，最大坡度，最小坡度，平均坡度，斜坡长度，缓坡长度，陡坡长度
 * @param {*} positions
 */
const computeSlopeOption = (positions) => {
  const slopes = [],
    distances = [];
  positions.forEach((element, index) => {
    if (index > 0) {
      const start = positions[index - 1];
      const end = element;
      const c = mars3d.MeasureUtil.getDistance([start, end]);
      const a = Math.abs(start.alt - end.alt);
      const a_angle = (Math.asin(a / c) * 180) / Math.PI;

      slopes.push(a_angle || 0);
      distances.push(c || 0);
    }
  });
  // 缓坡： ≤15°，中等坡：坡度介于15~30度，陡坡：坡度介于30~60度，急坡：坡度介于60~90度；
  // 平均坡度
  state.form.averageSlope = (
    slopes.reduce((total, num) => total + num) / slopes.length
  ).toFixed(1);
  // 最大坡度
  state.form.maxSlope = Math.max(...slopes).toFixed(1);
  // 最小坡度
  state.form.minSlope = Math.min(...slopes).toFixed(1);
  // 坡度长度统计
  let slopeLength = 0,
    sSlopeLength = 0,
    lSlopeLength = 0;
  slopes.forEach((element, index) => {
    if (element > 0) {
      // 斜坡长度
      slopeLength += distances[index];
    }
    if (element > 0 && element <= 15) {
      // 缓坡长度
      sSlopeLength += distances[index];
    }
    if (element > 30 && element <= 60) {
      // 陡坡长度
      lSlopeLength += distances[index];
    }
  });
  // 斜坡长度
  state.form.inclineSlopeLength = slopeLength.toFixed(1);
  // 缓坡长度
  state.form.gentleSlopeLength = sSlopeLength.toFixed(1);
  // 陡坡长度
  state.form.steepSlopeLength = lSlopeLength.toFixed(1);
};

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
