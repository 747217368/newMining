<template>
  <div class="tips">
    您正在进行剖面测量操作，请绘制线进行剖面，当前剖面距离：<strong>{{
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
      重新绘制
    </el-button>
    <el-button
      size="small"
      type="success"
      link
      :disabled="!earthStore.measuredResult.distance"
      @click="onDrawComplete"
    >
      绘制完成
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

const onReDraw = () => {
  props.measure.clear();
  earthStore.setMeasuredResult({});
  props.measure.section({
    // maxPointNum:2,
    splitNum: 300, // 插值次数
    exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    allowDrillPick: false,
    has3dtiles: true,
  });
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
