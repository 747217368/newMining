import {
  getRadarImageTilesInfo,
  getRadarImageTileRectangle,
  getRadarImageTileBlob,
} from "@/api/slope";
import { dayjs } from "element-plus";
// import axios from "axios";

/**
 * 获取图片
 */
export function getRadarTilesImages(imgInfo) {
  return new Promise((resolve, reject) => {
    imgInfo.timestamp = dayjs(imgInfo.ts).format("YYYYMMDD");

    getRadarImageTilesInfo(imgInfo)
      .then(async (res) => {
        console.log("雷达图片配置信息", res);
        const { compressImageSidePixel, matrixTileTotal } = res;
        // const reg = new RegExp("imageTiles.json", "g");
        const tileInfoArr = [];
        const imgArr = [];
        for (let imageIndex = 0; imageIndex < matrixTileTotal; imageIndex++) {
          const params = {
            ...imgInfo,
            imageIndex,
            imageSidePixel: compressImageSidePixel,
          };
          tileInfoArr.push(getRadarImageTileRectangle(params));
          imgArr.push(getRadarImageTileBlob(params));
        }

        const tileInfos = await Promise.all(tileInfoArr);
        const imgs = await Promise.all(imgArr);
        // console.log("图片URL", URL.createObjectURL(imgs[0]));
        // console.log("图片位置", tileInfos);
        // console.log("图片对象", imgs);
        resolve({ imgs, tileInfos });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
