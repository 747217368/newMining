<template>
  <chart-card-layout class="chart" title="生态退化风险统计">
    
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, onMounted } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
// import "video.js/dist/video-js.css";
// import videojs from "video.js";
// import { cloneDeep } from "lodash";
const videoList = ref([
  {
    id: 1,
    name: "哈尔乌素排土场01",
    src: "https://video.oceangreate.com:7096/live/cameraid/1003152%240/substream/2.m3u8",
  },
  {
    id: 2,
    name: "哈尔乌素排土场02",
    src: "https://video.oceangreate.com:7096/live/cameraid/1003156%240/substream/2.m3u8",
  },
  {
    id: 3,
    name: "哈尔乌素排土场03",
    src: "https://video.oceangreate.com:7096/live/cameraid/1003149%240/substream/2.m3u8",
  },
  {
    id: 4,
    name: "哈尔乌素排土场04",
    src: "https://video.oceangreate.com:7096/live/cameraid/1003155%240/substream/2.m3u8",
  },
]);

onMounted(() => {
  // try {
  //   const options = {
  //     autoplay: true, // true,浏览器准备好时开始播放。
  //     muted: true, // 默认情况下将会消除音频。
  //     loop: true, // 导致视频一结束就重新开始。
  //     controls: true, //取消视频中的进度条
  //     preload: "auto", // auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  //     language: "zh-CN", //汉化
  //     fluid: true, // 当true时，将按比例缩放以适应其容器。
  //     width: "190px",
  //     sources: [
  //       {
  //         type: "application/x-mpegURL",
  //         src: "", //视频播放地址
  //       },
  //     ],
  //     notSupportedMessage: "此视频暂无法播放，请稍后再试", // 无法播放媒体源时显示的默认信息。
  //     textTrackDisplay: false,
  //   };
  //   videoList.value.forEach((item: any) => {
  //     let option = cloneDeep(options);
  //     option.sources[0].src = item.src;
  //     item.player = videojs(`videoElement_${item.id}`, option, () => {
  //       item.player.play();
  //     });
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
});
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
