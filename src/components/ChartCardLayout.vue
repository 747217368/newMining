<template>
  <div class="card">
    <div class="header">
      <!-- 作为背景图片 -->
      <!-- <img src="@/assets/svg/card-header-bg.svg" /> -->
      <div class="header-content">
        <div class="title">
          {{ props.title }}
        </div>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { watch, reactive, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "统计卡片",
  },
});
</script>

<style lang="less" scoped>
.card {
  display: flex;
  flex-direction: column;
  background-color: rgba(7, 22, 60, 72%);//rgba(4, 26, 33, 0.85);;
  pointer-events: all;
  .header {
    position: relative;
    height: 32px;
    padding: 8px 12px;

    .header-content {
      // position: absolute;
      width: 100%;
      // height: 100%;
      top: 0px;
      left: 0px;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1fc6ff45;
      border-left: 4px solid #1fc6ff;
      .title {
        font-family: PangMen;
        margin-left: 8px;
        color: #fff;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 32px;
        background: linear-gradient(90deg, #ffffff 0%, #90deff 100%);
        -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
        -webkit-text-fill-color: transparent; /*给文字设置成透明*/
      }
    }
  }

  .card-content {
    // background-image: url(@/assets/svg/left-line.svg),
    //   url(@/assets/svg/bottom-line.svg), url(@/assets/svg/right-line.svg);
    // background-size: 2px 100%, 100% 2px, 2px 100%;
    // background-position: left top, left bottom, right top;
    // background-repeat: no-repeat, no-repeat, no-repeat;
    flex: 1;
  }

  .extra {
    pointer-events: all;
    padding-right: 8px;
    color: #fff;
  }
}
</style>
