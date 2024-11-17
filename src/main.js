import { createApp } from "vue";

import "@/style/index.less";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
import "mars3d/dist/mars3d.css";
import "@/style/divGraphic.less";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import store from "./store";
import router from "./router";
import "./permission"; // permission control
import App from "./App.vue";
import "@/utils/rem";

import "@/assets/iconFont/iconfont.css";
import "@/style/dark-theme.less"; // global css

// svg图标
// import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon";
import elementIcons from "@/components/SvgIcon/svgicon";

// 注册指令
import plugins from "./plugins"; // plugins
import { parseTime, resetForm, addDateRange, handleTree } from "@/utils/fushan";

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;

app.use(router);
app.use(store);
app.use(elementIcons);
app.use(plugins);
app.component("svg-icon", SvgIcon);
// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: zhCn,
  // 支持 large、default、small
  size: "default",
});

app.mount("#app");
