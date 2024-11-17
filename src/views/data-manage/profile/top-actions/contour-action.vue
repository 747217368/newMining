<template>
  <div class="tips">
    您正在进行等高线提取操作，请先
    <el-link size="small" type="primary" @click="drawHandle"> 绘制 </el-link
    >提取范围，当前等高距为
    <el-popover trigger="click" placement="bottom" :width="300">
      <el-slider
        size="small"
        v-model="space"
        :min="5"
        :max="500"
        @change="onSliderChange"
      />
      <template #reference>
        <el-link size="small" type="primary"> {{ space }} </el-link>
      </template>
    </el-popover>
    米 &nbsp;
    <el-dropdown>
      <el-link size="small" type="primary" :disabled="exportDisabled">
        导出CAD<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-link>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>西安1980</el-dropdown-item>
          <el-dropdown-item>北京1954</el-dropdown-item>
          <el-dropdown-item>CGCS2000</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button size="small" link @click="onCancel"> 取消 </el-button>
  </div>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";
// import "shpjs";
import * as kgUtil from "kml-geojson";
// import { onUnmounted } from "vue";

const emit = defineEmits(["cancel"]);
const earthStore = useEarthMapStore();
const { proxy } = getCurrentInstance();

// console.log("treeRef", earthStore.$treeRef);
const props = defineProps({
  measure: {
    type: Object,
    required: true,
  },

  mapInstance: {
    type: Object,
    required: true,
  },
});

const state = reactive({});
const space = ref(20);
const exportDisabled = ref(true);

onUnmounted(() => {
  props.mapInstance.graphicLayer.clear();
});

let contourLine;
onMounted(() => {
  contourLine = new mars3d.thing.ContourLine({
    spacing: 20,
    width: 1.5,
    color: "rgba(255,0,0,0.85)",
    minHeight: -414.0,
    maxHeight: 8777.0,
    shadingAlpha: 0.35, /// 地表渲染的透明度
    shadingType: "aspect",
    colorScheme: {
      // 地表渲染的配色方案
      elevation: {
        step: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
        color: [
          "#000000",
          "#2747E0",
          "#D33B7D",
          "#D33038",
          "#FF9742",
          "#FF9742",
          "#ffd700",
        ],
      },
      slope: {
        step: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
        color: [
          "#000000",
          "#2747E0",
          "#D33B7D",
          "#D33038",
          "#FF9742",
          "#FF9742",
          "#ffd700",
        ],
      },
      aspect: {
        step: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
        color: [
          "#000000",
          "#2747E0",
          "#D33B7D",
          "#D33038",
          "#FF9742",
          "#FF9742",
          "#ffd700",
        ],
      },
    },
  });
  props.mapInstance.addThing(contourLine);
});

const drawHandle = () => {
  props.mapInstance.graphicLayer.clear();
  props.mapInstance.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false,
    },
    success: function (graphic) {
      // 绘制成功后回调
      let positions = graphic.positionsShow;
      props.mapInstance.graphicLayer.clear();
      contourLine.clear();
      console.log(
        "绘制坐标为",
        JSON.stringify(mars3d.LngLatArray.toArray(positions)),
      ); // 方便测试拷贝坐标
      console.log({ contourLine });
      positions = mars3d.PointUtil.setPositionsHeight(positions, 0);
      const result = contourLine.addArea(positions);
      exportDisabled.value = false;
      // setTimeout(() => {
      //   console.log("contourLine", contourLine);
      // }, 400);
    },
  });
};

const onCancel = () => {
  emit("cancel");
  contourLine.clear();
};

const onSliderChange = (value) => {
  if (value) {
    contourLine.spacing = value;
  }
};
</script>

<style lang="scss" scoped>
.tips {
  display: flex;
  align-items: center;
  font-size: 14px;
  .info {
    display: flex;
    align-items: center;

    .el-link {
      margin-left: 4px;
    }
  }

  .el-space {
    margin-left: 16px;
  }

  .el-link {
    margin: 0px 4px;
  }

  .el-button {
    margin: 0px 4px;
  }
}
</style>
