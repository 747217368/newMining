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

      <el-form-item label="面积单位" prop="unit">
        <el-select placeholder="请选择单位" v-model="state.form.unit">
          <el-option label="平方米" value="m²" />
          <el-option label="平方千米" value="km²" />
        </el-select>
      </el-form-item>

      <el-form-item label="长度单位" prop="distanceUnit">
        <el-select placeholder="请选择单位" v-model="state.form.distanceUnit">
          <el-option label="米" value="m" />
          <el-option label="千米" value="km" />
        </el-select>
      </el-form-item>
      <el-form-item label="平面面积">
        <el-input :value="area">
          <template #suffix>{{ state.form.unit }}</template>
        </el-input>
      </el-form-item>

      <el-form-item label="周长">
        <el-input :value="distance">
          <template #suffix>{{ state.form.distanceUnit }}</template>
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
/**
 * 距离测量表单
 */
import useEarthMapStore from "@/store/modules/earthMap";
const earthStore = useEarthMapStore();

console.log("面积测量结果", earthStore.measuredResult);

const { proxy } = getCurrentInstance();

// 面积
const area = computed(() => {
  const value = earthStore.measuredResult.area;
  if (state.form.unit === "m²") {
    return value.toFixed(2);
  } else {
    return (value / 1000000).toFixed(2);
  }
});

// 周长
const distance = computed(() => {
  const value = earthStore.measuredResult.distance;
  if (state.form.distanceUnit === "m") {
    return value.toFixed(2);
  } else {
    return (value / 1000).toFixed(2);
  }
});

const state = reactive({
  form: {
    unit: "m²",
    distanceUnit: "m",
    area: 0,
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

defineExpose({ validate });
</script>

<style lang="scss" scoped></style>
