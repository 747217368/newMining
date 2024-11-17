<template>
  <el-dialog :title="null" v-model="visible" width="960" append-to-body>
    <div class="pdf-container">
      <div class="title">收方报告</div>
      <div class="info">
        <div class="code">编号：ER00001</div>
      </div>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="图片" span="3"> 

        </el-descriptions-item>
        <el-descriptions-item label="项目名称" span="2">
          准格尔旗大石圈煤矿
        </el-descriptions-item>
        <el-descriptions-item label="报告日期">
          2024-01-04 14:16:53
        </el-descriptions-item>
        <el-descriptions-item label="当期数据">
          2023年12月1期
        </el-descriptions-item>
        <el-descriptions-item label="对比数据">
          2023年11月2期
        </el-descriptions-item>
        <el-descriptions-item label="土方总差值">
          102 万方
        </el-descriptions-item>
        <el-descriptions-item label="最低平盘高度"> 16米 </el-descriptions-item>
        <el-descriptions-item label="最高平盘高度"> 27米 </el-descriptions-item>
        <el-descriptions-item label="平盘间隔"> 12米 </el-descriptions-item>
        <el-descriptions-item label="运距"> 1235米 </el-descriptions-item>
        <el-descriptions-item label="提升高度"> -27.8米 </el-descriptions-item>
        <el-descriptions-item label="报告人"> 管理员 </el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="downloadClick">下载</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["confirm"]);
const visible = ref(false);
const earthStore = useEarthMapStore();

const show = () => {
  visible.value = true;
};

const cancelClick = () => {
  visible.value = false;
};
const downloadClick = () => {};

defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
// :deep(.el-drawer__header) {
//   margin-bottom: 0px;
//   padding: 0px;
// }

// :deep(.el-dialog__body){

// }

.pdf-container {
  box-sizing: border-box;
  margin-top: -32px;
  .title {
    text-align: center;
    font-size: 24px;
  }

  .info {
    margin: 24px 0px 6px 0px;
  }

  .descriptions {
    margin-top: 24px;
  }
}
</style>
