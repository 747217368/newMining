import { login, getTimeStamp, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import md5 from "js-md5";

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    id: "",
    name: "",
    avatar: "",
    projects: [],
    role: "",
    roles: [],
    permissions: [],
  }),
  actions: {
    // 登录
    login(userInfo) {
      return new Promise(async (resolve, reject) => {
        const username = userInfo.username.trim();
        const res = await getTimeStamp();
        const timestamp = res.data;
        const password = md5(username + userInfo.password);
        const sign = md5(username + password + timestamp);

        login(username, password, timestamp, sign)
          .then((res) => {
            console.log("登录结果", res);
            if (res.code === 0) {
              let data = res.data;
              this.id = data.id;
              this.name = data.userName;
              this.projects = data.projects;
              this.role = data.role;
              setToken(data.token);
              this.token = data.token;
              resolve();
            } else {
              console.log("登陆失败，失败原因：" + res.data);
              reject();
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        const token = getToken();
        getInfo(token)
          .then((res) => {
            let data = res.data;
            this.id = data.id;
            this.name = data.userName;
            this.projects = data.projects;
            this.role = data.role;
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        this.token = "";
        removeToken();
        resolve();
        window.location.reload();
      });
    },
  },
});

export default useUserStore;
