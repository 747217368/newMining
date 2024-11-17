<template>
  <div class="card">
    <div class="title">
      <div class="txt">坡顶坡底线</div>
      <el-icon class="el-icon--right" @click="onClose"><close /></el-icon>
    </div>
    <div class="legend">
      <div class="item"><span class="red"></span> 坡顶线</div>
      <div><span class="yellow"></span>坡底线</div>
    </div>
  </div>
</template>

<script setup>
import { Close } from "@element-plus/icons-vue";
import { watch } from "vue";

const emit = defineEmits(["close"]);

const onClose = () => {
  emit("close");
};
</script>

<style lang="less" scoped>
.card {
  box-sizing: border-box;
  background-color: rgba(4, 26, 33, 0.85);
  padding: 12px 8px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    .txt {
      padding-left: 8px;
      font-size: 12px;
    }

    i {
      cursor: pointer;
    }
  }
  .legend {
    color: #fff;
    font-size: 12px;
    margin-top: 8px;
    width: 200px;
    display: flex;
    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        width: 32px;
        height: 4px;
        margin-right: 4px;
        border-radius: 2px;
        &.red {
          background-color: #ff0000;
        }

        &.yellow {
          background-color: #ffff00;
        }
      }
    }
  }
}
</style>
