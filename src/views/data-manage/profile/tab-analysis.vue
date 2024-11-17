<template>
  <div class="anlysis-panel">
    <div class="anlysis-tools">
      <!-- <div class="block-title">分析工具</div> -->
      <el-tabs type="border-card">
        <el-tab-pane label="测量工具">
          <div class="item-list">
            <div v-for="item in measureTabItems" :key="item.key" :class="{
              item: true,
              selected: earthStore.analysisType === item.key,
              disabled: !item.enabled,
            }" @click="onToolClick(item.key)">
              <span :class="`iconfont icon-${item.icon}`"></span>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="方量计算">
          <div class="item-list">
            <div v-for="item in quantityTabItems" :key="item.key" :class="{
              item: true,
              selected: earthStore.analysisType === item.key,
              disabled: !item.enabled,
            }" @click="onToolClick(item.key)">
              <span :class="`iconfont icon-${item.icon}`"></span>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="台阶线测量">
          <div class="item-list">
            <div v-for="item in stepLineTabItems" :key="item.key" :class="{
              item: true,
              selected: earthStore.analysisType === item.key,
              disabled: !item.enabled,
            }" @click="onToolClick(item.key)">
              <span :class="`iconfont icon-${item.icon}`"></span>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史记录">
          <div class="item-list"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="catalog">
      <div class="catalog-title">
        <div>数据目录</div>
        <div>
          <el-input v-model="dataName" placeholder="请输入关键字" class="query-input">
            <template #append>
              <el-button type="primary" @click="treeQuery" icon="Search" />
            </template>
          </el-input>
        </div>
      </div>
      <div class="layer-tree" v-loading="state.treeLoading">
        <el-tree ref="catalogRef" :data="treeData" node-key="id" :props="defaultProps" 
          @check="onCheck" @node-click="onNodeClick" :default-expanded-keys="[2011]"/>
      </div>
      <PdfViewer ref="PdfViewerRef" />
    </div>
    <!-- 右侧表单抽屉 -->
    <right-form-drawer @cancel="onDrawerCancel"></right-form-drawer>
    <coordinate-input-dialog ref="CoordinateInputDialogRef" @confirm="onInputConfirm"></coordinate-input-dialog>
    <el-dialog v-model="state.markTypeDialogVisible" title="选择标记方式" width="400px" align-center append-to-body>
      <div style="margin: -24px 0px">
        <p>坐标录入：手动录入坐标信息</p>
        <p>地图拾取：在地图中拾取坐标</p>
      </div>
      <template #footer>
        <el-button @click="onCancleRemark">取消</el-button>
        <el-button type="warning" @click="onInputMarkClick">坐标录入</el-button>
        <el-button type="primary" @click="onEarthMarkClick">地图拾取</el-button>
      </template>
    </el-dialog>
    <compare-data-selected ref="compareDataSelectedRef"></compare-data-selected>
  </div>
</template>

<script setup>
import * as mars3d from "mars3d";
import CoordinateInputDialog from "./coordinate-input-dialog.vue";
import RightFormDrawer from "./right-form-drawer.vue";
import useEarthMapStore from "@/store/modules/earthMap";
import { ElMessage, ElMessageBox } from "element-plus";
import CompareDataSelected from "./compare-data-selected.vue";
import PdfViewer from "@/components/PdfViewer/PdfViewer.vue";
const PdfViewerRef = ref(null);

const props = defineProps({
  mapInstance: {
    type: Object,
    required: true,
  },
  measure: {
    type: Object,
    required: true,
  },
  graphicLayer: {
    type: Object,
    required: true,
  },
  projectInfo: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { proxy } = getCurrentInstance();
const defaultProps = {
  children: "children",
  label: "label",
  disabled: "disabled",
};

const earthStore = useEarthMapStore();
//console.log({ earthStore });
const emits = defineEmits(["layersLoad", "layerClick", "active"]);
const state = reactive({
  markTypeDialogVisible: false,
  treeLoading: false,
});

const measureTabItems = [
  {
    name: "点位标记",
    key: "marker",
    icon: "marker",
    enabled: true,
  },
  {
    name: "距离测量",
    key: "distance",
    icon: "ceju",
    enabled: true,
  },
  {
    name: "面积测量",
    key: "area",
    icon: "cemian",
    enabled: true,
  },

  {
    name: "剖面测量",
    key: "bisect",
    icon: "poumian",
    enabled: true,
  },
  {
    name: "工作面参数",
    key: "face",
    icon: "canshu",
    enabled: true,
  },
  {
    name: "生成等高线",
    key: "contour",
    icon: "denggaoxian",
    enabled: true,
  },

  {
    name: "提取高程点",
    key: "altitude-point",
    icon: "gaochengdian",
    enabled: true,
  },
  {
    name: "生成TIN",
    key: "tin",
    icon: "shengcheng",
    enabled: false,
  },
];

const quantityTabItems = [
  {
    name: "指定高程平面体积",
    key: "altitude-area",
    icon: "tiji",
    enabled: false,
  },
  {
    name: "堆体体积",
    key: "pile-body",
    icon: "duiti",
    enabled: false,
  },
  {
    name: "收方报告",
    key: "excavation-report",
    icon: "baogao",
    enabled: true,
  },
  // {
  //   name: "两期数据对比",
  //   key: "data-compare",
  //   icon: "duibi",
  //   enabled: true,
  // },
  // {
  //   name: "运输路径分析",
  //   key: "path-analysis",
  //   icon: "lujingfenxi",
  //   enabled: true,
  // },
];

const stepLineTabItems = [
  {
    name: "绘制台阶线",
    key: "draw-step-line",
    icon: "huizhi",
    enabled: false,
  },
  {
    name: "提取台阶线",
    key: "extract-step-line",
    icon: "tiqu",
    enabled: false,
  },
];


onMounted(() => {
  earthStore.setTreeRef(proxy.$refs["catalogRef"]);
});

const onToolClick = (key) => {
  if (earthStore.analysisType) {
    earthStore.cancelAnalysis();
    props.measure.clear();
    return;
  } else {
    earthStore.setAnalysisType(key);
  }
  console.log("measure", props.measure);
  switch (key) {
    // 标记
    case "marker":
      state.markTypeDialogVisible = true;
      break;
    // 测距
    case "distance":
      props.measure.setOptions({ hasEdit: true });
      earthStore.setAlertShow(true);
      earthStore.setMeasuredType("distanceMeasure");
      props.measure.distance({
        showAddText: true,
      });
      break;
    // 测面
    case "area":
      props.measure.setOptions({ hasEdit: true });
      earthStore.setAlertShow(true);
      earthStore.setMeasuredType("areaMeasure");
      props.measure.area({
        // style: {
        //   color: '#00fff2',
        //   opacity: 0.4,
        //   outline: true,
        //   outlineColor: '#fafa5a',
        //   outlineWidth: 1,
        //   clampToGround: false //贴地
        // }
      });
      break;
    case "path-analysis":
      earthStore.setAlertShow(true);
      emits("active");
      props.measure.distanceSurface({
        showAddText: true,
        exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
        allowDrillPick: false,
        // unit: 'm', //支持传入指定计量单位
        // style: {
        //   color: '#ffff00',
        //   width: 3,
        //   clampToGround: true //是否贴地
        // }
        label: {
          font_size: 16,
        },
      });

      break;
    // 收方报告
    case "excavation-report":
      earthStore.setAlertShow(true);
      emits("active");
      break;
    // 剖面
    case "bisect":
      props.measure.section({
        // maxPointNum:2,
        splitNum: 300, // 插值次数
        exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
        allowDrillPick: false,
        has3dtiles: true,
      });
      earthStore.setAlertShow(true);
      break;
    // 工作面参数
    case "face":
      props.measure.setOptions({ hasEdit: false });
      props.measure.distance({
        showAddText: false,
        maxPointNum: 3,
        label: {
          opacity: 0,
          backgroundOpacity: 0,
        },
      });
      earthStore.setAlertShow(true);
      break;
    // 等高线
    case "contour":
      earthStore.setAlertShow(true);
      // emits("active");
      break;
    // 高程点
    case "altitude-point":
      break;
    // 生成TIN
    case "tin":
      break;
    // 两期数据对比
    case "data-compare":
      earthStore.setAlertShow(true);
      // earthStore.setMeasuredType("dataCompare");
      // 取消数据目录选中
      // proxy.$refs["catalogRef"].setCheckedKeys([]);
      // emits("layersLoad", []);
      break;
    case "marker":
      break;
    case "marker":
      break;
    case "marker":
      break;
    default:
      break;
  }
};

const dataName = ref("");
// 搜索tree
const treeQuery = () => {
};

// 项目树数据
const treeData = ref([
  {
    id: 1,
    label: "内蒙古",
    children: [
      {
        id: 22,
        label: "巴彦淖尔市",
        children: [
          {
            id: 201,
            label: "临河区",
            children: [
              {
                id: 2011,
                label: "宏燃煤矿",
                children: [
                  {
                    id: 20111,
                    label: "日常上报数据",
                    children: [
                      {
                        id: 20240301,
                        label: "2024.03.01",
                        children: [
                          {
                            id: 201111,
                            label: "卫星数据",
                            children: [
                              {
                                id: 2011111,
                                label: "卫星数据",
                              }
                            ],
                          },
                          {
                            id: 201113,
                            label: "无人机正摄",
                            children: [
                              {
                                id: 2011131,
                                label: "DOM.tif",
                              },
                            ],
                          },
                          {
                            id: 201114,
                            label: "三维模型",
                            children: [
                              {
                                id: 2011141,
                                label: "宏燃三维模型",
                              },
                            ],
                          },
                        ]
                      }
                    ],
                  },
                  {
                    id: 20112,
                    label: "日常监测报告数据",
                    children: [

                      {
                        id: 2011211,
                        label: "0230717151830.pdf",
                        isFileNode: true,
                        filePath: "/pdf/20230717151830.pdf"
                      },
                     
                      {
                        id: 201122,
                        label: "监测报告0307.pdf",
                        isFileNode: true,
                        filePath: "/pdf/监测报告0307.pdf"
                      },
                    ],
                  },
                  {
                    id: 20118,
                    label: "边坡稳定性分析报告",
                    children: [
                      {
                        id: 201181,
                        label: "宏然边坡稳定性评价报告2022.pdf",
                        isFileNode: true,
                        filePath: "/pdf/宏然边坡稳定性评价报告2022.pdf"
                      },
                      {
                        id: 201182,
                        label: "内蒙古宏然能源有限公司(力学实验).pdf",
                        isFileNode: true,
                        filePath: "/pdf/内蒙古宏然能源有限公司(力学实验).pdf"
                      },
                    ],
                  },
                  {
                    id: 20114,
                    label: "采剥平面图",
                    children: [
                      {
                        id: 201141,
                        label: "采剖工程平面图",
                      },
                    ],
                  },
                  {
                    id: 20115,
                    label: "初步设计",
                    children: [
                      {
                        id: 201151,
                        label: "9-11全盈煤矿初设说明书.pdf",
                        isFileNode: true,
                        filePath: "/pdf/9-11全盈煤矿初设说明书.pdf"
                      },
                    ],
                  },
                ]
              },
            ]
          },
        ],
      },
    ],
  }
]);  // 创建一个空数组来存储树形结构的数据


const onInputMarkClick = () => {
  state.markTypeDialogVisible = false;
  proxy.$refs["CoordinateInputDialogRef"].show();
};

const onEarthMarkClick = () => {
  state.markTypeDialogVisible = false;
  props.graphicLayer.startDraw({
    type: "billboard",
    style: {
      image: "img/marker/mark-blue.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
  });
};

const onCancleRemark = () => {
  earthStore.cancelAnalysis();
  state.markTypeDialogVisible = false;
};

const onInputConfirm = (coordinate) => {
  const graphic = new mars3d.graphic.BillboardEntity({
    position: [coordinate.longitude, coordinate.latitude],
    hasEdit: true,
    style: {
      image: "img/marker/mark-blue.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
    flyTo: true,
  });
  props.graphicLayer.addGraphic(graphic); // 还可以另外一种写法: graphic.addTo(graphicLayer)
  earthStore.setAlertShow(true);
  earthStore.setDrawCoordinate(graphic.getCoordinate());
};

const onDrawerCancel = () => {
  // props.measure.clear();
};

// 点击树节点触发的事件
const onNodeClick = (nodeData) => {
  console.log("nodeData", nodeData.id);
  if (nodeData.isFileNode) {
    // 获取文件路径
    const filePath = nodeData.filePath;
    // 获取文件标题
    const title = nodeData.label;
    // 调用PdfViewer组件的show方法来显示预览
    proxy.$refs['PdfViewerRef'].show(filePath, title)
  } else if (nodeData.id === 2011141) {
    const nodeInfo = {
      nodeId: 2011141,
      dataName: "三维模型",
    }
    emits("layersLoad", nodeInfo);
  } else if (nodeData.id === 2011131) {
    const nodeInfo = {
      nodeId: 2011131,
      dataName: "无人机正摄",
    }
    emits("layersLoad", nodeInfo);
  }else if (nodeData.id === 201141) {
    const nodeInfo = {
      nodeId: 201141,
      dataName: "采剖工程平面图",
    }
    emits("layersLoad", nodeInfo);
  }else if (nodeData.id === 2011111) {
    const nodeInfo = {
      nodeId: 2011111,
      dataName: "卫星图",
    }
    emits("layersLoad", nodeInfo);
  }
};

const onCheck = (data, { checkedKeys }) => {
  const layers = layerList.filter((item) => checkedKeys.includes(item.nodeId));
  emits("layersLoad", layers);
};
let layerList = [];
const loadCatalog = () => {
  const params = {
    projectId: props.projectInfo.id,
  };
};
loadCatalog();
// getDataTree()
</script>

<style lang="scss" scoped>
.anlysis-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: -16px -16px 0px -16px;

  .el-tabs--border-card {
    border-left: 0px;
    border-right: 0px;
  }

  .anlysis-tools {
    .item-list {
      min-height: 132px;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;

      .item {
        box-sizing: border-box;
        width: 25%;
        color: var(--el-text-color-regular);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;
        user-select: none;

        .iconfont {
          font-size: 28px;
        }

        .name {
          margin-top: 4px;
          font-size: 12px;
          text-align: center;
        }

        &.selected {
          color: var(--el-menu-active-color);
        }

        &.disabled {
          color: rgba($color: #c8c9cc, $alpha: 0.45);

          &:hover {
            cursor: not-allowed;
            color: rgba($color: #c8c9cc, $alpha: 0.45);
          }
        }
      }

      .item:hover {
        cursor: pointer;
        color: var(--el-menu-active-color);
      }

      .item:active {
        color: rgba($color: #409eff, $alpha: 0.65);
      }
    }
  }

  .catalog {
    box-sizing: border-box;
    flex: 1;
    // padding: 8px 16px;
    display: flex;
    flex-direction: column;

    .catalog-title {
      box-sizing: border-box;
      padding: 0px 16px;
      font-size: 14px;
      color: var(--el-text-color-regular);
      font-weight: 550;
      line-height: 0.4rem;
      background: linear-gradient(90deg,
          rgba(15, 94, 255, 0.3) 0%,
          rgba(15, 94, 255, 0) 100%);
      display: flex;
      justify-content: space-between;
    }

    .layer-tree {
      flex: 1;
      box-sizing: border-box;
      padding: 8px;
      overflow-y: auto !important;
    }

  }
}
</style>
