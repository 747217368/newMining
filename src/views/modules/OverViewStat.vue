<template>
  <chart-card-layout class="chart" title="物联网设备">
    <template #extra>
      <div class="device-state" style="min-width: 160px">
        <div class="count online">
          在线 <span>{{ state.sum.online }}</span>
        </div>
        <div class="count offline">
          离线 <span>{{ state.sum.offline }}</span>
        </div>
      </div>
    </template>
    <div class="stat-items">
      <div class="item">
        <img src="@/assets/images/uva.png" />
        <div class="stat-info">
          <div class="label">生态无人机</div>
          <div class="device-state">
            <div class="count online">
              在线 <span>{{ state.gnss.online }}</span>
            </div>
            <div class="count offline">
              离线 <span>{{ state.gnss.offline }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <img src="@/assets/images/fenchen.png" />
        <div class="stat-info">
          <div class="label">粉尘仪</div>
          <div class="device-state">
            <div class="count online">
              在线 <span>{{ state.video.online }}</span>
            </div>
            <div class="count offline">
              离线 <span>{{ state.video.offline }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <img src="@/assets/images/wuhou.png" />
        <div class="stat-info">
          <div class="label">物候相机</div>
          <div class="device-state">
            <div class="count online">
              在线 <span>{{ state.radar.online }}</span>
            </div>
            <div class="count offline">
              离线 <span>{{ state.radar.offline }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <img src="@/assets/images/qixiangzhan.png"" />
        <div class="stat-info">
          <div class="label">气象站</div>
          <div class="device-state">
            <div class="count online">
              在线 <span>{{ state.cxy.online }}</span>
            </div>
            <div class="count offline">
              离线 <span>{{ state.cxy.offline }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
const props = defineProps({
  mineId: {
    type: Number,
    default: null,
  },
});

const state = ref({
  sum: {
    online: 446,
    offline: 22,
  },
  gnss: {
    online: 24,
    offline: 1,
  },
  video: {
    online: 113,
    offline: 12,
  },
  radar: {
    online: 2,
    offline: 1,
  },
  cxy: {
    online: 3,
    offline: 0,
  },
});

watch(
  () => props.mineId,
  (newVal) => {
    if (newVal) {
      state.value = {
        sum: {
          online: 21,
          offline: 2,
        },
        gnss: {
          online: 3,
          offline: 1,
        },
        video: {
          online: 4,
          offline: 0,
        },
        radar: {
          online: 2,
          offline: 0,
        },
        cxy: {
          online: 12,
          offline: 1,
        },
      };
    } else {
      state.value = {
        sum: {
          online: 446,
          offline: 22,
        },
        gnss: {
          online: 24,
          offline: 1,
        },
        video: {
          online: 113,
          offline: 12,
        },
        radar: {
          online: 31,
          offline: 1,
        },
        cxy: {
          online: 278,
          offline: 8,
        },
      };
    }
  },
);
</script>

<style lang="less" scoped>
.chart {
  // height: 220px;

  .stat-items {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 16px;
    // justify-content: space-between;
    // gap: 0px;
    .item {
      display: flex;
      align-items: center;
      height: 64px;
      width: 50%;
      img {
        width: 38px;
        height: 44px;
      }

      .stat-info {
        margin-left: 8px;
        flex: 1;
        .label {
          color: #fff;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
        }
      }
    }

    // .item:nth-child(2),
    // .item:nth-child(4) {
    //   margin-left: 16px;
    // }
  }

  .device-state {
    color: #fff;
    //   font-size: 24px;
    font-style: normal;
    //   font-weight: 600;
    display: flex;
    align-items: center;
    margin-top: 2px;
    gap: 8px;

    .count {
      font-size: 12px;
      // margin: 0pc 4px;
      flex: 1;

      &.online {
        color: #1fc6ff;
        &::before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          height: 6px;
          width: 6px;
          border-radius: 3px;
          background-color: #389e0d;
          margin-right: 4px;
        }
        span {
          color: #389e0d;
          font-size: 16px;
          font-weight: 550;
        }
      }

      &.offline {
        color: rgba(255, 255, 255, 0.65);
        &::before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          height: 6px;
          width: 6px;
          border-radius: 3px;
          background-color: rgba(255, 255, 255, 0.65);
          margin-right: 4px;
        }
        span {
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
          font-weight: 550;
        }
      }
    }
  }
}
</style>
