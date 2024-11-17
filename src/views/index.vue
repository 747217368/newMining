<template>
  <div class="container">
    <MarsMap :url="configUrl" @onload="mapOnload"></MarsMap>
    <div class="ui-container">
      <div class="top">
        <div class="info">
          <div class="time">{{ state.time }}</div>
          <el-divider direction="vertical" />
          <div>{{ state.date }}</div>
        </div>
        <!-- 宏燃煤矿 -->
        <div class="title">矿山生态修复大数据指挥舱</div>
        <div class="info right">
          <div
            style="
              display: flex;
              justify-content: flex-end;
              flex: 1;
              margin-right: 12px;
            "
          >
            <div
              class="home-btn"
              @click="setPageState(0)"
              v-if="pageState !== 0"
            >
              <el-icon><House /></el-icon>平台总览
            </div>
            <div class="home-btn" @click="toPage('/data-manage')">
              <el-icon><Operation /></el-icon>数据管理
            </div>
          </div>
          <div class="weather">
            <div>{{ state.weekName }}</div>
            <el-divider direction="vertical" />
            <div>4℃ 晴</div>
            <img src="@/assets/svg/partly_cloudy.svg" alt="logo" />
          </div>
        </div>
      </div>
      <div class="main">
        <div class="left">
          <template v-if="[0, 1, 2].includes(pageState)">
            <Deformation :mineId="mineId" v-if="pageState != 2"></Deformation>
            <UavDeformationStat :mineId="mineId"></UavDeformationStat>
            <MiningList
              @onClick="toggleSingle"
              v-if="pageState == 0"
            ></MiningList>
            <WarningStat
              style="margin-top: 12px"
              v-if="pageState == 2"
            ></WarningStat>
          </template>

          <!-- <template v-if="pageState === 2">
            <MineSurvey></MineSurvey>
            <WarningStat></WarningStat>
          </template> -->
          <template v-if="pageState === 3">
            <RadarImgList @on-click="onLoadRadarImg"></RadarImgList>
            <WarningStat style="margin-top: 12px"></WarningStat>
            <GnssChart></GnssChart>
          </template>
        </div>
        <div class="center">
          <div class="center-top">
            <div class="map-tools justify">
              <div>
                <div style="gap: 8px; display: flex">
                  <el-dropdown @command="handleCommand">
                    <el-button color="#1fc6ff" plain dark>
                      测量工具
                      <el-icon class="el-icon--right"><arrow-down /></el-icon
                    ></el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="clear"
                          >清除结果</el-dropdown-item
                        >

                        <el-dropdown-item divided command="kjjl"
                          >空间距离</el-dropdown-item
                        >
                        <el-dropdown-item command="spmj"
                          >水平面积</el-dropdown-item
                        >
                        <el-dropdown-item command="tdjl"
                          >贴地距离</el-dropdown-item
                        >
                        <el-dropdown-item command="tdmj"
                          >贴地面积</el-dropdown-item
                        >
                        <el-dropdown-item command="zbcl"
                          >坐标测量</el-dropdown-item
                        >
                        <template v-if="pageState === 3 || pageState === 2">
                          <el-dropdown-item command="gdc"
                            >高度差</el-dropdown-item
                          >
                          <el-dropdown-item command="sjcl">
                            三角测量
                          </el-dropdown-item>
                          <el-dropdown-item command="fwj">
                            方位角
                          </el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-dropdown v-if="pageState === 1">
                    <el-button color="#1fc6ff" plain dark>
                      卫星普查
                      <el-icon class="el-icon--right"> <arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="clear">
                          清除结果
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                          遥感数据导入及归档
                        </el-dropdown-item>
                        <el-dropdown-item> GEE时序分析工具 </el-dropdown-item>
                        <el-dropdown-item>形变渲染</el-dropdown-item>
                        <el-dropdown-item> 形变分区 </el-dropdown-item>
                        <el-dropdown-item> 疑似风险分级 </el-dropdown-item>
                        <el-dropdown-item> 疑似风险范围提取 </el-dropdown-item>
                        <el-dropdown-item> 普查报告生产 </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-dropdown
                    @command="handleSlopeCommand"
                    v-if="pageState === 2"
                  >
                    <el-button color="#1fc6ff" plain dark>
                      无人机详查
                      <el-icon class="el-icon--right"> <arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="clear">
                          清除结果
                        </el-dropdown-item>
                        <el-dropdown-item divided command="wrj">
                          无人机数据导入及归档
                        </el-dropdown-item>
                        <el-dropdown-item command="slope">
                          边坡初设信息管理
                        </el-dropdown-item>
                        <el-dropdown-item command="dbj">
                          端帮角测量
                        </el-dropdown-item>
                        <el-dropdown-item command="rd">
                          边坡蠕动变形提取
                        </el-dropdown-item>
                        <el-dropdown-item command="pdpd">
                          坡顶坡底线提取
                        </el-dropdown-item>
                        <el-dropdown-item command="ppkd">
                          平盘宽度和坡度提取
                        </el-dropdown-item>
                        <el-dropdown-item command="bplf">
                          边坡裂缝提取
                        </el-dropdown-item>
                        <el-dropdown-item command="report">
                          详查报告生产
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                  <el-dropdown v-if="pageState === 3">
                    <el-button color="#1fc6ff" plain dark>
                      物联网监测
                      <el-icon class="el-icon--right"> <arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item> 设备位置显示 </el-dropdown-item>
                        <el-dropdown-item> 在线设备管理 </el-dropdown-item>
                        <el-dropdown-item> 设备远程控制 </el-dropdown-item>
                        <el-dropdown-item> 设备数据调用 </el-dropdown-item>
                        <el-dropdown-item> 数据三维叠加 </el-dropdown-item>
                        <el-dropdown-item> 预警信息管理 </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                  <el-dropdown>
                    <el-button color="#1fc6ff" plain dark>
                      数据管理系统
                      <el-icon class="el-icon--right"> <arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item> 本底调查数据 </el-dropdown-item>
                        <el-dropdown-item> 设计规划数据 </el-dropdown-item>
                        <el-dropdown-item> 矿区卫星数据 </el-dropdown-item>
                        <el-dropdown-item> 矿区无人机数据 </el-dropdown-item>
                        <el-dropdown-item> 物联网监测数据 </el-dropdown-item>
                        <el-dropdown-item> 监测报告数据 </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <RadarControler
                  style="margin-top: 12px; width: 160px"
                  v-if="pageState === 3"
                  :deviceId="deviceId"
                ></RadarControler>
              </div>
              <el-checkbox
                v-if="pageState === 2"
                v-model="hotmapLayerVisible"
                @change="onhotmapLayerVisible"
              >
                卫星形变图
              </el-checkbox>
              <SlopeLineLegend
                v-if="legendVisible"
                @close="onLegendClose"
              ></SlopeLineLegend>
              <ColorBar
                @close="onRadarImgClose"
                v-show="colorBarVisible"
                :type="colorBarType"
              ></ColorBar>
            </div>
          </div>
          <div class="center-bottom">
            <div class="action-btns" v-if="pageState !== 0">
              <div
                :class="{ selected: pageState === 1 }"
                @click="setPageState(1)"
              >
                卫星普查
              </div>
              <div
                :class="{ selected: pageState === 2 }"
                @click="setPageState(2)"
              >
                无人机详查
              </div>
              <div
                :class="{ selected: pageState === 3 }"
                @click="setPageState(3)"
              >
                物联网监测
              </div>
            </div>
          </div>
          <HotmapLegend
            v-if="pageState === 1 || hotmapLayerVisible"
          ></HotmapLegend>
        </div>
        <div class="right">
          <template v-if="[0, 1, 2].includes(pageState)">
            <OverViewStat :mineId="mineId"></OverViewStat>
            <VideoMonitor :mineId="mineId"></VideoMonitor>
            <RiskWarning :mineId="mineId"></RiskWarning>
          </template>

          <template v-if="pageState === 3">
            <SpeedChart
              :monitoringid="monitoringid"
              :monitoringName="monitoringName"
            ></SpeedChart>
            <DisplacementChart
              :monitoringid="monitoringid"
              :monitoringName="monitoringName"
            ></DisplacementChart>
            <AccelerationChart
              :monitoringid="monitoringid"
              :monitoringName="monitoringName"
            ></AccelerationChart>
          </template>
        </div>
      </div>
    </div>
    <ReportProductionForm ref="reportProductionFormRef"></ReportProductionForm>
  </div>
</template>

<script setup>
import { dayjs, ElMessage, ElLoading, ElMessageBox } from "element-plus";
import {
  getMonitoringPoint,
  getRadarDeviceInfo,
  getMonitoringPolygon,
} from "@/api/slope";
import MarsMap from "@/components/MarsMap.vue";
import RadarImgList from "./modules/RadarImgList.vue";
import MineRiskProportion from "./modules/MineRiskProportion.vue";
import OverViewStat from "./modules/OverViewStat.vue";
import VideoMonitor from "./modules/VideoMonitor.vue";
import RiskWarning from "./modules/RiskWarning.vue";
import Deformation from "./modules/Deformation.vue";
import MineSurvey from "./modules/MineSurvey.vue";
import WarningStat from "./modules/WarningStat.vue";
import ColorBar from "./modules/ColorBar.vue";
import SpeedChart from "./modules/SpeedChart.vue";
import DisplacementChart from "./modules/DisplacementChart.vue";
import AccelerationChart from "./modules/AccelerationChart.vue";
import RadarControler from "./modules/RadarControler.vue";
import ReportProductionForm from "./modules/ReportProductionForm.vue";
import SlopeLineLegend from "./modules/SlopeLineLegend.vue";
import UavDeformationStat from "./modules/UavDeformationStat.vue";
import MiningList from "./modules/MiningList.vue";
import GnssChart from "./modules/GnssChart.vue";
import HotmapLegend from "./modules/HotmapLegend.vue";

import useUserStore from "@/store/modules/user";
import slopeLine from "@/assets/data/hongranSlopeLine.json";
import { ArrowDown, House, Operation, Discount } from "@element-plus/icons-vue";
import { getRadarTilesImages } from "@/utils/radarUtil";
import hongranImg from "@/assets/data/hongranmk.png";
import slopePolygonData from "@/assets/data/warning-slope-polygon.json";
import mapUtil from "./modules/map";
import { getToken } from "@/utils/auth";
import { useRouter } from "vue-router";

const configUrl = "config/config.json";
const router = useRouter();
const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const deviceId = ref(null);
const colorBarVisible = ref(false);
const colorBarType = ref(0);
const monitoringid = ref(null);
const monitoringName = ref("");
const reportProductionFormRef = ref(null);
const legendVisible = ref(false);
const mineId = ref(null);
const hotmapLayerVisible = ref(false);

//  0 总览，1 单个煤矿， 2 无人机详查，3 物联网监测
const pageState = ref(0);

let mapInstance, mineAreaData, map3dUtil;
const mapOnload = async (map) => {
  mapInstance = map;
  // 实例化地图操作类
  map3dUtil = new mapUtil(mapInstance);
  if (getToken()) {
    // 监测点等
    loadPoints();
    loadRadar();
  }

  loadGraphic();
  // proxy.$modal.msgSuccess("加载完成！");
};
// 不同页面状态监听
watch(
  () => pageState.value,
  (newVal) => {
    const {
      warnSlopePolygonLayer,
      graphicLayer,
      slopeLayer,
      satelliteGraphicLayer,
      imageLayer,
      currentTilesetLayer,
      mineAreaLayer,
      mineAreaData,
    } = map3dUtil;

    warnSlopePolygonLayer.show = false;
    graphicLayer.show = false;
    slopeLayer.show = false;
    satelliteGraphicLayer.show = false;
    imageLayer.show = false;
    colorBarVisible.value = false;
    hotmapLayerVisible.value = false;
    mapInstance.viewer.entities.removeAll();
    map3dUtil.hotmapDestroy();
    // tilesetLayer.show = true;
    switch (newVal) {
      case 0:
        imageLayer.show = true;
        // tilesetLayer.show = false;
        // graphicLayer.show = false;
        onLegendClose();

        mineAreaLayer.show = true;
        imageLayer.flyTo();
        map3dUtil.showMineLayerGraphic();
        mapInstance.viewer.entities.removeAll();
        if (currentTilesetLayer) {
          currentTilesetLayer.show = false;
        }
        break;
      case 1:
        // heatLayer.show = true;
        if (currentTilesetLayer) {
          currentTilesetLayer.show = false;
        }
        map3dUtil.showMineLayerGraphic(mineId.value);
        // 加载形变渲染图
        map3dUtil.loadMineHotmapLayer();

        const graphic = mineAreaLayer.getGraphicById(mineId.value);
        graphic.flyTo({ radius: 2000 });
        mapInstance.viewer.entities.removeAll();
        break;
      case 2:
        // tilesetLayer.show = true;
        warnSlopePolygonLayer.show = true;
        onLegendClose();
        if (currentTilesetLayer) {
          currentTilesetLayer.show = true;
          currentTilesetLayer.flyTo();
        } else {
          // 加载三维模型
          const mine = mineAreaData.features.find(
            (item) => item.properties.id == mineId.value,
          )?.properties;
          if (mine.layer) {
            map3dUtil.loadMineTilesetLayer(mine.layer);
          } else {
            ElMessageBox.alert("缺少模型数据，无法进入露天矿监测", "系统提示");
          }
        }
        break;
      case 3:
        graphicLayer.show = true;
        slopeLayer.show = false;
        onLegendClose();
        break;
      default:
        break;
    }
  },
);
onMounted(() => {});
const projectId = computed(() => userStore.projects[0]);
const loadPoints = () => {
  getMonitoringPoint(projectId.value).then((res) => {
    const { data, code } = res;
    if (code === 0) {
      monitoringid.value = data[0].id;
      monitoringName.value = data[0].title;
      map3dUtil.loadMonitorPoints(data, (e) => {
        monitoringid.value = e.target.options.attr.id;
        monitoringName.value = e.target.options.attr.title;
      });
    }
  });
};

const onLoadRadarImg = (data) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在加载雷达图片，请稍后...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  getRadarTilesImages(data)
    .then((res) => {
      map3dUtil.loadRadarImageTileset(res);
      ElMessage.success("雷达图片加载成功！");
    })
    .finally(() => {
      loadingInstance.close();
      colorBarType.value = data.type === "01" ? 1 : 0;
      colorBarVisible.value = true;
    });
};

const loadRadar = () => {
  getRadarDeviceInfo(projectId.value).then((res) => {
    const { data, code } = res;
    if (code === 0) {
      const er = data.find((item) => item.type === "ER");
      deviceId.value = er.id;
      map3dUtil.loadRadar(er);
    }
  });
};

const onRadarImgClose = () => {
  mapInstance.viewer.entities.removeAll();
  colorBarVisible.value = false;
};

const onhotmapLayerVisible = (bol) => {
  // heatLayer.show = bol;
  hotmapLayerVisible.value = bol;

  if (bol) {
    map3dUtil.loadMineHotmapLayer();
  } else {
    map3dUtil.hotmapDestroy();
  }
};

const toPage = (path) => {
  const url = router.resolve({
    path,
  });
  // 打开新窗口
  window.open(url.href);
};

const onOnlyPickModelChange = (bol) => {
  // 是否只拾取模型上的点
  mapInstance.onlyPickModelPosition = bol;
};

const setPageState = (value) => {
  if (value == 0) mineId.value = null;
  pageState.value = value;
};

const onLegendClose = () => {
  legendVisible.value = false;
  map3dUtil.slopeLayer.show = false;
};

const handleSlopeCommand = (command) => {
  const { slopeLayer } = map3dUtil;
  switch (command) {
    case "clear":
      slopeLayer.show = false;
      break;
    case "pdpd":
      // 模拟生成时间
      slopeLayer.show = true;
      const loadingInstance = ElLoading.service({
        lock: true,
        text: "正在提取，请稍后...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        ElMessage.success("提取成功！");
        loadingInstance.close();
        slopeLayer.flyTo();
        legendVisible.value = true;
      }, 1000);

      break;
    case "report":
      reportProductionFormRef.value.show();
      break;
    default:
      break;
  }
};

const handleCommand = (command) => {
  map3dUtil.measureHandle(command);
};

const toggleSingle = (id) => {
  if (id === 88617) {
    mineId.value = id;
    setPageState(1);
  } else {
    ElMessageBox.alert("请点击“宏燃煤矿”！", "提示");
  }
};

const loadGraphic = () => {
  const camera = [
    [111.394744, 39.892748, 1094.1],
    [111.390234, 39.897355, 1124.7],
    [111.403978, 39.898481, 1051.7],
    [111.379614, 39.895246, 1215],
  ];
  camera.forEach((position) => {
    map3dUtil.addSensorGraphic(1, position, "camera.svg");
  });

  const rainfall = [[111.378442, 39.899019, 1224.2]];

  rainfall.forEach((position) => {
    map3dUtil.addSensorGraphic(2, position, "yuliangzhan.png");
  });

  const gnss = [
    [111.3888, 39.895135, 1166.7],
    [111.399828, 39.90145, 1121.5],
    [111.396234, 39.900779, 1100.1],
  ];

  gnss.forEach((position) => {
    map3dUtil.addSensorGraphic(3, position, "gnss.png");
  });
};

const weekArr = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const state = reactive({
  time: "",
  date: "",
  weekName: "",
});
const getCurrentTime = () => {
  state.date = dayjs().format("YYYY-MM-DD");
  state.time = dayjs().format("HH:mm:ss");
  state.weekName = weekArr[dayjs().day()];
};
getCurrentTime();
setInterval(() => {
  getCurrentTime();
}, 1000);
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
