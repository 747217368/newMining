<template>
  <div class="tips">
    您正在进行
    <el-tooltip effect="dark" content="点击切换" placement="bottom">
      <el-link type="primary" link @click="toggleDistanceType">
        {{
          earthStore.measureType !== "distanceMeasure" ? "贴地距离" : "空间距离"
        }}
      </el-link>
    </el-tooltip>
    测量操作，当前测量结果：<strong>{{
      earthStore.measuredResult?.distanceStr || "0米"
    }}</strong>
    <!-- <el-button size="small" link> 清空结果 </el-button> -->
    &nbsp; &nbsp;
    <el-button
      size="small"
      type="primary"
      link
      :disabled="!earthStore.measuredResult.distance"
      @click="onReDraw"
    >
      重新测量
    </el-button>
    <el-button
      size="small"
      type="success"
      link
      :disabled="!earthStore.measuredResult.distance"
      @click="onDrawComplete"
    >
      测量完成
    </el-button>
    <el-button size="small" link @click="onCancel"> 取消 </el-button>
  </div>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";

const props = defineProps({
  measure: {
    type: Object,
    required: true,
  },
});

const { proxy } = getCurrentInstance();

const emit = defineEmits(["cancel"]);
const earthStore = useEarthMapStore();

const onDrawComplete = () => {
  if (!earthStore.measuredResult.distance) {
    proxy.$modal.msgError("请先进行测量操作！");
    return;
  }

  earthStore.setDrawerVisible(true);
};

// 切换距离测量类型
const toggleDistanceType = () => {
  props.measure.clear();
  earthStore.setMeasuredResult({});
  if (earthStore.measureType === "distanceMeasure") {
    proxy.$modal.msg("已切换为贴地距离");
    earthStore.setMeasuredType("distanceSurfaceMeasure");
    props.measure.distanceSurface({
      showAddText: true,
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
      allowDrillPick: false,
      // unit: 'm', //支持传入指定计量单位
      // style: {
      //   color: '#ffff00',
      //   width: 3,
      //   clampToGround: true //是否贴地
      // }
    });
  } else {
    proxy.$modal.msg("已切换为空间距离");
    earthStore.setMeasuredType("distanceMeasure");
    props.measure.distance({
      showAddText: true,
    });
  }
};

const onReDraw = () => {
  props.measure.clear();
  earthStore.setMeasuredResult({});
  if (earthStore.measureType === "distanceMeasure") {
    props.measure.distanceSurface({
      showAddText: true,
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
      // unit: 'm', //支持传入指定计量单位
      // style: {
      //   color: '#ffff00',
      //   width: 3,
      //   clampToGround: true //是否贴地
      // }
    });
  } else {
    props.measure.distanceSurface({
      showAddText: true,
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
      // unit: 'm', //支持传入指定计量单位
      // style: {
      //   color: '#ffff00',
      //   width: 3,
      //   clampToGround: true //是否贴地
      // }
    });
  }
};

const onCancel = () => {
  emit("cancel");
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

  .el-icon {
    margin: 0px 16px;
  }

  .el-button {
    margin: 0px 4px;
  }

  .step {
    display: flex;
    align-items: center;
    .el-select {
      margin: 0px 4px;
    }

    .el-icon {
      margin: 0px;
    }
  }
}
</style>
