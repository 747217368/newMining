<template>
  <div class="tips">
    <div class="step">
      <span class="label">选择数据</span>
      <el-select
        placeholder="选择数据类型"
        size="small"
        style="width: 120px"
        v-model="state.dataType"
        @change="onDataTypeChange"
      >
        <el-option label="高程模型" value="dem" />
        <el-option label="三维模型" value="3dtiles" />
        <el-option label="CAD" value="cad" />
      </el-select>

      <el-select
        placeholder="当期数据"
        size="small"
        style="width: 120px"
        v-model="state.dataOne"
        @change="onDataOneChange"
      >
        <el-option
          v-for="item in state.dataList"
          :key="item.id"
          :label="item.dataName"
          :value="item.id"
        />
      </el-select>
    </div>
    <el-icon :size="20"><Right /></el-icon>
    <div class="step">
      划定分析范围
      <el-button
        type="primary"
        link
        :disabled="!state.step2Enabled"
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
        <div>
          shapefile(*.shp)、DWG、GeoJSON、KML、KMZ 
        </div>
        <template #reference>
          <el-upload
            ref="uploadRef"
            :http-request="httpRequest"
            :before-upload="beforeUpload"
            :show-file-list="false"
          >
            <template #trigger>
              <el-button size="small" type="primary" link> 导入 </el-button>
            </template>
          </el-upload>
        </template>
      </el-popover>
    </div>
    <el-icon :size="20"><Right /></el-icon>
    <div class="step">
      <span class="label">选择</span>
      <el-select
        placeholder="对比数据"
        size="small"
        style="width: 120px"
        v-model="state.dataTwo"
        @change="onDataTwoChange"
        :disabled="!state.selectEnabled"
      >
        <el-option
          v-for="item in state.dataList"
          :key="item.id"
          :label="item.dataName"
          :value="item.id"
        />
      </el-select>
      <el-button
        size="small"
        type="primary"
        link
        :disabled="!state.analysisEnabled"
        @click="onStart"
      >
        开始分析
      </el-button>
      <el-button size="small" link @click="onCancel"> 取消 </el-button>
    </div>
  </div>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";
// import "shpjs";
import * as kgUtil from "kml-geojson";

const emit = defineEmits(["cancel", "active"]);
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
  dataOne: undefined,
  dataTwo: undefined,
  step2Enabled: false,
  analysisEnabled: false,
  selectEnabled: false,
});
let polygon = [],
  measureVolume;

const onDataTypeChange = () => {
  state.dataOne = undefined;
  state.dataTwo = undefined;
  if (state.dataType) {
    state.dataList = earthStore.catalogTree[0].children.find(
      (item) => item.id == state.dataType,
    ).children;
  } else {
    state.dataList = [];
  }
};

const onDataOneChange = () => {
  if (state.dataOne) {
    state.dataTwo = undefined;
    // proxy.$modal.msgError("请选择不同的数据！");
    const layer = state.dataList.find((item) => item.id == state.dataOne);
    props.layerGroup.removeAllLayer();
    loadLayer(layer);
    state.step2Enabled = true;
    earthStore.$treeRef.setCheckedKeys([state.dataOne]);
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
        show,
      });
      props.layerGroup.addLayer(tiles3dLayer);
      tiles3dLayer.flyTo();
    }
  }
};

const onDataTwoChange = () => {
  if (state.dataTwo && state.dataOne === state.dataTwo) {
    state.dataTwo = undefined;
    proxy.$modal.msgError("请选择不同的数据！");
  }

  if (state.dataTwo && state.dataOne) {
    state.analysisEnabled = true;
    const layer = state.dataList.filter((item) => item.id == state.dataTwo);
    loadLayer(layer, false);
    state.step2Enabled = true;
    earthStore.$treeRef.setCheckedKeys([state.dataOne, state.dataTwo]);
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
  emit("active");
  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: false,
    isAutoEditing: false, // 绘制完成后是否自动激活编辑
    allowDrillPick: false,
  });

  props.mapInstance.addLayer(graphicLayer);
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    console.log("绘制对象", e.graphic.coordinates);
    console.log("最大高度", e.graphic.getMaxHeight());

    polygon = e.graphic.coordinates;
    state.selectEnabled = true;
    // console.log("绘制结果JSON", JSON.stringify(e.toGeoJSON()));
    // console.log("绘制结果", e.getCoordinates());
  });
});

const drawHandle = () => {
  graphicLayer.clear();

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
    clear: true,
    flyTo: true,
  };
  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onloadend = function (e) {
      let geojson = this.result;
      geojson = simplifyGeoJSON(geojson); // 简化geojson的点
      graphicLayer.loadGeoJSON(geojson, options);
    };
  } else if (fileType === "kml") {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onloadend = function (e) {
      const strkml = this.result;
      kgUtil
        .toGeoJSON(strkml)
        .then((geojson) => {
          geojson = simplifyGeoJSON(geojson); // 简化geojson的点
          console.log("kml2geojson", geojson);

          graphicLayer.loadGeoJSON(geojson, options);
        })
        .catch(() => {
          proxy.$modal.msgError("读取kml数据失败");
        });
    };
  } else if (fileType === "kmz") {
    // 加载input文件控件的二进制流
    kgUtil
      .toGeoJSON(file)
      .then((geojson) => {
        geojson = simplifyGeoJSON(geojson); // 简化geojson的点
        console.log("kmz2geojson", geojson);

        graphicLayer.loadGeoJSON(geojson, options);
      })
      .catch(() => {
        proxy.$modal.msgError("读取kmz数据失败");
      });
  } else if (fileType === "shp" || fileType === "zip") {
    // debugger;
    const url = URL.createObjectURL(file);
    shp(url)
      .then(function (geojson) {
        //do something with your geojson
        geojson = simplifyGeoJSON(geojson); // 简化geojson的点
        graphicLayer.loadGeoJSON(geojson, options);
        // console.log("shp2geojson", geojson);
      })
      .catch(() => {
        proxy.$modal.msgError("读取shapefile数据失败");
      });
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
  const fileName = file.name;
  const fileType = fileName
    ?.substring(fileName.lastIndexOf(".") + 1, fileName.length)
    .toLowerCase();
  if (["shp", "dwg", "kml", "kmz", "json", "geojson"]) {
    openFile(file, fileType);
  } else {
    proxy.$modal.msgError("暂不支持 " + fileType + " 文件类型的数据！");
  }
};

const simplifyGeoJSON = (geojson) => {
  try {
    geojson = turf.simplify(geojson, {
      tolerance: 0.000001,
      highQuality: true,
      mutate: true,
    });
  } catch (e) {
    //
  }
  return geojson;
};
</script>

<style lang="scss" scoped>
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

    .label {
      margin-right: 8px;
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
