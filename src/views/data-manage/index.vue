<template>
  <div class="container">
    <div class="project-menu">
      <div class="sys-title" v-if="!isCollapse">监测预警平台数据<br />管理系统</div>
      <el-menu active-text-color="#409EFF" background-color="#304156" :default-active="tabIndex" text-color="#fff"
        :collapse="isCollapse" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="1">
          <el-icon>
            <Tickets />
          </el-icon>
          <span>数据上报</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon>
            <Picture />
          </el-icon>
          <span>数据目录</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <Compass />
          </el-icon>
          <span>数据审核</span>
        </el-menu-item>
      </el-menu>
      <div class="collapse-btn">
        <el-icon @click="onCollapse">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
      <div class="menu-ref-panel dark-theme" :style="{
        width: panelWidth[tabIndex],
        right: `-${panelWidth[tabIndex]}`,
      }" v-show="panelVisible">
        <div class="header">
          <div class="header-title">
            <div class="tab-name">{{ tabName }}</div>
          </div>
          <div class="close-btn" @click="panelVisible = false">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
        <div class="panel-content">
          <tab-data-list v-if="tabIndex == '1'" :projectId="route.query?.id"
            @layersLoad="layersLoadHandle"></tab-data-list>
          <!-- <tab-file-upload v-else-if="tabIndex == '2'"></tab-file-upload> -->
          <tab-analysis v-else-if="tabIndex == '2'" :mapInstance="mapInstance" :graphicLayer="graphicLayer"
            :projectInfo="projectInfo" :measure="measure" @layers-load="layersLoadHandle"
            @layer-click="layerClickHandle"></tab-analysis>
          <tab-scene-list v-else-if="tabIndex == '3'" :projectId="route.query?.id"></tab-scene-list>
        </div>
      </div>
    </div>
    <div class="map-alert" type="warning" :closable="false" v-show="tabIndex == '2' && earthStore.alertShow">
      <!-- 点位标记 -->
      <mark-action v-if="earthStore.analysisType == 'marker' &&
        earthStore.drawCoordinate.length
        " @cancel="onAnalysisCancel" />
      <!-- 测量距离 -->
      <distance-action v-if="earthStore.analysisType == 'distance'" @cancel="onAnalysisCancel" :measure="measure">
      </distance-action>
      <!-- 运输路径分析 -->
      <path-analysis-action v-if="earthStore.analysisType == 'path-analysis'" @cancel="onAnalysisCancel"
        :measure="measure"></path-analysis-action>
      <!-- 测量面积 -->
      <area-action v-if="earthStore.analysisType == 'area'" @cancel="onAnalysisCancel" :measure="measure">
      </area-action>
      <!-- 剖面测量 -->
      <bisect-action v-if="earthStore.analysisType == 'bisect'" @cancel="onAnalysisCancel"
        :measure="measure"></bisect-action>
      <!-- 收方报告 -->
      <excavation-report-action v-if="earthStore.analysisType == 'excavation-report'" @cancel="onAnalysisCancel"
        :measure="measure" :layerGroup="layerGroup" :mapInstance="mapInstance"></excavation-report-action>

      <!-- 工作面参数测量 -->
      <face-action v-if="earthStore.analysisType == 'face'" @cancel="onAnalysisCancel" :measure="measure"></face-action>
      <!-- 生成等高线 -->
      <contour-action v-if="earthStore.analysisType == 'contour'" @cancel="onAnalysisCancel" :measure="measure"
        :mapInstance="mapInstance"></contour-action>
    </div>
    <earth-map class="earth-3d" :url="configUrl" map-key="fs" @onload="marsOnload"></earth-map>
  </div>
</template>

<script setup>
import axios from "axios";
import * as mars3d from "mars3d";
import EarthMap from "@/components/EarthMap";
import TabSceneList from "./profile/tab-scene-list.vue"; // TODO
import TabDataList from "./profile/tab-data-list.vue"; // TODO
import TabAnalysis from "./profile/tab-analysis.vue"; // TODO
// import { getProjectDetail } from "@/api/slope/project"; // TODO
import useEarthMapStore from "@/store/modules/earthMap";
import MarkAction from "./profile/top-actions/mark-action.vue";
import DistanceAction from "./profile/top-actions/distance-action.vue";
import AreaAction from "./profile/top-actions/area-action.vue";
import ExcavationReportAction from "./profile/top-actions/excavation-report-action.vue";
import PathAnalysisAction from "./profile/top-actions/path-analysis-action.vue";
// import CompareAction from "./profile/top-actions/compare-action.vue";
import BisectAction from "./profile/top-actions/bisect-action.vue";
import FaceAction from "./profile/top-actions/face-action.vue";
import ContourAction from "./profile/top-actions/contour-action.vue";
// import earthAnalysisUtils from "@/utils/earch-analysis-utils";
// import { toWsg84 } from "@/utils/transform-utils";
import mapUtil from "./profile/map";
import cadImg from "@/assets/data/cad3.png";
import hongranImg from "@/assets/data/hongranmk.png";


const { proxy } = getCurrentInstance();
const configUrl = "config/config.json";
const isCollapse = ref(false);
const panelVisible = ref(true);
const tabName = ref("项目信息");
const tabIndex = ref("2");
const projectInfo = ref({
  id: undefined,
  name: undefined,
  description: undefined,
  address: undefined,
  longitude: undefined,
  latitude: undefined,
  createTime: undefined,
});
const route = useRoute();
const router = useRouter();
const earthStore = useEarthMapStore();
const panelWidth = ["450px", "680px", "404px", "680px"];

watch(
  () => tabIndex.value,
  (value, oldValue) => {
    if (oldValue == "1") {
      layerGroup.removeAllLayer();
    } else if (oldValue == "2") {
      layerGroup.removeAllLayer();
      onAnalysisCancel();
    }
  },
);

onMounted(() => {
  mapInstance = null;
});

let mapInstance,
  projetGraphic,
  graphicLayer,
  currentGraphic,
  layerGroup,
  measure,
  map3dUtil;
const marsOnload = (map) => {
  mapInstance = map;
  // 实例化地图操作类
  map3dUtil = new mapUtil(mapInstance);
  // const earthUtils = new earthAnalysisUtils(mapInstance);
  // earthUtils.print();
  // 图层组，容易管理
  layerGroup = new mars3d.layer.GroupLayer({
    show: true,
  });
  mapInstance.addLayer(layerGroup);
  projetGraphic = new mars3d.layer.GraphicLayer({
    hasEdit: false,
    isAutoEditing: false, // 绘制完成后是否自动激活编辑
  });
  mapInstance.addLayer(projetGraphic);
  graphicLayer = new mars3d.layer.GraphicLayer({
    // isRestorePositions: true,
    hasEdit: true,
    isAutoEditing: true, // 绘制完成后是否自动激活编辑
    // drawAddEventType: false,
    // drawEndEventType: mars3d.EventType.rightClick,
    // drawDelEventType: mars3d.EventType.middleClick
  });
  mapInstance.addLayer(graphicLayer);
  earthStore.setDrawGraphicLayer(graphicLayer);
  mapInstance.on(mars3d.EventType.mouseOut, function (event) {
    mapInstance.closeSmallTooltip();
  });

  // 绑定layer标绘相关事件监听(可以自行加相关代码实现业务需求，此处主要做示例)
  graphicLayer.on(mars3d.EventType.drawStart, function (e) {
    console.log("开始绘制", e);
  });
  graphicLayer.on(mars3d.EventType.drawAddPoint, function (e) {
    console.log("绘制过程中增加了点", e);
  });
  graphicLayer.on(mars3d.EventType.drawRemovePoint, function (e) {
    console.log("绘制过程中删除了点", e);
  });
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    console.log("创建完成", e);
    if (earthStore.analysisType == "marker" && tabIndex.value == 2) {
      // currentGraphic = e.graphic;
      earthStore.setAlertShow(true);
      earthStore.setDrawCoordinate(e.graphic.getCoordinate());
    }
  });
  graphicLayer.on(mars3d.EventType.editStart, function (e) {
    console.log("开始编辑", e);
  });
  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    console.log("编辑修改了点,当前位置", currentGraphic.getCoordinate());
    earthStore.setDrawCoordinate(e.graphic.getCoordinate());
  });
  graphicLayer.on(mars3d.EventType.editAddPoint, function (e) {
    console.log("编辑新增了点", e);
  });
  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    console.log("编辑删除了点", e);
  });
  graphicLayer.on(mars3d.EventType.editStop, function (e) {
    console.log("停止编辑", e);
  });
  graphicLayer.on(mars3d.EventType.removeGraphic, function (e) {
    console.log("删除了对象", e);
  });

  // 测量对象
  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 24,
    },
  });
  mapInstance.addThing(measure);

  // 异步分析开始事件
  measure.on(mars3d.EventType.start, function (event) {
    proxy.$modal.loading("正在分析，请稍后...");
    console.log("测量开始", event);
  });

  measure.on(mars3d.EventType.end, function (event) {
    try {
      proxy.$modal.closeLoading();
    } catch (error) { }

    proxy.$modal.msgSuccess("分析完成！");
    console.log("测量结束", event);
    // 计算提升高度
    if (
      earthStore.analysisType == "excavation-report" &&
      event.mtype == "distanceMeasure" &&
      event.graphic.coordinates.length > 1
    ) {
      const coordinates = event.graphic.coordinates;
      const start = coordinates[0];
      const end = coordinates[coordinates.length - 1];
      const drop = end[2] - start[2];
      event.graphic.measured.drop = drop;
      event.graphic.measured.dropStr = `${drop.toFixed(2)}米`;
    }

    if (event.mtype == "areaMeasure") {
      event.graphic.measured.distance = event.graphic.distance;
    }
    event.graphic.measured.coordinates = event.graphic.coordinates;
    const measured = event.graphic.measured;
    earthStore.setMeasuredResult(measured);
    earthStore.setMeasuredGraphic(event.graphic);
  });
  measure.on(mars3d.EventType.click, function (event) {
    // console.log()
    console.log("点击了,测量结果", event.target);
    // target.graphics
    // earthStore.setMeasuredResult(event.target.graphics[0].measured);
  });

  projetGraphic.on(mars3d.EventType.drawCreated, function (e) {
    console.log("创建完成", e);
    // earthStore.setDrawCoordinate(e.graphic.getCoordinate());
    // if (earthStore.analysisType == "marker" && tabIndex.value == 2) {
    //   // currentGraphic = e.graphic;
    //   earthStore.setAlertShow(true);
    //   earthStore.setDrawCoordinate(e.graphic.getCoordinate());
    // } else if (tabIndex.value == 0) {
    //   earthStore.setDrawCoordinate(e.graphic.getCoordinate());
    // }
    // proxy.$refs["projectFormRef"].pickupComplete(e.graphic.getCoordinate());
  });
  // getProjectInfo();
};

/**
 * 取消分析状态
 */
const onAnalysisCancel = () => {
  // graphicLayer && graphicLayer.clear();
  // mapInstance.onlyPickModelPosition = false;
  if (earthStore.analysisType == "data-compare") {
    layerGroup.removeAllLayer();
  }
  earthStore.cancelAnalysis();
  graphicLayer && measure.clear();
};

const onCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleSelect = (index, indexPath, item) => {
  tabIndex.value = index;
  tabName.value = ["项目信息", "数据列表", "影像分析", "场景管理"][index];
  panelVisible.value = true;
  if (index == 0) {
    projetGraphic.show = true;
    // getProjectInfo();
  } else {
    projetGraphic.show = false;
  }
};
const layerClickHandle = (layerId) => {
  const layer = layerGroup.getLayerById(layerId);
  layer && layer.flyTo();
};

const onDrawActive = (bool = true) => {
  mapInstance.onlyPickModelPosition = bool;
};

const onPickUpHandle = () => {
  projetGraphic.clear();
  projetGraphic.startDraw({
    type: "billboard",
    style: {
      image: "img/marker/mark-blue2.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: { text: projectInfo.value.projectName, pixelOffsetY: -50 },
    },
  });
};

/**
 * 多个图层加载
 * @param {*} layers
 */
const layersLoadHandle = (layers) => {
  if (layers.nodeId == 2011141) {
    // 清除上一次加载的图层
    layerGroup.removeAllLayer();
    const layer = layers;
    const tiles3dLayer = new mars3d.layer.TilesetLayer({
      id: layer.nodeId,
      name: layer.dataName,
      url: 'http://153.36.59.170:8091/3DTiles/hongran/Production_3.json',
      maximumScreenSpaceError: 2,
      cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
      maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
      dynamicScreenSpaceError: true,
      cullWithChildrenBounds: false,
      skipLevelOfDetail: true, //是Cesium在1.5x 引入的一个优化参数，这个参数在金字塔数据加载中，可以跳过一些级别，这样整体的效率会高一些，数据占用也会小一些。但是带来的异常是：1） 加载过程中闪烁，看起来像是透过去了，数据载入完成后正常。2，有些异常的面片，这个还是因为两级LOD之间数据差异较大，导致的。当这个参数设置false，两级之间的变化更平滑，不会跳跃穿透，但是清晰的数据需要更长，而且还有个致命问题，一旦某一个tile数据无法请求到或者失败，导致一直不清晰。所以我们建议：对于网络条件好，并且数据总量较小的情况下，可以设置false，提升数据显示质量。
      loadSiblings: true, // 如果为true则不会在已加载完模型后，自动从中心开始超清化模型
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: 10, //【重要】 值越小能够更快的剔除
      preferLeaves: true, //【重要】这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
      progressiveResolutionHeightFraction: 0.5, //【重要】 数值偏于0能够让初始加载变得模糊
      dynamicScreenSpaceError: true, // true时会在真正的全屏加载完之后才清晰化模型
      preloadWhenHidden: true, //tileset.show是false时，也去预加载数据
      allowDrillPick: false,
    });
    layerGroup.addLayer(tiles3dLayer);
    setTimeout(() => {
      const lastlayer = layerGroup.getLayerById(layers.nodeId);
      lastlayer && lastlayer.flyTo();
    }, 800);
    return;
  } else if (layers.nodeId == 2011131) {
    // 清除上一次加载的图层
    layerGroup.removeAllLayer();
    const layer = layers;
    const wmtsTileLayer = new mars3d.layer.WmtsLayer({
      id: layer.nodeId,
      name: layer.dataName,
      url: "http://153.36.59.170:8180/geoserver/gwc/service/wmts",
      layer: "demo:hongran",
      format: "image/png",
      crs: "EPSG:4326",
      alpha: 1,
      flyTo: true,
    });
    layerGroup.addLayer(wmtsTileLayer);
    return;
  } else if (layers.nodeId == 201141) {
    // 清除上一次加载的图层
    layerGroup.removeAllLayer();
    const imageLayer = new mars3d.layer.ImageLayer({
      name: "采剖工程平面图",
      url: cadImg,
      rectangle: {
        xmin: 111.370308,
        xmax: 111.405899,
        ymax: 39.907798,
        ymin: 39.888234,
      },
      opacity: 1,
      flyTo: true,
    });
    layerGroup.addLayer(imageLayer);
    return;
  } else if (layers.nodeId == 2011111) {
    // 清除上一次加载的图层
    layerGroup.removeAllLayer();
    const graphic = map3dUtil.mineAreaLayer.getGraphicById(88617);
    const imageLayer = new mars3d.layer.ImageLayer({
      name: "卫星图",
      url: hongranImg,
      rectangle: graphic.rectangle,
      opacity: 1,
      flyTo: true,
    });
    layerGroup.addLayer(imageLayer);
    return;
  }
  layerGroup.removeAllLayer();
  if (layers.length === 0) {
    return;
  }
  proxy.$modal.loading("正在加载...");

  // layers.forEach((layer) => {
  //   //
  //   if (layer.dataType === "vector" || layer.dataType === "cad") {
  //     if (!layer.link) return;
  //     const graphicLayer2 = new mars3d.layer.GeoJsonLayer({
  //       id: layer.nodeId,
  //       name: layer.dataName,
  //       url: layer.link,
  //       symbol: {
  //         styleOptions: {
  //           fill: true,
  //           opacity: 0.35,
  //           color: "#FED976",
  //           outline: true,
  //           outlineStyle: {
  //             color: "#FED976",
  //             width: 3,
  //             opacity: 1,
  //           },
  //           label: {
  //             // 面中心点，显示文字的配置
  //             text: layer.dataName, // 对应的属性名称
  //             opacity: 1,
  //             font_size: 40,
  //             color: "#ffffff",

  //             font_family: "楷体",
  //             outline: true,
  //             outlineColor: "#000000",
  //             outlineWidth: 3,

  //             background: false,
  //             backgroundColor: "#000000",
  //             backgroundOpacity: 0.1,

  //             font_weight: "normal",
  //             font_style: "normal",

  //             scaleByDistance: true,
  //             scaleByDistance_far: 20000000,
  //             scaleByDistance_farValue: 0.1,
  //             scaleByDistance_near: 1000,
  //             scaleByDistance_nearValue: 1,

  //             distanceDisplayCondition: false,
  //             distanceDisplayCondition_far: 10000,
  //             distanceDisplayCondition_near: 0,
  //             visibleDepth: false,
  //           },
  //         },
  //       },
  //       // flyTo: true,
  //     });
  //     layerGroup.addLayer(graphicLayer2);
  //   } else if (layer.dataType === "dem") {
  //     if (!layer.link) return;
  //     const terrainLayer = new mars3d.layer.TerrainLayer({
  //       // terrain: { url: layer.link },
  //       terrain: { url: "dem", requestVertexNormals: false },
  //       flyTo: true,
  //     });
  //     terrainLayer.addTo(mapInstance);
  //   } else if (layer.dataType === "dom") {
  //     // mars3d.Util.fetchJson({ url: layer.link }).then((option) => {
  //     //   // const center = toWsg84(option.projection, option.center);
  //     //   // 西南角
  //     //   const southwest = toWsg84(option.projection, option.bounds.slice(0, 2));
  //     //   // 东北角
  //     //   const northeast = toWsg84(option.projection, option.bounds.slice(2));
  //     //   const bbox = [...southwest, ...northeast];
  //     //   //toWsg84
  //     //   const tileLayer = new mars3d.layer.XyzLayer({
  //     //     id: layer.nodeId,
  //     //     url: layer.serUrl,
  //     //     minimumLevel: option.minzoom,
  //     //     maximumLevel: option.maxzoom,
  //     //     tms: true,
  //     //     bbox,
  //     //   });
  //     //   layerGroup.addLayer(tileLayer);
  //     // });
  //     const tileLayer = new mars3d.layer.WmsLayer({
  //       url: `${layer.link}`,
  //       layers: layer.serUrl,
  //       parameters: {
  //         transparent: true,
  //         format: "image/png",
  //       },
  //       flyTo: true,
  //     });
  //     layerGroup.addLayer(tileLayer);
  //   } else if (
  //     layer.dataType === "osgb" ||
  //     layer.dataType === "tiles3d" ||
  //     layer.dataType === "las"
  //   ) {
  //     const tiles3dLayer = new mars3d.layer.TilesetLayer({
  //       id: layer.nodeId,
  //       name: layer.dataName,
  //       url: layer.link,
  //       maximumScreenSpaceError: 2,
  //       cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
  //       maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
  //       dynamicScreenSpaceError: true,
  //       cullWithChildrenBounds: false,
  //       skipLevelOfDetail: true, //是Cesium在1.5x 引入的一个优化参数，这个参数在金字塔数据加载中，可以跳过一些级别，这样整体的效率会高一些，数据占用也会小一些。但是带来的异常是：1） 加载过程中闪烁，看起来像是透过去了，数据载入完成后正常。2，有些异常的面片，这个还是因为两级LOD之间数据差异较大，导致的。当这个参数设置false，两级之间的变化更平滑，不会跳跃穿透，但是清晰的数据需要更长，而且还有个致命问题，一旦某一个tile数据无法请求到或者失败，导致一直不清晰。所以我们建议：对于网络条件好，并且数据总量较小的情况下，可以设置false，提升数据显示质量。
  //       loadSiblings: true, // 如果为true则不会在已加载完模型后，自动从中心开始超清化模型
  //       cullRequestsWhileMoving: true,
  //       cullRequestsWhileMovingMultiplier: 10, //【重要】 值越小能够更快的剔除
  //       preferLeaves: true, //【重要】这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
  //       progressiveResolutionHeightFraction: 0.5, //【重要】 数值偏于0能够让初始加载变得模糊
  //       dynamicScreenSpaceError: true, // true时会在真正的全屏加载完之后才清晰化模型
  //       preloadWhenHidden: true, //tileset.show是false时，也去预加载数据
  //       allowDrillPick: false,
  //     });
  //     layerGroup.addLayer(tiles3dLayer);
  //   }
  // });

  proxy.$modal.closeLoading();
  // setTimeout(() => {
  //     const lastlayer = layerGroup.getLayerById(layerNodeId);
  //     lastlayer && lastlayer.flyTo();
  //   }, 800);
};

// const getProjectInfo = () => {
//   // if (!route.query?.id) {
//   //   console.log("项目不存在，即将跳转首页");
//   //   setTimeout(() => {
//   //     router.push("/");
//   //   }, 2000);
//   //   return;
//   // } else {
//   const params = {
//     id: route.query?.id,
//   };
//   // 模拟接口返回的假数据
//   const fakeData = {
//     longitude: 87.597714, // 经度
//     latitude: 43.837456, // 纬度
//     projectName: "中联润世",
//   };

//   // 设置项目信息为假数据
//   projectInfo.value = fakeData;

//   if (mapInstance) {
//     // 数据预览
//     const graphic = new mars3d.graphic.BillboardEntity({
//       position: new mars3d.LngLatPoint(fakeData.longitude, fakeData.latitude),
//       hasEdit: false,
//       style: {
//         image: "img/marker/mark-blue2.png",
//         scale: 1,
//         horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//         verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//         clampToGround: true,
//         label: {
//           text: fakeData.projectName,
//           pixelOffsetY: -50,
//           outline: true,
//           color: "#fff",
//           font_weight: "bold",
//           font_family: "楷体",
//           font_size: 24,
//         },
//       },
//     });
//     projetGraphic.clear();
//     projetGraphic.addGraphic(graphic);
//     graphic.flyTo({
//       heading: 359.2,
//       pitch: -40.5,
//       radius: 240000.9,
//     });

//     if (route.query?.dataId) {
//       setTimeout(() => {
//         tabIndex.value = "1";
//         tabName.value = "数据列表";
//         projetGraphic.show = false;
//       }, 500);
//     }
//   }
// };
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  // display: flex;
  // align-items: stretch;
  position: relative;
  overflow: hidden;

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 160px;
    min-height: 400px;
  }

  .project-menu {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    box-sizing: border-box;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    z-index: 1;
    background-color: #304156;

    // display: flex;
    // flex-direction: column;
    .sys-title {

      margin: 16px 0px;
      text-align: center;
      font-size: 18px;
      font-weight: 550;
      color: #fff;
    }

    .collapse-btn {
      color: #fff;
      position: absolute;
      bottom: 12px;
      width: 100%;
      text-align: center;
      font-size: 18px;

      .el-icon {
        cursor: pointer;
      }

      // background-color: #fff;
    }

    .menu-ref-panel {
      background-color: rgb(48, 65, 86, 1);
      border-left: 1px solid rgba(15, 94, 255, 0.85);
      position: absolute;
      width: 450px;
      top: 0px;
      right: -450px;
      height: 100%;
      box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
      display: flex;
      flex-direction: column;

      .header {
        box-sizing: border-box;
        color: #fff;
        display: flex;
        justify-content: space-between;
        height: 60px;
        align-items: center;
        padding: 0px 16px;
        background: linear-gradient(90deg,
            rgba(15, 94, 255, 0.3) 0%,
            rgba(15, 94, 255, 0) 100%);

        &-title {
          display: flex;
          align-items: baseline;

          .el-divider--vertical {
            margin: 0px 12px;
          }

          .tab-name {
            font-size: 18px;
          }

          .project-name {
            color: rgba($color: #fff, $alpha: 0.65);
            font-size: 16px;
          }
        }

        .close-btn {
          color: rgba($color: #fff, $alpha: 0.85);
          font-size: 22px;
        }

        .close-btn:hover {
          cursor: pointer;
          color: #fff;
        }
      }

      .panel-content {
        flex: 1;
        box-sizing: border-box;
        padding: 16px;
        overflow-y: none;
      }
    }
  }

  .map-alert {
    // background-color: rgb(48, 65, 86);
    background-color: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
    position: absolute;
    width: calc(100% - 568px);
    top: 1px;
    left: 566px;
    z-index: 10;
    box-sizing: border-box;
    padding: 10px 8px;
    border-radius: 4px;

    .tips {
      display: flex;
      align-items: center;
      font-size: 14px;

      .info {
        display: flex;
        align-items: center;

        .el-link {
          margin-left: 4px;
        }
      }

      .el-space {
        margin-left: 16px;
      }

      .el-link {
        margin: 0px 4px;
      }

      .el-icon {
        margin: 0px 16px;
      }

      .el-button {
        margin: 0px 4px;
      }

      .step {
        display: flex;
        align-items: center;

        .el-select {
          margin: 0px 4px;
        }

        .el-icon {
          margin: 0px;
        }
      }
    }
  }

  .earth-3d {
    background-color: #fff;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
  }

  // .map-3d {
  //   height: 100%;
  //   width: 100%;
  // }

  .el-menu {
    border-right: 0px;
  }
}
</style>
