<template>
  <div class="card">
    <div class="title">
      <div class="txt">{{ ["形变(单位:mm)", "强度归一化"][props.type] }}</div>
      <el-icon class="el-icon--right" @click="onClose"><close /></el-icon>
    </div>
    <img
      class="color-bar"
      v-if="props.type == 0"
      src="@/assets/images/colorbar1.png"
    />
    <img
      class="color-bar"
      v-else-if="props.type == 1"
      src="@/assets/images/colorbar2.png"
    />
  </div>
</template>

<script setup>
import { Close } from "@element-plus/icons-vue";
import { watch } from "vue";

const props = defineProps({
  type: {
    type: Number,
    default: 0,
  },
});

const imgType = ref(0);

watch(
  () => props.type,
  (newVal, oldVal) => {
    imgType.value = newVal;
  },
);

const emit = defineEmits(["close"]);

const onClose = () => {
  emit("close");
};
</script>

<style lang="less" scoped>
.card {
  box-sizing: border-box;
  background-color: rgba(4, 26, 33, 0.85);
  padding: 12px;
  height: 84px;
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
  .color-bar {
    margin-top: 8px;
    width: 300px;
  }
}
</style>
