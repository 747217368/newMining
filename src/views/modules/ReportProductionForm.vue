<template>
  <el-dialog
    title="详查报告生产"
    v-model="visible"
    width="600px"
    append-to-body
  >
    <el-form
      :model="state.form"
      :rules="rules"
      ref="formRef"
      label-width="auto"
    >
      <el-form-item label="矿区勘查报告" prop="reportName">
        <!-- <el-input
          v-model="state.form.reportName"
          placeholder="请输入矿区勘查报告"
          maxlength="50"
        /> -->
        <el-select
          v-model="state.form.reportName"
          placeholder="请选择矿区勘查报告"
        >
          <el-option label="勘查报告20231121" value="1" />
          <el-option label="勘查报告20231215" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="点云数据" prop="dianyun">
        <el-select v-model="state.form.dianyun" placeholder="请选择点云数据">
          <el-option label="宏燃点云20231121" value="1" />
          <el-option label="宏燃点云20231215" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="正射影像" prop="dom">
        <el-select v-model="state.form.dom" placeholder="请选择正射影像">
          <el-option label="宏燃正射20231121" value="1" />
          <el-option label="宏燃正射20231215" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="往期点云数据" prop="wqdianyun">
        <el-select
          v-model="state.form.wqdianyun"
          placeholder="请选择往期点云数据"
        >
          <el-option label="宏燃点云20231121" value="1" />
          <el-option label="宏燃点云20231215" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="初设信息确认" prop="confirm">
        <el-select v-model="state.form.confirm" placeholder="请选择往初设信息">
          <el-option label="默认" value="1" />
          <el-option label="严格" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="端帮角测量线" prop="line">
        <el-select v-model="state.form.line" placeholder="请选择往初设信息">
          <el-option label="测量03071512" value="1" />
          <el-option label="测量03071617" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="开采现状图纸" prop="cad">
        <el-select v-model="state.form.cad" placeholder="请选择往初设信息">
          <el-option label="CAD图纸0215" value="1" />
          <el-option label="CAD图纸0301" value="2" />
        </el-select>
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
  </el-dialog>
</template>

<script setup>
// import { updateData } from "@/api/slope/data-manage";
import { dayjs, ElMessage, ElLoading } from "element-plus";
const emit = defineEmits(["ok"]);
const visible = ref(false);
const loading = ref(false);
const state = reactive({
  form: {},
});

const rules = {
  reportName: [
    { required: true, message: "矿区勘查报告不能为空", trigger: "blur" },
  ],
  dianyun: [{ required: true, message: "请选择点云数据", trigger: "blur" }],
  dom: [{ required: true, message: "请选择点正射影像", trigger: "blur" }],
};

const show = () => {
  visible.value = true;
};

const cancel = () => {
  state.form = {};
  visible.value = false;
};
const formRef = ref(null);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        ElMessage.success("生成成功！");
        cancel();
        window.open("pdf/宏燃煤矿无人机详查报告.pdf", "_bank");
      }, 800);
    }
  });
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
