import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import createVitePlugins from "./vite/plugins";
import postCssPxToRem from "postcss-pxtorem";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    // base: VITE_APP_ENV === 'production' ? '/' : '/',
    base: "./",
    plugins: createVitePlugins(env, command === "build"),
    css: {
      modules: {
        localsConvention: "camelCase", // 默认只支持驼峰，修改为同时支持横线和驼峰
      },
      // 全局变量+全局引入less+配置antdv主题色
      preprocessorOptions: {
        less: {
          importStyle: "less",
          javascriptEnabled: true,
          // 全局变量使用：@primary-color
          modifyVars: {
            hack: 'true; @import "@/style/theme.less"',
          },
        },
      },
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 100, // 结果为：设计稿元素尺寸/100，比如元素宽1920px,最终页面会换算成 19.2rem 需要与utils/rem中的baseSize一致
            propList: ["*"],
            minPixelValue: 1,
            selectorBlackList: [".el"], // 过滤掉.norem-开头的class，不进行rem转换
          }),
        ],
      },
    },
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": path.resolve(__dirname, "./"),
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    // vite 相关配置
    server: {
      port: 6688,
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: "http://218.21.174.14:20000",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, "/api"),
        },
        "/radar-api": {
          target: "http://218.21.174.14:20000",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/radar-api/, ""),
        },
      },
    },
  };
});
