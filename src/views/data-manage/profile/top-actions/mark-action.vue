<template>
  <div class="tips">
    <div class="info">
      当前坐标：{{ earthStore.drawCoordinate.toString() }}
      <!-- <el-link icon="Edit"></el-link> -->
    </div>
    <el-space>
      <el-button size="small" type="success" link @click="onDrawComplete">
        绘制完成
      </el-button>
      <el-button size="small" link @click="onCancel"> 取消 </el-button>
    </el-space>
  </div>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";

const emit = defineEmits(["cancel"]);
const earthStore = useEarthMapStore();

const onDrawComplete = () => {
  console.log("earthStore", earthStore);

  earthStore.setDrawerVisible(true);
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
