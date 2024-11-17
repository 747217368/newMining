<template>
  <el-dialog title="编辑数据" v-model="visible" width="600px" append-to-body>
    <el-form
      :model="state.form"
      :rules="rules"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="数据名称" prop="projectName">
        <el-input
          v-model="state.form.dataName"
          placeholder="请输入数据名称"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="数据备注">
        <el-input
          v-model="state.form.remark"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="请输入数据备注"
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
  </el-dialog>
</template>

<script setup>
// import { updateData } from "@/api/slope/data-manage";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["ok"]);
const visible = ref(false);
const title = ref("新建项目");
const loading = ref(false);
const state = reactive({
  form: {},
});

const rules = {
  dataName: [
    { required: true, message: "数据名称不能为空", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "数据名称长度必须介于 2 和 50 之间",
      trigger: "blur",
    },
  ],
};

const show = (data) => {
  state.form = data;
  visible.value = true;
};

const cancel = () => {
  // proxy.resetForm("formRef");
  state.form = {};
  visible.value = false;
};

const submitForm = () => {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      loading.value = true;
      // updateData(state.form)
      //   .then((response) => {
      //     proxy.$modal.msgSuccess("修改成功");
      //     cancel();
      //     emit("ok");
      //   })
      //   .finally(() => {
      //     loading.value = false;
      //   });
    }
  });
};

defineExpose({
  show,
});
</script>

<style lang="scss" scoped></style>
