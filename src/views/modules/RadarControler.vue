<template>
  <div class="lite-card">
    <div class="title">
      <div class="txt">雷达</div>
      <div class="state">在线</div>
    </div>
    <div class="btns">
      <el-tooltip content="开始扫描" placement="bottom">
        <div class="btn" @click="onScan">
          <el-icon color="#389e0d" size="22"><CaretRight /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="停止扫描" placement="bottom">
        <div class="btn" @click="onStop">
          <div class="stop"></div>
        </div>
      </el-tooltip>
      <el-tooltip content="雷达复位" placement="bottom">
        <div class="btn" @click="onReset">
          <el-icon color="#1677ff" size="22"><RefreshRight /></el-icon>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { radarCommand } from "@/api/slope";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();

import {
  CaretRight,
  RefreshRight,
  SwitchButton,
} from "@element-plus/icons-vue";

const props = defineProps({
  deviceId: {
    type: String,
    required: true,
  },
});

const onScan = () => {
  ElMessageBox.confirm("您确定要开始扫描?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      doCommand(3);
    })
    .catch(() => {});
};
const onStop = () => {
  ElMessageBox.confirm("您确定要停止扫描?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      doCommand(4);
    })
    .catch(() => {});
};

const onReset = () => {
  ElMessageBox.confirm("您确定要雷达复位?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      doCommand(5);
    })
    .catch(() => {});
};

const doCommand = (command) => {
  const params = {
    deviceId: props.deviceId,
    projectId: userStore.projects[0],
    command,
    userName: userStore.name,
  };
  radarCommand(params).then((res) => {
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: "执行成功！",
      });
    }
  });
};
</script>

<style lang="less" scoped>
.lite-card {
  box-sizing: border-box;
  background-color: rgba(4, 26, 33, 0.85);
  padding: 8px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    .txt {
      font-size: 12px;
    }

    i {
      cursor: pointer;
    }

    .state {
      color: #52c41a;
      font-size: 12px;
      &::before {
        content: "";
        display: inline-block;
        height: 4px;
        width: 4px;
        background-color: #52c41a;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
    }
  }
  .btns {
    margin-top: 8px;
    display: flex;
    gap: 12px;
    .btn {
      height: 40px;
      width: 40px;
      border-radius: 20px;
      background-color: rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      .stop {
        background-color: #a8071a;
        height: 14px;
        width: 14px;
        border-radius: 2px;
      }
    }

    .btn:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.45);
    }

    .btn:active {
      background-color: rgba(0, 0, 0, 0.55);
    }
  }
}
</style>
