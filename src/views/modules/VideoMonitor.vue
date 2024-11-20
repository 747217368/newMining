<template>
  <chart-card-layout class="chart" title="生态退化风险统计">
    
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, onMounted } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";

</script>

<style lang="less" scoped>
.chart {
  margin-top: 12px;
  height: 260px;

  .videos {
    height: 100%;
    position: relative;
  }

  .stat-items {
    height: 100%;
    box-sizing: border-box;
    padding: 12px 12px;
    overflow-x: hidden;

    .item {
      width: 100%;
      margin-bottom: 0px;
      box-sizing: border-box;

      .video {
        height: 100px;
        border: 1px solid #0a4456;
        // ba
        background-image: url(@/assets/images/video-cover.png);
        background-size: cover;
        // border-radius: 6px;
      }

      .title {
        text-align: center;
        color: #adeaff;
        font-size: 12px;
        font-style: normal;
        // font-weight: 600;
        line-height: 24px;
      }
    }
  }
}
</style>
