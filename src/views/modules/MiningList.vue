<template>
  <chart-card-layout class="chart" title="哈尔乌素露天煤矿分区">
    <div class="content">
      <div class="list">
        <div class="th">
          <div class="cell">名称</div>
          <div class="cell center" style="flex: 0.5">操作</div>
        </div>
        <div class="tb">
          <div class="trs">
            <div
              class="tr"
              v-for="(item, index) in state.dataList"
              :key="index"
            >
              <div class="cell">{{ item.name }}</div>
              <div class="cell center" style="flex: 0.5">
                <el-button
                  color="#1fc6ff"
                  plain
                  size="small"
                  dark
                  @click="onClick(item.id)"
                >
                  进入
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </chart-card-layout>
</template>

<script setup>
// @ts-nocheck
import { watch, reactive, ref } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
const state = reactive({
  scroll: true,
  dataList: [
    {
      id: 88617,
      name: "剥离区",
      address: "准格尔煤田中部",
      output: 3100,
    },
    {
      id: 270451,
      name: "开采区",
      address: "薛家湾镇东部",
      output: 2900,
    },
    {
      id: 1114278,
      name: "排土区",
      address: "准格尔煤田中部",
      output: 3100,
    },

    {
      id: 566835,
      name: "修复区",
      address: "准格尔煤田中部",
      output: 3100,
    },
    {
      id: 250381,
      name: "周边影响区",
      address: "准格尔煤田中部",
      output: 3100,
    },
  ],
});
const emit = defineEmits(["onClick"]);

const onClick = (id) => {
  emit("onClick", id);
};
</script>

<style lang="less" scoped>
.chart {
  box-sizing: border-box;
  height: 280px;
  margin-top: 12px;
  .content {
    box-sizing: border-box;
    height: 100%;
    color: #fff;
    padding: 0px 12px;
    display: flex;
    flex-direction: column;
    .sum-count {
      height: 38px;
      box-sizing: border-box;
      background-image: url(@/assets/svg/label-bg-3.png);
      background-size: 264px 38px;
      background-position: center;
      background-repeat: no-repeat;
      // text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      img {
        height: 24px;
        width: 24px;
        margin-right: 4px;
      }
      .count {
        font-size: 20px;
        color: #1fc6ff;
      }
    }

    .list {
      box-sizing: border-box;
      font-size: 14px;
      padding: 12px 0px;
      flex: 1;
      // overflow: auto;

      display: flex;
      flex-direction: column;
      .th,
      .tr {
        height: 40px;
        line-height: 40px;
        display: flex;
        align-items: stretch;

        color: #b4c0cc;
        padding: 0px 8px;

        .cell {
          flex: 1;

          &.center {
            text-align: center;
          }
        }

        .cell:nth-child(2) {
          flex: none;
          width: 80px;
        }
      }

      .th {
        background: rgba(31, 198, 255, 0.2);
      }

      .tr {
        color: #fff;
      }
      .tr:hover {
        cursor: pointer;
        border-left: 2px solid #1fc6ff;
        background: rgba(31, 198, 255, 0.2);
      }
      .tb {
        flex: 1;
        position: relative;
        .trs {
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
