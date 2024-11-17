import {
  createWebHistory,
  createRouter,
  createWebHashHistory,
} from "vue-router";

import BasicLayout from "@/layouts/basic-layout.vue";

export const constantRoutes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/login",
    component: () => import("@/views/index"),
    hidden: true,
    meta: { title: "登录" },
  },
  {
    path: "/index",
    component: () => import("@/views/index"),
    hidden: true,
    meta: { title: "首页" },
  },
  {
    path: "/data-manage",
    component: () => import("@/views/data-manage/index"),
    meta: { title: "数据管理" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
