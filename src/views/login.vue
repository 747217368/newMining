<template>
  <div class="login">
    <el-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <!-- <h3 class="title">新疆露天矿边坡一体化监管平台</h3> -->
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
          :prefix-icon="User"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          :prefix-icon="Lock"
        >
        </el-input>
      </el-form-item>

      <el-form-item class="btn">
        <div
          v-loading="loading"
          class="login-btn"
          size="large"
          type="primary"
          element-loading-background="rgba(0, 0, 0, 0.15)"
          @click="login"
        >
          <!-- <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span> -->
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2023-2024 孚山驽势 All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import { User, Lock } from "@element-plus/icons-vue";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const loginForm = ref({
  username: "HRMK",
  password: "HRMK01",
  rememberMe: false,
});

const loading = ref(false);
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};
const loginRef = ref();
const login = () => {
  loginRef.value.validate((valid) => {
    const params = {
      username: "HRMK",
      password: "HRMK01",
    };
    loading.value = true;
    userStore
      .login(params)
      .then((res) => {
        router.push({
          path: "/index",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
</script>


<style lang="less" scoped>
.login-header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background-image: url("../assets/images/header.png");
  background-size: cover;
}

.header-title {
  display: flex;
  justify-content: center;

  .txt {
    font-family: PangMen;
    color: #fff;
    text-align: justify;
    font-size: 46px;
    font-style: normal;
    font-weight: 500;
    line-height: 80px;
    background: linear-gradient(90deg, #ffffff 0%, #90deff 100%);
    -webkit-background-clip: text;
    /*将设置的背景颜色限制在文字中*/
    -webkit-text-fill-color: transparent;
    /*给文字设置成透明*/
  }
}

.login {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-image: url("../assets/images/login-bg.png");
  background-size: cover;
}

.title {
  font-size: 28px;
  margin: 0px auto 30px auto;
  text-align: center;
  color: #ffffff;
}

.login-form {
  border-radius: 6px;
  background-image: url("../assets/images/login-form.png");
  background-size: 100% 100%;
  width: 400px;
  padding: 2rem 0.25rem 0.05rem 0.25rem;
  margin-right: 2rem;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }

  .username {
    margin-top: 70px;
  }

  .btn {
    width: 100%;
    margin: 110px 0;
  }

  .login-btn {
    width: 70%;
    height: 50px;
    background-image: url("../assets/images/login-btn.png");
    background-size: cover;
    cursor: pointer;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 20px;
}

:deep(.el-form-item__content) {
  justify-content: center;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  border: 1px solid #3da0fa;
  box-shadow: none;
}
</style>

