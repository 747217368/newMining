import request from "@/utils/request";

// 获取监测点信息
export function getMonitoringPoint(projectid) {
  return request({
    url: `/api/protocol/monitoringpointinfo/${projectid}`,
    method: "get",
  });
}

// 获取监测面信息
export function getMonitoringPolygon(projectid) {
  return request({
    url: `/api/protocol/monitoringpolygoninfo/${projectid}`,
    method: "get",
  });
}

//获取雷达列表
export function getRadarDeviceInfo(projectid) {
  return request({
    url: `/api/protocol/deviceinfo/${projectid}`,
    method: "get",
  });
}

// 获取雷达图像列表
export function getRadarImgList(params) {
  return request({
    url: "/api/sar/image/list",
    method: "post",
    data: params,
  });
}

// 获取雷达图像配置信息
export function getRadarImageTilesInfo(params) {
  return request({
    url: `/radar-api/data/project/${params.projectId}/images/${params.deviceId}/${params.timestamp}/${params.fileName}/imageTiles.json`,
    method: "get",
  });
}

// 获取雷达单个瓦片位置信息
export function getRadarImageTileRectangle(params) {
  return request({
    url: `/radar-api/data/project/${params.projectId}/images/${params.deviceId}/${params.timestamp}/${params.fileName}/${params.imageIndex}.json`,
    method: "get",
  });
}

// 获取雷达图像单个瓦片
export function getRadarImageTileBlob(params) {
  return request({
    url: `/radar-api/data/project/${params.projectId}/images/${params.deviceId}/${params.timestamp}/${params.fileName}/${params.imageIndex}_${params.imageSidePixel}.png`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * 通过测点id获取测点的某段时间的加速度历史数据
 * @param {*} monitoringid
 * @returns
 */
export function getAcceleratinfo(params) {
  return request({
    url: `/api/protocol/accelerationinfo/${params.monitoringid}/${params.starttime}/${params.endtime}`,
    method: "get",
  });
}
/**
 * 通过测点id获取测点的某段时间的位移历史数据
 * @param {*} params
 * @returns
 */
export function getDisplaceinfo(params) {
  return request({
    url: `/api/protocol/displaceinfo/${params.monitoringid}/${params.starttime}/${params.endtime}`,
    method: "get",
  });
}

/**
 * 通过测点id获取测点的某段时间的速度历史数据
 * @param {*} params
 * @returns
 */
export function getSpeedinfo(params) {
  return request({
    url: `/api/protocol/speedinfo/${params.monitoringid}/${params.starttime}/${params.endtime}`,
    method: "get",
  });
}
/**
 * 雷达控制
 * @param {*} params
 * @returns
 */
export function radarCommand(params) {
  return request({
    url: `/api/arcsar/command/${params.projectId}/${params.deviceId}/${params.command}/${params.userName}`,
    method: "get",
  });
}
