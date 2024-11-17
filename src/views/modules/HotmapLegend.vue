<template>
  <div class="legend">
    <div class="date">2023-1-25</div>
    <div class="item-list">
      <div class="item color1">-147.5 ~ -75.0 mm</div>
      <div class="item color2">-75.0 ~ -47.2 mm</div>
      <div class="item color3">-47.2~ -27.4 mm</div>
      <div class="item color4">-27.4 ~ -13.5mm</div>
      <div class="item color5">-13.5 ~ -2.6 mm</div>
      <div class="item color6">-2.6 ~ 7.4mm</div>
      <div class="item color7">7.4 ~ -16.3mm</div>
      <div class="item color8">16.3 ~ 105.7mm</div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.legend {
  box-sizing: border-box;
  background-color: rgba(7, 22, 60, 72%);
  border-radius: 4%;
  border: 1px solid #1fc6ff45;
  color: #bbcfff;
  //   font-size: 12px;
  position: absolute;
  bottom: 24px;
  right: -8px;
  padding: 12px;
  .date {
    // line-height: 1.8em;
    color: #fff;
    font-weight: 550;
  }
  .item-list {
    margin-top: 4px;
    div {
      &:nth-child(1)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #820014;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(2)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #ff0000;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(3)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #fa8c16;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(4)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #fadb14;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(5)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #bae637;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(6)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #13c2c2;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(7)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #69b1ff;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
      &:nth-child(8)::before {
        content: "";
        display: inline-block;
        height: 12px;
        width: 12px;
        background-color: #1677ff;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
      }
    }
  }
}
</style>
