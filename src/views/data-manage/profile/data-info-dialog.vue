<template>
  <el-dialog title="数据详情" v-model="visible" width="750" append-to-body>
    <el-descriptions :column="2">
      <el-descriptions-item label="数据名称">
        {{ info.dataName }}</el-descriptions-item
      >
      <el-descriptions-item label="所属项目"
        >{{ info.projectName }}
      </el-descriptions-item>
      <el-descriptions-item label="数据类型">
        {{ typeDict[info.dataType] }}
      </el-descriptions-item>
      <el-descriptions-item label="上传日期">
        {{ info.createTime }}
      </el-descriptions-item>
      <el-descriptions-item label="数据大小">
        {{ parseFileSize(info.size) }}
      </el-descriptions-item>
      <el-descriptions-item label="发布状态">
        <el-tag
          :type="['primary', 'danger', 'success', 'danger'][info.state]"
          >{{
            ["发布中", "发布失败", "发布成功", "发布失败"][info.state]
          }}</el-tag
        >
        <span
          style="font-size: 12px; margin-left: 8px; color: #f56c6c"
          v-if="info.state == 3"
          >文件目录结构错误！</span
        >
      </el-descriptions-item>
      <el-descriptions-item label="服务地址" :span="2">
        {{ info.link }}
      </el-descriptions-item>
      <el-descriptions-item label="投影信息"> </el-descriptions-item>
      <el-descriptions-item label="上传人员">
        {{ info.createName }}
      </el-descriptions-item>
      <el-descriptions-item label="数据备注" :span="2">
        {{ info.remark || "暂无备注" }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";

import { parseFileSize } from "@/utils";
const typeDict = {
  dom: "正射影像",
  dem: "高程模型",
  osgb: "倾斜模型",
  tiles3d: "三维切片",
  las: "激光点云",
  cad: "CAD文件",
  vector: "矢量数据",
};
const { proxy } = getCurrentInstance();
const emit = defineEmits(["confirm"]);
const visible = ref(false);
const earthStore = useEarthMapStore();
const info = ref({});

const show = (record) => {
  info.value = record;
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
