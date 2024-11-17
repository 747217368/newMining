<template>
  <div class="layout">
    <div class="layout-header">
      <div class="left">
        <img class="logo" src="@/assets/vue.svg" />
        <div class="title">矿山生态修复大数据指挥舱</div>
      </div>
      <div class="navigation">
        <el-menu
          router
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          background-color="#303336"
          text-color="#fff"
          active-text-color="#ffd04b"
          :ellipsis="false"
        >
          <el-menu-item
            :index="item.path"
            v-for="item in menus"
            :key="item.name"
            >{{ item.meta.title }}</el-menu-item
          >
        </el-menu>
        <el-dropdown>
          <div class="userinfo">
            <el-avatar
              size="small"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
            <div class="username">邵冬冬</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="layout-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { watch, reactive, ref, onUnmounted, computed } from "vue";

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const $route = useRoute();

const activeIndex = ref("/index");

const menus = computed(() => router.options.routes[0].children);

console.log("$route", $route);

const handleSelect = () => {};
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100%;
  min-width: 1080px;
  overflow-x: auto;
  .layout-header {
    box-sizing: border-box;
    background-color: #303336;
    display: flex;
    // justify-content: space-between;
    padding: 0px 12px;

    .left {
      height: 60px;
      line-height: 60px;
      display: flex;
      align-items: center;
      color: #fff;

      .logo {
        height: 48px;
        width: 48px;
        margin: 0px 4px;
      }
      .title {
        font-size: 20px;
        letter-spacing: 1px;
        font-weight: 550;
      }
    }

    .navigation {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: stretch;
      margin-left: 36px;

      .userinfo {
        display: flex;
        align-items: center;
        height: 60px;
        line-height: 60px;
        padding: 0px 20px;

        .username {
          color: #fff;
          margin-left: 8px;
        }
      }

      .userinfo:hover {
        cursor: pointer;
        background-color: rgba(67, 74, 80, 1);
      }
    }
  }

  .layout-content {
    flex: 1;
    overflow-y: auto;
    background-color: #f0f0f0;
  }
}
</style>
