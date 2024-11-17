<template>
  <div class="tips">
    您正在进行工作面参数测量操作，请依次绘制<strong>台阶坡底线点位</strong>，
    <strong>坡顶线点位</strong>及上一台阶<strong>坡低线点位</strong>
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
  //
  if (!earthStore.measuredResult.coordinates) {
    proxy.$modal.msgError("请先进行绘制操作！");
    return;
  }

  if (earthStore.measuredResult.coordinates.length !== 3) {
    proxy.$modal.msgError("请绘制3个点位！");
    return;
  }

  earthStore.setDrawerVisible(true);
};

const onReDraw = () => {
  props.measure.clear();
  earthStore.setMeasuredResult({});
  props.measure.distance({
    showAddText: false,
    maxPointNum: 3,
    label: {
      opacity: 0,
      backgroundOpacity: 0,
    },
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
