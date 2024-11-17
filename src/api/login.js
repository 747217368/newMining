import request from "@/utils/request";

// 获取时间戳
export function getTimeStamp() {
  return request({
    url: "/api/login/generate/time",
    method: "post",
  });
}

// 登录方法
export function login(userName, password, time, sign) {
  return request({
    url: "/api/login/generate/token",
    headers: {
      isToken: false,
    },
    method: "post",
    data: { userName, password, time, sign },
  });
}

// 获取时间戳
export function getInfo(token) {
  return request({
    url: "/api/login/getUserInfo",
    method: "post",
    data: { token },
  });
}
