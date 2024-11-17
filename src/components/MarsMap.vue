<template>
  <div id="fs3d-container" class="mars3d-container"></div>
</template>
<script setup>
/**
 * 地图渲染组件
 */
import * as mars3d from "mars3d";

import { ElMessageBox } from "element-plus";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  gridbg: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// 用于存放地球组件实例
let map; // 地图对象

onMounted(() => {
  let options = {};
  if (props.gridbg) {
    options = {
      scene: {
        center: {
          lat: 39.863464,
          lng: 111.387547,
          alt: 4787.6,
          heading: 1,
          pitch: -45.1,
        },
        showSun: false,
        showMoon: false,
        showSkyBox: false,
        showSkyAtmosphere: false,
        fog: false,
        backgroundColor: "#363635", // 天空背景色
        contextOptions: { webgl: { antialias: !mobilecheck() } },
        globe: {
          baseColor: "#363635", // 地球地面背景色
          showGroundAtmosphere: false,
          enableLighting: false,
        },
        clock: {
          currentTime: "2023-11-01 12:00:00", // 固定光照时间
        },
        cameraController: {
          zoomFactor: 1.5,
          minimumZoomDistance: 0.1,
          maximumZoomDistance: 200000,
          enableCollisionDetection: false, // 允许进入地下
        },
      },
      control: {
        homeButton: true,
        zoom: { insertIndex: 1 },
        baseLayerPicker: false,
        sceneModePicker: false,
        locationBar: {
          fps: true,
          template:
            "<div>经度:{lng}</div> <div>纬度:{lat}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div>",
        },
      },
      layers: [
        {
          name: "网格线",
          type: "grid",
          color: "#ffffff",
          alpha: 0.08,
          cells: 2,
          show: true,
        },
      ],
    };
  }

  // 获取配置
  mars3d.Util.fetchJson({ url: props.url }).then((data) => {
    initMars3d({
      // 合并配置项
      ...data.map3d,
      ...props.options,
      ...options,
    });
  });
});

// onload事件将在地图渲染后触发
const emit = defineEmits(["onload"]);
const initMars3d = (option) => {
  if (props.gridbg) {
    delete option.terrain;
    delete option.basemaps;
  }

  map = new mars3d.Map("fs3d-container", option);

  // 开场动画
  map.openFlyAnimation();

  // 针对不同终端的优化配置
  if (mars3d.Util.isPCBroswer()) {
    map.zoomFactor = 2.0; // 鼠标滚轮放大的步长参数

    // IE浏览器优化
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
      map.viewer.targetFrameRate = 20; // 限制帧率
      map.scene.requestRenderMode = false; // 取消实时渲染
    }
  } else {
    map.zoomFactor = 5.0; // 鼠标滚轮放大的步长参数

    // 移动设备上禁掉以下几个选项，可以相对更加流畅
    map.scene.requestRenderMode = false; // 取消实时渲染
    map.scene.fog.enabled = false;
    map.scene.skyAtmosphere.show = false;
    map.scene.globe.showGroundAtmosphere = false;
  }

  // //二三维切换动画
  if (map.viewer.sceneModePicker) {
    map.viewer.sceneModePicker.viewModel.duration = 0.0;
  }

  // webgl渲染失败后，刷新页面
  map.on(mars3d.EventType.renderError, async () => {
    ElMessageBox.alert("程序内存消耗过大，请重启浏览器", "警告", {
      confirmButtonText: "确认",
      callback: (action) => {
        window.location.reload();
      },
    });
  });

  // map构造完成后的一些处理
  onMapLoad();

  emit("onload", map);
};

// map构造完成后的一些处理
function onMapLoad() {
  // // Mars3D地图内部使用，如右键菜单弹窗
  // // @ts-ignore
  // window.globalAlert = $alert
  // // @ts-ignore
  // window.globalMsg = $message
  // // 用于 config.json 中 西藏垭口 图层的详情按钮 演示
  // // @ts-ignore
  // window.showPopupDetails = (item: any) => {
  //   $alert(item.NAME)
  // }
}

function mobilecheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

// 组件卸载之前销毁mars3d实例
onUnmounted(() => {
  if (map) {
    map.destroy();
    map = null;
  }
  console.log("map销毁完成", map);
});
</script>

<style lang="less">
/**cesium 工具按钮栏*/
.cesium-viewer-toolbar {
  top: auto !important;
  bottom: 35px !important;
  left: 12px !important;
  right: auto !important;
}
.cesium-toolbar-button img {
  height: 100%;
}
.cesium-viewer-toolbar > .cesium-toolbar-button,
.cesium-navigationHelpButton-wrapper,
.cesium-viewer-geocoderContainer {
  margin-bottom: 5px;
  float: left;
  clear: both;
  text-align: center;
}
.cesium-button {
  background-color: rgba(23, 49, 71, 0.8);
  color: #e6e6e6;
  fill: #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 32px;
}
.cesium-button:hover {
  background: #3ea6ff;
}

/**cesium 底图切换面板*/
.cesium-baseLayerPicker-dropDown {
  bottom: 0;
  left: 40px;
  max-height: 700px;
  margin-bottom: 5px;
  background-color: rgba(23, 49, 71, 0.8);
}

/**cesium 帮助面板*/
.cesium-navigation-help {
  top: auto;
  bottom: 0;
  left: 40px;
  transform-origin: left bottom;
  background: none;
  background-color: rgba(23, 49, 71, 0.8);
  .cesium-navigation-help-instructions {
    background: none;
  }
  .cesium-navigation-button {
    background: none;
  }
  .cesium-navigation-button-selected,
  .cesium-navigation-button-unselected:hover {
    background: rgba(0, 138, 255, 0.2);
  }
}

/**cesium 二维三维切换*/
.cesium-sceneModePicker-wrapper {
  width: auto;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon {
  float: right;
  margin: 0 3px;
}

/**cesium POI查询输入框*/
.cesium-viewer-geocoderContainer .search-results {
  left: 0;
  right: 40px;
  width: auto;
  z-index: 9999;
}
.cesium-geocoder-searchButton {
  background-color: rgba(23, 49, 71, 0.8);
}
.cesium-viewer-geocoderContainer .cesium-geocoder-input {
  background-color: rgba(63, 72, 84, 0.7);
}
.cesium-viewer-geocoderContainer .cesium-geocoder-input:focus {
  background-color: rgba(63, 72, 84, 0.9);
}
.cesium-viewer-geocoderContainer .search-results {
  background-color: rgba(23, 49, 71, 0.8);
}

/**cesium info信息框*/
.cesium-infoBox {
  top: 50px;
  background-color: rgba(23, 49, 71, 0.8);
}
.cesium-infoBox-title {
  background-color: rgba(23, 49, 71, 0.8);
}

/**cesium 任务栏的FPS信息*/
.cesium-performanceDisplay-defaultContainer {
  top: auto;
  bottom: 35px;
  right: 50px;
}
.cesium-performanceDisplay-ms,
.cesium-performanceDisplay-fps {
  color: #fff;
}

/**cesium tileset调试信息面板*/
.cesium-viewer-cesiumInspectorContainer {
  top: 10px;
  left: 10px;
  right: auto;
}
.cesium-cesiumInspector {
  background-color: rgba(23, 49, 71, 0.8);
}

/**覆盖mars3d内部控件的颜色等样式*/
.mars3d-compass .mars3d-compass-outer {
  fill: rgba(23, 49, 71, 0.8);
}
.mars3d-contextmenu-ul,
.mars3d-sub-menu {
  background-color: rgba(23, 49, 71, 0.8);

  > li > a:hover,
  > li > a:focus,
  > li > .active {
    background-color: #3ea6ff;
  }

  > .active > a,
  > .active > a:hover,
  > .active > a:focus {
    background-color: #3ea6ff;
  }
}

/* Popup样式*/
.mars3d-popup-color {
  color: #ffffff;
}
.mars3d-popup-background {
  background: rgba(23, 49, 71, 0.8);
}
.mars3d-popup-content {
  margin: 15px;
}
.mars3d-template-content label {
  padding-right: 6px;
}
.mars3d-template-titile {
  border-bottom: 1px solid #3ea6ff;
}
.mars3d-template-titile a {
  font-size: 16px;
}
.mars3d-tooltip {
  background: rgba(23, 49, 71, 0.8);
  border: 1px solid rgba(23, 49, 71, 0.8);
}

.mars3d-popup-btn-custom {
  padding: 3px 10px;
  border: 1px solid #209ffd;
  background: #209ffd1c;
}
</style>
