<template>
  <el-dialog :title="title" v-model="visible" width="600px" append-to-body>
    <el-form
      :model="state.form"
      :rules="rules"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="state.form.projectName"
          placeholder="请输入项目名称"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input
          v-model="state.form.projectDescription"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入项目描述"
        ></el-input>
      </el-form-item>
      <div class="form-sub-title">
        <div class="title">位置信息</div>
        <el-button type="primary" icon="Coordinate" link @click="onPickup"
          >地图选点</el-button
        >
      </div>
      <el-form-item label="经度" prop="longitude">
        <el-input
          v-model="state.form.longitude"
          placeholder="请输入经度"
        ></el-input>
      </el-form-item>

      <el-form-item label="纬度" prop="latitude">
        <el-input
          v-model="state.form.latitude"
          placeholder="请输入纬度"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="loading"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
    <LocationPickup
      ref="locationPickupRef"
      @ok="pickupConfirm"
    ></LocationPickup>
  </el-dialog>
</template>

<script setup>
import LocationPickup from "@/components/LocationPickup";
import { addProject, updateProject } from "@/api/slope/project";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["ok"]);
const visible = ref(false);
const title = ref("新建项目");
const loading = ref(false);
const state = reactive({
  form: {},
});

const rules = {
  projectName: [
    { required: true, message: "项目名称不能为空", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "图层名称长度必须介于 2 和 50 之间",
      trigger: "blur",
    },
  ],
  longitude: [
    { required: true, message: "经度不能为空", trigger: "blur" },
    {
      pattern:
        /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,8})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,8}|180)$/,
      message: "经度整数部分为0-180,小数部分为0到8位",
      trigger: "blur",
    },
  ],
  latitude: [
    { required: true, message: "纬度不能为空", trigger: "blur" },
    {
      pattern: /^(\-|\+)?([0-8]?\d{1}\.\d{0,8}|90\.0{0,8}|[0-8]?\d{1}|90)$/,
      message: "纬度整数部分为0-90,小数部分为0到8位",
      trigger: "blur",
    },
  ],
};

const show = (data) => {
  if (data) {
    title.value = "编辑项目";
    state.form.id = data.id;
    state.form.projectName = data.projectName;
    state.form.projectDescription = data.projectDescription;
    state.form.longitude = data.longitude;
    state.form.latitude = data.latitude;
    state.form.region = data.region;
  }
  visible.value = true;
};

const cancel = () => {
  proxy.resetForm("formRef");
  state.form = {};
  visible.value = false;
};

const submitForm = () => {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      loading.value = true;
      if (state.form.id != undefined) {
        updateProject(state.form)
          .then((response) => {
            proxy.$modal.msgSuccess("修改成功");
            cancel();
            emit("ok");
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        addProject(state.form)
          .then((response) => {
            proxy.$modal.msgSuccess("新增成功");
            cancel();
            emit("ok");
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const onPickup = () => {
  proxy.$refs["locationPickupRef"].show();
};

const pickupConfirm = (data) => {
  console.log("address", data);
  state.form.longitude = data.lnglat.lon.toFixed(8);
  state.form.latitude = data.lnglat.lat.toFixed(8);
  // state.form.region = `${data.address.province} ${data.address.city}`;
  state.form.region = data.address.city;
  proxy.$refs["formRef"].validateField("longitude");
  proxy.$refs["formRef"].validateField("latitude");
};

defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.form-sub-title {
  display: flex;
  justify-content: space-between;
  // line-height: 38px;
  margin-bottom: 8px;
  margin-top: 24px;

  .title {
    font-size: 14px;
    color: var(--el-text-color-primary);
    font-weight: 550;
  }
}
</style>
