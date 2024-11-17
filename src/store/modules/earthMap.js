const useEarthMapStore = defineStore("earthMap", {
  state: () => ({
    // 是否在分析状态
    doAnalysis: false,
    // 分析工具类型
    analysisType: null,
    // 是否显示alert
    alertShow: false,
    // 绘制的对象坐标
    drawCoordinate: [],
    // 绘制的图层对象
    drawGraphicLayer: null,
    //右侧表单Drawer的visible
    drawerVisible: false,
    // 距离测量类型：1 空间距离，2贴地距离
    distanceType: 1,
    // 测量类型
    measureType: null,
    // 测量结果
    measuredResult: {},
    // 测量结果绘制对象
    measuredGraphic: {},
    // 数据目录
    catalogTree: [],
    // 数据目录ref,可操作tree
    $treeRef: null,
  }),
  actions: {
    setAnalysisState(bool) {
      this.doAnalysis = bool;
    },
    setAnalysisType(type) {
      this.analysisType = type;
    },
    setAlertShow(bool) {
      this.alertShow = bool;
    },

    setDrawCoordinate(obj) {
      this.drawCoordinate = obj;
    },
    setDrawGraphicLayer(layer) {
      this.drawGraphicLayer = layer;
    },
    setDrawerVisible(bool) {
      this.drawerVisible = bool;
    },
    setMeasuredType(type) {
      this.measureType = type;
    },
    setMeasuredResult(data) {
      this.measuredResult = data;
    },
    setMeasuredGraphic(graphic) {
      this.measuredGraphic = graphic;
    },
    cancelAnalysis() {
      this.doAnalysis = false;
      this.analysisType = null;
      this.alertShow = false;
      this.drawCoordinate = [];
      this.drawGraphicLayer.clear();
      this.drawerVisible = false;
      this.distanceType = 1;
      this.distanceResult = 0;
      this.measuredResult = {};
    },
    setCatalogTree(data) {
      this.catalogTree = data;
    },
    setTreeRef(ref) {
      this.$treeRef = ref;
    },
  },
});

export default useEarthMapStore;
