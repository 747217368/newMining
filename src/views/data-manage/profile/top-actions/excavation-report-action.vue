<template>
  <div class="report">
    <el-steps
      :active="state.activeKey"
      finish-status="success"
      :space="200"
      align-center
      simple
    >
      <el-step title="两期数据对比" />
      <el-step title="土方分割" />
      <el-step title="路径分析" />
      <el-step title="收方报告" />
    </el-steps>
    <div class="step-content">
      <div class="content" v-if="state.activeKey == 0">
        <div class="form-item">
          <span class="label">当期数据</span>
          <div class="form-content">
            <el-cascader
              size="small"
              style="width: 200px"
              placeholder="请选择"
              v-model="state.dataOne"
              :options="treeOptions"
              :props="{ value: 'id' }"
              @change="onDataOneChange"
            />
          </div>
        </div>
        <div class="form-item">
          <span class="label">划定分析范围</span>
          <div class="form-content">
            <el-button
              size="small"
              type="primary"
              link
              :disabled="!state.rangeEnabled"
              @click="drawHandle"
              >绘制</el-button
            >
            或
            <el-popover
              placement="bottom-start"
              :width="200"
              trigger="hover"
              effect="dark"
            >
              <div>支持坐标系为WGS84的矢量格式：</div>
              <div>shapefile(*.shp)、DWG、GeoJSON、KML、KMZ</div>
              <template #reference>
                <el-upload
                  ref="uploadRef"
                  :http-request="httpRequest"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
                >
                  <template #trigger>
                    <el-button size="small" type="primary" link>
                      导入
                    </el-button>
                  </template>
                </el-upload>
              </template>
            </el-popover>
          </div>
        </div>
        <div class="form-item">
          <span class="label">对比数据</span>
          <div class="form-content">
            <el-cascader
              size="small"
              style="width: 200px"
              placeholder="请选择"
              v-model="state.dataTwo"
              :options="treeOptions"
              :props="{ value: 'id' }"
              @change="onDataTwoChange"
              :disabled="!state.selectEnabled"
            />
          </div>
        </div>
        <div class="form-item">
          <el-button type="primary" link @click="onStart" size="small">
            开始分析
          </el-button>
        </div>
      </div>
      <div class="content" v-if="state.activeKey == 1">
        <el-form
          ref="ruleFormRef"
          :inline="true"
          :model="state.cutForm"
          :rules="rules"
        >
          <el-form-item label="最低平盘高度" prop="minHeight" size="small">
            <el-input
              v-model="state.cutForm.minHeight"
              placeholder="请输入"
              style="width: 100px"
            >
              <template #suffix>米</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最高平盘高度" prop="maxHeight" size="small">
            <el-input
              v-model="state.cutForm.maxHeight"
              placeholder="请输入"
              style="width: 100px"
            >
              <template #suffix>米</template>
            </el-input>
          </el-form-item>

          <el-form-item label="平盘间隔" prop="gap" size="small">
            <el-input
              v-model="state.cutForm.gap"
              placeholder="请输入"
              style="width: 100px"
            >
              <template #suffix>米</template>
            </el-input>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="onCut"> 分割土方 </el-button>
            <el-button @click="onCancel"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="content" v-if="state.activeKey == 2">
        请在三维模型上绘制路径！路径长度：<strong>{{
          earthStore.measuredResult?.distanceStr || "0米"
        }}</strong
        >， 提升高度：<strong>{{
          earthStore.measuredResult?.dropStr || "0米"
        }}</strong>
        <!-- <el-button size="small" link> 清空结果 </el-button> -->
        &nbsp; &nbsp;
        <el-button type="primary" link @click="onReDraw"> 绘制 </el-button>
        <el-button type="primary" link @click="onImportPath"> 导入 </el-button>
      </div>

      <div class="content" v-if="state.activeKey == 3">
        收方报告已生成！ &nbsp;
        <el-link type="primary" @click="onPreview"> 点击预览 </el-link>
        <!-- &nbsp;或&nbsp; -->
        <!-- <el-link type="primary" link> 保存 </el-link> -->
      </div>

      <div class="step-btns">
        <el-button
          type="warning"
          size="small"
          @click="onPreStep"
          :disabled="state.activeKey === 0"
          plain
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          @click="onNextStep"
          :disabled="state.activeKey === 3"
          size="small"
          plain
        >
          下一步
        </el-button>
        <el-button type="danger" @click="onCancel" size="small">
          取消
        </el-button>
      </div>
    </div>
  </div>
  <report-dialog ref="ReportDialogRef"></report-dialog>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";
// import "shpjs";
import * as kgUtil from "kml-geojson";
// import { cad2json } from "@/api/slope/data-manage";
import ReportDialog from "./excavation-report-dialog.vue";
// import { onUnmounted } from "vue";

const emit = defineEmits(["cancel"]);
const earthStore = useEarthMapStore();
const { proxy } = getCurrentInstance();

// console.log("treeRef", earthStore.$treeRef);
const props = defineProps({
  measure: {
    type: Object,
    required: true,
  },
  layerGroup: {
    type: Object,
    required: true,
  },
  mapInstance: {
    type: Object,
    required: true,
  },
});

const state = reactive({
  dataType: undefined,
  dataList: [],
  dataOne: [],
  dataTwo: [],
  rangeEnabled: false,
  analysisEnabled: false,
  selectEnabled: false,
  activeKey: 0,
  cutForm: {},
});

const treeOptions = computed(() =>
  earthStore.catalogTree[0].children.filter((item) =>
    ["dem", "3dtiles", "cad"].includes(item.id),
  ),
);

const rules = {
  maxHeight: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^[1-9]\d*$/,
      message: "非法格式",
      trigger: "blur",
    },
  ],
  minHeight: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^[1-9]\d*$/,
      message: "非法格式",
      trigger: "blur",
    },
  ],
  gap: [
    { required: true, message: "请输入", trigger: "blur" },
    {
      pattern: /^[1-9]\d*$/,
      message: "非法格式",
      trigger: "blur",
    },
  ],
};

let polygon = [],
  measureVolume;

const onDataOneChange = (node) => {
  if (state.dataOne) {
    state.dataTwo = undefined;
    const layer = earthStore.catalogTree[0].children
      .find((item) => item.id == state.dataOne[0])
      .children.find((item) => item.id == state.dataOne[1]);
    props.layerGroup.removeAllLayer();
    loadLayer(layer);
    state.rangeEnabled = true;
    earthStore.$treeRef.setCheckedKeys([state.dataOne[1]]);
  }
};

const loadLayer = (option, show = true) => {
  const layer = props.layerGroup.getLayerById(option.id);
  console.log({ layer });
  if (layer) {
    layer.flyTo();
  } else {
    if (option.dataType === "osgb" || option.dataType === "tiles3d") {
      const tiles3dLayer = new mars3d.layer.TilesetLayer({
        id: option.nodeId,
        name: option.dataName,
        url: option.link,
        maximumScreenSpaceError: 1,
        cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
        maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
        dynamicScreenSpaceError: true,
        cullWithChildrenBounds: false,
        skipLevelOfDetail: true,
        preferLeaves: true,
        allowDrillPick: false,
        show,
      });
      props.layerGroup.addLayer(tiles3dLayer);
      // console.log("tiles3dLayer", tiles3dLayer.toJSON());
      tiles3dLayer.flyTo();
    }
  }
};

const onDataTwoChange = () => {
  if (state.dataTwo[1] && state.dataOne[1] === state.dataTwo[1]) {
    state.dataTwo = [];
    proxy.$modal.msgError("请选择不同的数据！");
    return;
  }

  if (state.dataTwo[1] && state.dataOne[1]) {
    state.analysisEnabled = true;
    const layer = state.dataList.filter((item) => item.id == state.dataTwo[1]);
    loadLayer(layer, false);
    state.rangeEnabled = true;
    earthStore.$treeRef.setCheckedKeys([state.dataOne[1], state.dataTwo[1]]);
  }
};

const onStart = async () => {
  // earthStore.setDrawerVisible(true);
  props.measure.clear();
  proxy.$modal.loading("正在计算....");
  // console.log("挖方参数", polygon);
  const params = {
    positions: mars3d.PointTrans.lonlats2cartesians(polygon),
    depth: false, // 使用离屏渲染深度图的方式
    // offsetHeight: 10, // 偏移高度来展示
    has3dtiles: true,
    exact: false,
    heightLabel: false,
    showArea: false,
    showFillVolume: false,
  };
  let result1 = await props.measure.volume(params);

  console.log("分析结果1", result1);

  // result1.show = false;
  // 隐藏图层1
  return;
  const layer = props.layerGroup.getLayerById(state.dataOne);
  layer.show = false;

  // 打开图层2
  setTimeout(() => {
    layer.show = true;
    props.measure.clear();
    setTimeout(async () => {
      // proxy.$modal.loading("正在计算对比数据的方量....");
      let result2 = await props.measure.volume(params);
      console.log("分析结果2", result1);
      proxy.$modal.closeLoading();
    }, 200);
  }, 200);

  // setTimeout(() => {
  //   result1.show = false;
  // }, 1000);

  // 隐藏当前图层-显示第二个图层，然后进行计算
  // let result2 = await props.measure.volume(params);
  // .then((e) => {
  //   measureVolume = e;
  // })
  // .finally(() => {
  //   proxy.$modal.closeLoading();
  // });
};
let graphicLayer;
onUnmounted(() => {
  props.mapInstance.removeLayer(graphicLayer, true);
});

onMounted(() => {
  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: false, // 绘制完成后是否自动激活编辑
    allowDrillPick: false,
    // flyTo: true,
  });

  if (props.mapInstance) {
    // debugger
    props.mapInstance.onlyPickModelPosition = true;
    props.mapInstance.addLayer(graphicLayer);
    graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
      console.log("绘制对象", e.graphic.coordinates);
      console.log("最大高度", e.graphic.getMaxHeight());

      polygon = e.graphic.coordinates;
      state.selectEnabled = true;
      // console.log("绘制结果JSON", JSON.stringify(e.toGeoJSON()));
      // console.log("绘制结果", e.getCoordinates());
    });
  }
});

onUnmounted(() => {
  // debugger
  props.mapInstance.onlyPickModelPosition = false;
});

const drawHandle = () => {
  graphicLayer.clear();
  props.measure.clear();
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffff00",
      outlineWidth: 2.0,
      clampToGround: true,
    },
  });
};

const onCancel = () => {
  earthStore.$treeRef.setCheckedKeys([]);
  emit("cancel");
};

const openFile = (file, fileType) => {
  const options = {
    style: {
      color: "#ffff00",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffff00",
      outlineWidth: 2.0,
      clampToGround: true,
    },
    simplify: true,
    clear: true,
    // flyTo: true,
  };
  // const layer = props.layerGroup.getLayerById(state.dataOne[1]);
  // console.log("layer1", layer);
  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onloadend = async function (e) {
      let geojson = this.result;
      graphicLayer.loadGeoJSON(geojson, options);
      // 贴地计算
      let graphics = await graphicLayer.autoSurfaceHeight({
        has3dtiles: true,
      });
      polygon = graphics[0].coordinates;
      props.mapInstance.flyToPositions(graphics[0].positions, {
        radius: 20,
      });
      state.selectEnabled = true;
    };
  } else if (fileType === "kml") {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onloadend = function (e) {
      const strkml = this.result;
      kgUtil
        .toGeoJSON(strkml)
        .then(async (geojson) => {
          graphicLayer.loadGeoJSON(geojson, options);
          // 贴地计算
          let graphics = await graphicLayer.autoSurfaceHeight({
            has3dtiles: true,
          });
          polygon = graphics[0].coordinates;
          props.mapInstance.flyToPositions(graphics[0].positions, {
            radius: 20,
          });
          state.selectEnabled = true;
        })
        .catch(() => {
          proxy.$modal.msgError("读取kml数据失败");
        });
    };
  } else if (fileType === "kmz") {
    // 加载input文件控件的二进制流
    kgUtil
      .toGeoJSON(file)
      .then(async (geojson) => {
        graphicLayer.loadGeoJSON(geojson, options);
        // 贴地计算
        let graphics = await graphicLayer.autoSurfaceHeight({
          has3dtiles: true,
        });
        polygon = graphics[0].coordinates;
        props.mapInstance.flyToPositions(graphics[0].positions, {
          radius: 20,
        });
        state.selectEnabled = true;
      })
      .catch(() => {
        proxy.$modal.msgError("读取kmz数据失败");
      });
  } else if (fileType === "shp") {
    // debugger;
    const url = URL.createObjectURL(file);
    shp(url)
      .then(async function (geojson) {
        //do something with your geojson
        graphicLayer.loadGeoJSON(geojson, options);
        // 贴地计算
        let graphics = await graphicLayer.autoSurfaceHeight({
          has3dtiles: true,
        });
        polygon = graphics[0].coordinates;
        props.mapInstance.flyToPositions(graphics[0].positions, {
          radius: 20,
        });
      })
      .catch(() => {
        proxy.$modal.msgError("读取shapefile数据失败");
      });
  } else if (fileType === "dwg") {
    const formdata = new FormData();
    formdata.append("file", file);
    // cad2json(formdata).then((res) => console.log(res));
  } else {
    proxy.$modal.msgError("暂不支持 " + fileType + " 文件类型的数据！");
  }
};

const onSelect = (file) => {
  // debugger
  // proxy.$refs["uploadRef"].handleStart();
};

const httpRequest = (file) => {
  // console.log("上传", file);
};
const beforeUpload = (file) => {
  props.mapInstance.onlyPickModelPosition = false;
  const fileName = file.name;
  const fileType = fileName
    ?.substring(fileName.lastIndexOf(".") + 1, fileName.length)
    .toLowerCase();
  if (["shp", "dwg", "kml", "kmz", "json", "geojson"].includes(fileType)) {
    openFile(file, fileType);
  } else {
    proxy.$modal.msgError("暂不支持 " + fileType + " 文件类型的数据！");
  }
};

const onNextStep = () => {
  state.activeKey++;
};

const onPreStep = () => {
  state.activeKey--;
};

const onCut = () => {
  proxy.$refs["ruleFormRef"].validate((valid, fields) => {
    if (valid) {
      console.log("submit!", state.cutForm);
      if (Number(state.cutForm.maxHeight) <= Number(state.cutForm.minHeight)) {
        proxy.$modal.msgError("平盘最高平盘高度需大于最小平盘高度！");
        return;
      }
      // state.activeKey++;
      setTimeout(() => {
        proxy.$modal.msgError("分割成功！");
      }, 3000);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const onDrawComplete = () => {
  if (!earthStore.measuredResult.distance) {
    proxy.$modal.msgSuccess("请先进行测量操作！");
    return;
  }
  earthStore.setDrawerVisible(true);
};

const onReDraw = () => {
  props.measure.clear();
  earthStore.setMeasuredResult({});
  props.measure.hasEdit = false;
  props.measure.distance({
    style: {},
    showAddText: true,
    // exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    allowDrillPick: false,
    maxPointNum: 3,
    // unit: 'm', //支持传入指定计量单位
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    //   clampToGround: true //是否贴地
    // }
    label: {
      font_size: 16,
      backgroundOpacity: 0,
    },
  });
};

const onImportPath = () => {};

const onPreview = () => {
  proxy.$refs["ReportDialogRef"].show();
};
</script>

<style lang="scss" scoped>
.report {
  .el-steps--simple {
    // background-color: transparent;
    // background-color: var(--el-color-warning);
    background-color: var(--el-color-warning-light-8);
  }
  .step-content {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
  }

  .content {
    display: flex;
    align-items: center;
    font-size: 14px;

    // .el-link {
    //   margin-left: 4px;
    // }
  }

  .form-item {
    display: flex;
    align-items: center;
    margin: 0px 12px 12px 12px;

    .label {
      margin-right: 8px;
      font-weight: 550;
      color: #606266;
      font-size: 12px;
    }

    .form-content {
      display: flex;
      align-items: center;
    }
    .el-select {
      margin: 0px 4px;
    }

    .el-icon {
      margin: 0px;
      //   font-size: 28px;
      font-weight: 550;
    }
  }
}
</style>
