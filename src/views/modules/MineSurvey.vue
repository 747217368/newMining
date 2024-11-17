<template>
  <chart-card-layout class="chart" title="煤矿概况">
    <div class="chart-content">
      <div>名称：宏燃煤矿</div>
      <div>开工时间：2016年11月</div>
      <div class="bg">井田面积：12.33 km²</div>
      <div class="bg">可采原煤储量：3500万吨</div>
      <div>设计生产能力：120万吨/年</div>
      <div>服务年限：40 年</div>
      <div class="row bg">所属公司：内蒙古宏燃能源有限公司</div>
      <!-- <div class="row">
        边坡指标规范：
        <el-button color="#1fc6ff" plain size="small" dark link>
          点击查看
        </el-button>
      </div> -->
    </div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, computed, defineProps } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
</script>

<style lang="less" scoped>
.chart {
  .chart-content {
    padding: 12px 4px;
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    color: #fff;
    div {
      // flex: 1;
      box-sizing: border-box;
      width: 50%;
      line-height: 32px;
      padding: 0px 8px;

      &.row {
        width: 100%;
        display: flex;
        align-items: center;
      }

      &.bg {
        background-color: #113036;
      }
    }
  }
}
</style>
