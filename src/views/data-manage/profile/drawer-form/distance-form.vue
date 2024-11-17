<template>
  <div>
    <el-form
      :model="state.form"
      :rules="state.rules"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="测量名称" prop="name">
        <el-input
          v-model="state.form.name"
          placeholder="请输入测量名称"
          maxlength="50"
        />
      </el-form-item>

      <el-form-item label="距离单位" prop="unit">
        <el-select placeholder="请选择距离单位" v-model="state.form.unit">
          <el-option label="米" value="m" />
          <el-option label="千米" value="km" />
        </el-select>
      </el-form-item>
      <el-form-item label="平面距离">
        <el-input :value="distance">
          <template #suffix>{{ state.form.unit }}</template>
        </el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="state.form.remark"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
          placeholder="请输入备注"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import useEarthMapStore from "@/store/modules/earthMap";
const earthStore = useEarthMapStore();


const distance = computed(() => {
  const value = earthStore.measuredResult.distance;
  if (state.form.unit === "m") {
    return value.toFixed(2);
  } else {
    return (value / 1000).toFixed(2);
  }
});
/**
 * 距离测量表单
 */
const { proxy } = getCurrentInstance();
const state = reactive({
  form: {
    unit: "m",
    distance: 0,
  },
  rules: {
    name: [
      { required: true, message: "测量名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 50,
        message: "测量名称长度必须介于 2 和 50 之间",
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
    coordinateSystem: [
      { required: true, message: "请选择坐标系统", trigger: "blur" },
    ],
    ellipsoidalHeight: [
      { required: true, message: "椭球高不能为空", trigger: "blur" },
    ],
  },
});

const validate = (callback) => {
  proxy.$refs["formRef"].validate((valid) => {
    callback(valid);
  });
};

defineExpose({ validate, form: state.form });
</script>

<style lang="scss" scoped></style>
