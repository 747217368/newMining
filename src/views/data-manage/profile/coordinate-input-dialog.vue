<template>
  <el-dialog
    title="坐标录入"
    v-model="visible"
    width="450"
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-form
      :model="state.form"
      :rules="state.rules"
      ref="formRef"
      label-width="80px"
    >
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

      <el-form-item label="坐标系统" prop="coordinateSystem">
        <el-select
          placeholder="请选择坐标系统"
          v-model="state.form.coordinateSystem"
        >
          <el-option label="CGCS2000" value="CGCS2000" />
          <el-option label="西安80" value="80" />
          <el-option label="北京54" value="54" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["confirm"]);
const visible = ref(false);
const earthStore = useEarthMapStore();
const state = reactive({
  //经度:116.266421纬度:30.718981横39429735 纵3400048海拔：118.8米层级：11方向：0°俯仰角：-45°视高：45397.0米帧率：157 FPS
  form: {
    longitude: 116.266421,
    latitude: 30.718981,
    coordinateSystem: "CGCS2000",
  },
  rules: {
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
  },
});
const show = () => {
  visible.value = true;
};

const cancelClick = () => {
  visible.value = false;
  earthStore.cancelAnalysis();
};
const confirmClick = () => {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      emit("confirm", state.form);
      visible.value = false;
    }
  });
};

defineExpose({
  show,
});
</script>

<style lang="scss">
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}
</style>
