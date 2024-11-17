<template>
  <div class="tips">
    您正在进行 平面面积 测量操作，当前测量结果：<strong>{{
      earthStore.measuredResult?.areaStr || "0平方米"
    }}</strong>
    <!-- <el-button size="small" link> 清空结果 </el-button> -->
    &nbsp; &nbsp;
    <el-button
      size="small"
      type="primary"
      link
      :disabled="!earthStore.measuredResult.area"
      @click="onReDraw"
    >
      重新测量
    </el-button>
    <el-button
      size="small"
      type="success"
      link
      :disabled="!earthStore.measuredResult.area"
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
  if (earthStore.analysisType === "area" && !earthStore.measuredResult.area) {
    proxy.$modal.msgError("请先进行测量操作！");
    return;
  }

  earthStore.setDrawerVisible(true);
};

const onReDraw = () => {
  props.measure.clear();
  earthStore.setMeasuredResult({});
  props.measure.area({
    // style: {
    //   color: '#00fff2',
    //   opacity: 0.4,
    //   outline: true,
    //   outlineColor: '#fafa5a',
    //   outlineWidth: 1,
    //   clampToGround: false //贴地
    // }
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
