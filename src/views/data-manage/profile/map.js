import * as mars3d from "mars3d";
import * as Cesium from "mars3d-cesium";
import "mars3d-space";
import slopePolygonData from "@/assets/data/warning-slope-polygon.json";
import slopeLine from "@/assets/data/hongranSlopeLine.json";
import zge from "@/assets/data/zge.json";
import { dayjs, ElMessage, ElLoading, ElMessageBox } from "element-plus";

class mapUtil {
  mapInstance;
  graphicLayer;
  measure;
  imageLayer;
  graphicLayer;
  mineAreaLayer;
  warnSlopePolygonLayer;
  slopeLayer;
  satelliteGraphicLayer;
  mkImglayer;
  currentTilesetLayer;
  mineAreaData;
  zgeLayer;
  constructor(map) {
    if (map) this.mapInstance = map;
    else throw new Error("constructor参数不能为空！");
    this.graphicLayer = new mars3d.layer.GraphicLayer({ show: false });
    this.mapInstance.addLayer(this.graphicLayer);

    // 准格尔旗形变图片
    this.imageLayer = new mars3d.layer.ImageLayer({
      name: "准格尔旗",
      // url: "http://153.36.59.170:8090/Dinsar_reflat_disp_Clip3212.png",
      rectangle: {
        xmin: 110.10985671,
        xmax: 111.45646951,
        ymax: 40.31822054,
        ymin: 39.26492934,
      },
      opacity: 0.75,
      zIndex: 5,
      show: true,
      center: {
        lat: 38.701833,
        lng: 110.870254,
        alt: 116130.5,
        heading: 0,
        pitch: -46.2,
      },
    });
    this.mapInstance.addLayer(this.imageLayer);

    // 卫星
    this.satelliteGraphicLayer = new mars3d.layer.GraphicLayer();
    this.mapInstance.addLayer(this.satelliteGraphicLayer);

    // 矿区图片
    mars3d.Util.fetchJson({ url: "config/miningArea.json" }).then((data) => {
      this.mineAreaData = data;
      this.mineAreaLayer = new mars3d.layer.GeoJsonLayer({
        data,
        // chinaCRS: "GCJ02",
        name: "准格尔旗煤矿分布",
        symbol: {
          styleOptions: {
            fill: true,
            opacity: 0.15,
            outline: true,
            color: "#fff",
            clampToGround: true,
            outlineStyle: {
              color: "#fff",
              width: 2,
              opacity: 1,
            },
            label: {
              scaleByDistance: true,
              font_weight: "650",
              color: "#fff",
              // font_size: "24px",
              clampToGround: true,
              visibleDepth: false,
            },
          },

          callback(attr, styleOpt) {
            styleOpt.id = attr.id;
            styleOpt.label.text = attr.name || "";
            return styleOpt;
          },
        },
      });
      this.mapInstance.addLayer(this.mineAreaLayer);
    });

    // 无人机详查问题分布
    this.warnSlopePolygonLayer = new mars3d.layer.GeoJsonLayer({
      data: slopePolygonData,
      name: "边坡问题分布",
      show: false,
      symbol: {
        styleOptions: {
          fill: true,
          opacity: 0.35,
          outline: true,
          clampToGround: true,
          outlineWidth: 3,
          label: {
            scaleByDistance: true,
            color: "#fff",
            font_size: "18px",
            clampToGround: true,
          },
        },
        callback(attr, styleOpt) {
          // console.log({ attr });
          styleOpt.color = attr.style.color;
          styleOpt.outlineColor = attr.style.color;
          styleOpt.label.text = attr.text || "";
          return styleOpt;
        },
      },
    });

    this.mapInstance.addLayer(this.warnSlopePolygonLayer);

    // 边坡线 图层
    this.slopeLayer = new mars3d.layer.GeoJsonLayer({
      data: slopeLine,
      // chinaCRS: "GCJ02",
      name: "边坡线",
      show: false,
      symbol: {
        type: "polyline",
        styleOptions: {
          color: "red",
          width: 1.5,
          opacity: 1,
          clampToGround: true,
          label: {
            scaleByDistance: true,
            color: "#fff",
            font_size: "28px",
            clampToGround: true,
          },
        },
        callback(attr, styleOpt) {
          // console.log({ attr, styleOpt });
          styleOpt.color = attr.color;
          return styleOpt;
        },
      },
    });
    this.mapInstance.addLayer(this.slopeLayer);
    // 准格尔旗 图层
    this.zgeLayer = new mars3d.layer.GeoJsonLayer({
      data: zge,
      // chinaCRS: "GCJ02",
      name: "准格尔旗",
      show: true,
      symbol: {
        type: "polyline",
        styleOptions: {
          color: "red",
          width: 1.5,
          opacity: 1,
          clampToGround: true,
        },
        callback(attr, styleOpt) {
          styleOpt.color = attr.color;
          return styleOpt;
        },
      },
    });
    this.mapInstance.addLayer(this.zgeLayer);

    // 单个煤矿图片
    this.mkImglayer = new mars3d.layer.ImageLayer({ show: false });
    this.mapInstance.addLayer(this.mkImglayer);

    // 地图测量
    this.measure = new mars3d.thing.Measure({
      id: "measure",
      label: {
        color: "#ffffff",
        font_family: "楷体",
        font_size: 20,
        background: false,
      },
    });
    this.mapInstance.addThing(this.measure);

    this.imageLayer.readyPromise.then((layer) => {
      layer.flyTo();
      this.satelliteGraphicLayer.show = false;
    });

    // this.loadSatellite();
  }

  /**
   * 测量
   * @param {*} command
   */
  measureHandle(command) {
    switch (command) {
      case "clear":
        this.measure.clear();
        break;
      case "kjjl":
        this.measure.distance({
          showAddText: true,
        });
        break;
      case "tdjl":
        this.measure.distanceSurface({
          showAddText: true,
          exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
          // unit: 'm', //支持传入指定计量单位
          // style: {
          //   color: '#ffff00',
          //   width: 3,
          //   clampToGround: true //是否贴地
          // }
        });
        break;
      case "spmj":
        this.measure.area({
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
      case "tdmj":
        this.measure.areaSurface({
          style: {
            color: "#ffff00",
          },
          splitNum: 10, // step插值分割的个数
          exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
        });
        break;
      case "gdc":
        this.measure.height();
        break;
      case "sjcl":
        this.measure.heightTriangle();
        break;
      case "fwj":
        this.measure.angle();
        break;
      case "zbcl":
        this.measure.point();
        break;
      default:
        break;
    }
  }

  /**
   * 加载卫星
   */
  loadSatellite() {
    const position = [83.498442, 37.425703, 9980000.6];

    // 加个模型
    const modelGraphic = new mars3d.graphic.ModelPrimitive({
      name: "卫星模型",
      position,
      forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
      backwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
      style: {
        url: "img/model/weixin.gltf",
        scale: 1,
        minimumPixelSize: 150,
        heading: 0,
        pitch: 9,
        roll: 0,
      },
    });
    this.satelliteGraphicLayer.addGraphic(modelGraphic);

    // 打开3个轴进行显示对比
    modelGraphic.debugAxis = true;
    // 视锥体
    const satelliteSensor = new mars3d.graphic.SatelliteSensor({
      position,
      forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
      backwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
      style: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
        angle1: 5, // 夹角1
        angle2: 10, // 夹角2
        heading: 0,
        pitch: 9,
        roll: 0,
        color: "rgba(0,255,255,0.35)",
        flat: true,
      },
    });
    this.satelliteGraphicLayer.addGraphic(satelliteSensor);
  }

  /**
   * 加载地图监测点
   */
  loadMonitorPoints(monitors) {
    monitors.forEach((element) => {
      const graphic = new mars3d.graphic.PointEntity({
        position: [element.longitude, element.latitude, element.height],
        attr: element,
        id: element.id,
        style: {
          color: "#ff0000",
          pixelSize: 6,
          outline: true,
          outlineColor: "#ffffff",
          outlineWidth: 2,
          visibleDepth: false,
          label: {
            font_size: 14,
            text: element.title,
            background: true,
            pixelOffsetY: -20,
            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 3000,
            visibleDepth: false,
          },
        },
      });
      // 点击后改变测点编号
      graphic.on(mars3d.EventType.click, function (e) {
        monitoringid.value = e.target.options.attr.id;
        monitoringName.value = e.target.options.attr.title;
      });

      this.graphicLayer.addGraphic(graphic);
    });
  }

  /**
   * 加载雷达图标
   * @param {*} data
   */
  loadRadar(data) {
    const graphic = new mars3d.graphic.BillboardEntity({
      position: new mars3d.LngLatPoint(
        data.longitude,
        data.latitude,
        data.height
      ),
      style: {
        image: "img/marker/mark-radar.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        label: {
          font_size: 14,
          text: "雷达:在线",
          background: true,
          pixelOffsetY: -48,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 3000,
        },
      },
    });
    this.graphicLayer.addGraphic(graphic);
  }

  /**
   * 加载雷达形变图
   * @param {*} params
   */
  loadRadarImageTileset(params) {
    const { imgs, tileInfos } = params;
    this.mapInstance.viewer.entities.removeAll();
    tileInfos.forEach((item, i) => {
      const entity = new Cesium.Entity({
        id: `radar_${i}`,
        name: "heatmap",
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(
            item[0],
            item[1],
            item[2],
            item[3]
          ),
          material: new Cesium.ImageMaterialProperty({
            image: URL.createObjectURL(imgs[i]),
            transparent: true,
          }),
        },
      });

      this.mapInstance.viewer.entities.add(entity);
    });
  }

  showMineLayerGraphic(id) {
    this.mineAreaLayer.eachGraphic((graphic) => {
      if (id && graphic.id !== id) {
        graphic.show = false;
      } else {
        graphic.show = true;
      }
    });
  }

  /**
   * 加载单个煤矿卫星变形图
   * @param {*} option
   */
  loadMineImageLayer(option) {
    const graphic = this.mineAreaLayer.getGraphicById(option.id);
    this.mkImglayer.setOptions({
      name: "宏燃煤矿",
      url: option.url,
      rectangle: graphic.rectangle,
      opacity: 0.75,
      show: true,
    });
  }

  /**
   * 加载单个煤矿三维模型
   * @param {*} option
   */
  loadMineTilesetLayer(option) {
    if (option) {
      this.currentTilesetLayer = new mars3d.layer.TilesetLayer(option);
      this.mapInstance.addLayer(this.currentTilesetLayer);
      this.currentTilesetLayer.readyPromise.then(function (layer) {
        layer.flyTo();
        // mkImglayer.show = false;
      });
    } else {
      ElMessageBox.alert("缺少模型数据，无法进入露天矿监测", "系统提示");
    }
  }

  /**
   * 加载图片Entity
   * @param {*} option
   */
  addImageEntity(option) {
    const graphic = this.mineAreaLayer.getGraphicById(option.id);
    const entity = new Cesium.Entity({
      id: `mkimg`,
      name: "heatmap2",
      rectangle: {
        coordinates: graphic.rectangle,
        material: new Cesium.ImageMaterialProperty({
          image: option.img,
          transparent: true,
        }),
      },
    });

    this.mapInstance.viewer.entities.add(entity);
  }

  /**
   * 添加传感器
   */

  addSensorGraphic(type, position, icon) {
    const graphicImg = new mars3d.graphic.DivGraphic({
      position: position,
      style: {
        html: ` <div class="mars3d-camera-content">
                        <img class="mars3d-camera-img" src="img/icon/${icon}" >
                      </div>
                      <div class="mars3d-camera-line" ></div>
                      <div class="mars3d-camera-point"></div>
                    `,
        offsetX: -16,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 8000),
      },
    });
    const options = {
      offsetY: -100, // 显示Popup的偏移值，是DivGraphic本身的像素高度值
      template: `<div class="marsBlackPanel animation-spaceInDown">
                          <div class="marsBlackPanel-text">{content}</div>
                          <span class="mars3d-popup-close-button closeButton" >×</span>
                        </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
    };
    if (type == 1) {
      const content = `<video src='http://153.36.59.170:8090/video.mp4' controls autoplay style="width: 300px;" ></video>`;

      graphicImg.bindPopup(content, options);
    } else if (type == 3) {
      const content = `<div style="width: 300px;height:200px" id="gnssLineChart"></div>`;
      graphicImg.bindPopup(content, options);
    }
    this.graphicLayer.addGraphic(graphicImg);
  }
}

export default mapUtil;
