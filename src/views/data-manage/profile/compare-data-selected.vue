<template>
  <el-dialog
    v-model="visible"
    title="选择对比数据"
    width="400px"
    align-center
    append-to-body
  >
    <div style="margin: -24px 0px">
      <p>坐标录入：手动录入坐标信息</p>
      <p>地图拾取：在地图中拾取坐标</p>
    </div>
    <template #footer>
      <el-button @click="onCancleRemark">取消</el-button>
      <el-button type="warning" @click="onInputMarkClick">坐标录入</el-button>
      <el-button type="primary" @click="onEarthMarkClick">地图拾取</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const visible = ref(false);
const show = () => {
  visible.value = true;
};

defineExpose({ show });
</script>

<style lang="scss" scoped></style>
