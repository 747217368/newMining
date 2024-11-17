import { dayjs } from "element-plus";
import { saveAs } from "file-saver";
/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time
        .replace(new RegExp(/-/gm), "/")
        .replace("T", " ")
        .replace(new RegExp(/\.[\d]{3}/gm), "");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}
/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            let params = propName + "[" + key + "]";
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}

/**
 * 获取日期范围 返回日期格式[start,end],YYYY-MM-DD HH:mm:ss
 * @param {*} type 0当天，1当周， 1当月，2当年
 */
export function getDateRange(type) {
  let startTime,
    endTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (type == 0) {
    startTime = dayjs().startOf("date").format("YYYY-MM-DD HH:mm:ss");
  } else if (type == 1) {
    startTime = dayjs().startOf("week").format("YYYY-MM-DD HH:mm:ss");
  } else if (type == 2) {
    startTime = dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss");
  } else if (type == 3) {
    startTime = dayjs().startOf("year").format("YYYY-MM-DD HH:mm:ss");
  } else {
    throw new Error("type 参数错误！");
  }

  return [startTime, endTime];
}

/**
 * 获取n天以前到现在的时间范围
 * @param {*} day n天
 * @returns
 */
export function getBeforeDateRange(day) {
  let startTime,
    endTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  startTime = dayjs().subtract(day, "day").format("YYYY-MM-DD HH:mm:ss");

  return [startTime, endTime];
}
/**
 * 返回指定范围内的随机数
 * @param {*} min 最小值
 * @param {*} max 最大值
 * @returns
 */
export function randomNumByRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 获取 blob
 * url 目标文件地址
 */
export function getBlob(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}

export function downloadFile(url, filename) {
  if (!url) return;
  const arr = url.split(".");
  filename = `${filename}.${arr[arr.length - 1].toLowerCase()}`;
  getBlob(url).then((blob) => {
    saveAs(blob, filename);
  });
}

// file 转blob
export function fileToBlob(file) {
  // 创建 FileReader 对象
  let reader = new FileReader();
  return new Promise((resolve) => {
    // FileReader 添加 load 事件
    reader.addEventListener("load", (e) => {
      let blob;
      if (typeof e.target.result === "object") {
        blob = new Blob([e.target.result]);
      } else {
        blob = e.target.result;
      }
      console.log(Object.prototype.toString.call(blob));
      resolve(blob);
    });
    // FileReader 以 ArrayBuffer 格式 读取 File 对象中数据
    reader.readAsArrayBuffer(file);
  });
}

export function parseFileSize(size) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}K`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)}M`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)}G`;
  }
}

export function getFileExtension(filename) {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
}
