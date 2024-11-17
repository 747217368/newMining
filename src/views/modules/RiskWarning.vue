<template>
  <chart-card-layout class="chart" title="实时预警">
    <div class="warining-list">
      <Vue3SeamlessScroll
        :list="dataList"
        :step="0.15"
        hover
        class="scroll-content"
      >
        <div class="item" v-for="item in dataList" :key="item.id">
          <div class="date">{{ item.time }}</div>
          <div :class="`warnning-content ${['red', 'yellow'][item.level]}`">
            <div class="level-block">
              <img src="@/assets/svg/warn-icon.svg" />
              <span>{{ ["Ⅰ级", "Ⅱ级"][item.level] }}</span>
            </div>
            <div class="warnning-txt">
              {{ item.message }}
            </div>
          </div>
        </div>
      </Vue3SeamlessScroll>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
const dataList = [
  {
    id: 1,
    message: "降雨异常！",
    time: "2023-08-13 08:91:36",
    level: 0,
  },
  {
    id: 2,
    message: "630边坡形变异常！",
    time: "2023-08-16 17:42:17",
    level: 1,
  },
  {
    id: 3,
    message: "780边坡疑似裂缝！",
    time: "2023-08-18 10:16:08",
    level: 1,
  },
  {
    id: 4,
    message: "C02测斜仪数据异常！",
    time: "2023-08-18 19:50:51",
    level: 0,
  },
  {
    id: 5,
    message: "107边坡位移异常！",
    time: "2023-08-19 02:27:19",
    level: 1,
  },
];
</script>

<style lang="less" scoped>
.chart {
  margin-top: 12px;
  // height: 260px;
  flex: 1;
  .warining-list {
    height: 100%;
    position: relative;
    .scroll-content {
      box-sizing: border-box;
      position: absolute;
      padding: 16px 24px;
      top: 8px;
      left: 0px;
      width: 100%;
      height: calc(100% - 8px);
      overflow-y: hidden;
      .item {
        margin-bottom: 16px;
        .date {
          color: #1fc6ff;
          font-size: 18px;
          font-style: normal;
          font-weight: 600;
          line-height: 27px;
        }

        // &:nth-child(1) {
        //   margin-top: 0px;
        // }

        .date::after {
          content: "";
          display: inline-block;
          margin-left: 12px;
          width: 22px;
          height: 10px;
          vertical-align: middle;
          background-image: url(@/assets/svg/arrow-3.svg);
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }

        .warnning-content {
          margin-top: 4px;
          display: flex;
          height: 32px;
          display: flex;
          align-items: stretch;
          color: #fff;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          .level-block {
            width: 68px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            // padding: 0px 8px;
            justify-content: center;

            img {
              height: 20px;
              width: 20px;
              margin-right: 4px;
            }
          }

          .warnning-txt {
            box-sizing: border-box;
            flex: 1;
            margin-left: 4px;
            line-height: 32px;
            padding: 0px 8px;
          }

          &.red {
            .level-block {
              border-left: 2px solid #ff386b;
              background: rgba(255, 56, 107, 0.2);
            }

            .warnning-txt {
              background: rgba(255, 56, 107, 0.2);
              background-image: url(@/assets/svg/red-warning-bg.svg);
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
          }

          &.yellow {
            .level-block {
              border-left: 2px solid #ff911f;
              background: rgba(255, 145, 31, 0.2);
            }

            .warnning-txt {
              background: rgba(255, 145, 31, 0.2);
              background-image: url(@/assets/svg/red-warning-bg.svg);
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
          }
        }
      }
    }
  }
}
</style>
