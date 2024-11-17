<template>
  <el-drawer
    :title="titleDict[earthStore.analysisType]"
    :model-value="earthStore.drawerVisible"
    direction="rtl"
    :size="widthDict[earthStore.analysisType]"
    append-to-body
    destroy-on-close
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <marker-form
      ref="FormRef"
      v-if="earthStore.analysisType === 'marker'"
    ></marker-form>
    <distance-form
      ref="FormRef"
      v-if="earthStore.analysisType === 'distance'"
    ></distance-form>
    <area-form
      ref="FormRef"
      v-else-if="earthStore.analysisType === 'area'"
    ></area-form>
    <bisect-form
      ref="FormRef"
      v-else-if="earthStore.analysisType === 'bisect'"
    ></bisect-form>
    <face-form
      ref="FormRef"
      v-else-if="earthStore.analysisType === 'face'"
    ></face-form>
    <template #footer>
      <el-space>
        <el-button @click="cancelClick" icon="CircleClose">取消</el-button>
        <el-button type="danger" @click="deleteClick" icon="Delete"
          >删除</el-button
        >
        <el-dropdown
          v-if="
            ['marker', 'distance', 'area', 'bisect'].includes(
              earthStore.analysisType,
            )
          "
        >
          <el-button type="info" icon="Download">
            导出
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-if="earthStore.analysisType !== 'bisect'">
                <el-dropdown-item @click="exporHandle('json')"
                  >GeoJSON</el-dropdown-item
                >
                <el-dropdown-item @click="exporHandle('kml')"
                  >KML</el-dropdown-item
                >
              </template>

              <el-dropdown-item @click="exporHandle('cad')"
                >CAD</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" @click="saveClick" icon="CircleCheck"
          >保存</el-button
        >
      </el-space>
    </template>
  </el-drawer>
</template>

<script setup>
import * as kgUtil from "kml-geojson";

const { proxy } = getCurrentInstance();
const visible = ref(true);
import useEarthMapStore from "@/store/modules/earthMap";
import MarkerForm from "./drawer-form/marker-form.vue";
import DistanceForm from "./drawer-form/distance-form.vue";
import AreaForm from "./drawer-form/area-form.vue";
// import PathAnalysisForm from "./drawer-form/path-analysis-form.vue";
import BisectForm from "./drawer-form/bisect-form.vue";
import FaceForm from "./drawer-form/face-form.vue";
import { dayjs } from "element-plus";

const earthStore = useEarthMapStore();
const emit = defineEmits(["cancel"]);

const titleDict = {
  marker: "点位标记",
  distance: "测量距离",
  area: "面积测量",
  "path-analysis": "运输路径分析",
  bisect: "剖面测量分析",
  face: "工作面参数测量",
};

const widthDict = {
  marker: 450,
  distance: 450,
  area: 450,
  bisect: 750,
  face: 550,
};

// const show = () => {
//   visible.value = true;
// };

const cancelClick = () => {
  // earthStore.cancelAnalysis();
  earthStore.setDrawerVisible(false);
  emit("cancel");
};
const saveClick = () => {
  proxy.$refs["FormRef"].validate((valid) => {
    console.log({ valid });
  });
};
const deleteClick = () => {};

const exporHandle = (type) => {
  const name = proxy.$refs["FormRef"].form.name;
  const filename = name || titleDict[earthStore.analysisType];
  const remark = proxy.$refs["FormRef"].form.remark || "无描述";
  switch (type) {
    case "json":
      const geojson = earthStore.measuredGraphic.toGeoJSON();
      // console.log({json})
      mars3d.Util.downloadFile(`${filename}.json`, JSON.stringify(geojson));
      break;
    case "kml":
      let geojsonObject = earthStore.measuredGraphic.toGeoJSON();
      if (geojsonObject == null) {
        return null;
      }
      geojsonObject = JSON.parse(JSON.stringify(geojsonObject));

      const kml = kgUtil.toKml(geojsonObject, {
        name: filename,
        documentName: `${filename}矢量数据`,
        documentDescription: `${remark} by 数字空间矿山研究院`,
        simplestyle: true,
      });

      mars3d.Util.downloadFile(`${filename}.kml`, kml);
      break;
    case "cad":
      proxy.$modal.msgWarning("未开放");
      break;
    default:
      break;
  }
};
</script>

<style lang="scss">
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}
</style>
