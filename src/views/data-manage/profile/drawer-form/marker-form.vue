<template>
  <div>
    <el-form
      :model="state.form"
      :rules="state.rules"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="标记名称" prop="name">
        <el-input
          v-model="state.form.name"
          placeholder="请输入标记名称"
          maxlength="50"
        />
      </el-form-item>
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
      <el-form-item label="椭球高" prop="ellipsoidalHeight">
        <el-input placeholder="请输入椭球高度">
          <template #suffix>米</template></el-input
        >
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
      <el-form-item label="东坐标">
        <el-input placeholder="请输入东坐标"></el-input>
      </el-form-item>
      <el-form-item label="北坐标">
        <el-input placeholder="请输入北坐标"></el-input>
      </el-form-item>
      <el-form-item label="正高">
        <el-input placeholder="请输入正高" v-model="state.form.alt">
          <template #suffix>米</template>
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
 * 点位标记表单
 */
import useEarthMapStore from "@/store/modules/earthMap";

const earthStore = useEarthMapStore();
const { proxy } = getCurrentInstance();
const state = reactive({
  form: {
    coordinateSystem: "CGCS2000",
    longitude: earthStore.drawCoordinate[0],
    latitude: earthStore.drawCoordinate[1],
    alt: earthStore.drawCoordinate[2],
  },
  rules: {
    name: [
      { required: true, message: "标记名称不能为空", trigger: "blur" },
      {
        min: 2,
        max: 50,
        message: "标记名称长度必须介于 2 和 50 之间",
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

defineExpose({ validate });
</script>

<style lang="scss" scoped></style>
