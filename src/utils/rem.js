const baseSize = 100; // 注意此值要与 vite.config.js 文件中的 rootValue保持一致
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改,一般设计稿都是宽1920(图方便可以拿到设计图后改过来)。
  const scale = document.documentElement.clientWidth / 1920;
  // 设置页面根节点字体大小（“Math.min(scale, 5)” 指最高放大比例为5，可根据实际业务需求调整）
  document.documentElement.style.fontSize =
    baseSize * (scale >= 1 ? 1 : Math.min(scale, 5)) + "px";
}

window.onresize = function () {
  setRem();
};

setRem();

export {};
