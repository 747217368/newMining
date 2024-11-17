<template>
  <el-dialog
    v-model="dialogVisible"
    :title="fileTitle"
    :fullscreen="fullscreen"
    @close="onCose"
    width="80%"
    class="dark-dialog"
    :show-close="false"
    align-center
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="costom-header">
        <div :id="titleId" :class="titleClass">{{ fileTitle }}</div>
        <div class="actions">
          <el-tooltip effect="dark" content="下载" placement="bottom">
            <el-button
              size="large"
              link
              :icon="Download"
              @click="onDownload"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="fullscreen ? '窗口化' : '全屏'"
            placement="bottom"
          >
            <el-button
              size="large"
              link
              :icon="fullscreen ? CopyDocument : FullScreen"
              @click="onFull"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="bottom">
            <el-button
              size="large"
              link
              @click="close"
              :icon="Close"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
    </template>
    <iframe
      v-if="filePath"
      id="previewPdf"
      :src="'./pdf-viewer/web/viewer.html?file=' + filePath"
      width="100%"
      :class="{ 'pdf-preview': true, full: fullscreen }"
    >
    </iframe>
  </el-dialog>
</template>

<script setup>
import {
  Close,
  FullScreen,
  CopyDocument,
  Download,
} from "@element-plus/icons-vue";

import { downloadFile } from "@/utils";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const fileTitle = ref("");
const filePath = ref("");
const fullscreen = ref(false);

const show = (url, title) => {
  fileTitle.value = title || "PDF文件预览";
  if (url) {
    filePath.value = url;
    dialogVisible.value = true;
  } else {
    proxy.$modal.msgError("文件地址不能为空！");
  }
};

const onFull = () => {
  fullscreen.value = !fullscreen.value;
};

const onCose = () => {
  filePath.value = "";
  fullscreen.value = false;
};

const onDownload = () => {
  downloadFile(filePath.value, fileTitle.value);
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.pdf-preview {
  height: calc(100vh - 280px);
  border: 0px;

  &.full {
    height: calc(100vh - 80px);
  }
}
.costom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-button.is-link {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
