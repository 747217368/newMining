<template>
  <div>
    <div class="top-block">
      <el-input placeholder="请输入关键字" class="query-input">
        <template #append>
          <el-button type="primary" icon="Search" @click="handleQuery" />
        </template>
      </el-input>
    </div>
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" size="large">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="缩略图" align="center" key="thumbnail" prop="thumbnail" width="100">
        <el-image style="width: 80px; height: 60px"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
      </el-table-column>
      <el-table-column label="名称" align="center" key="sceneName" prop="sceneName" :show-overflow-tooltip="true" />

      <el-table-column label="创建时间" align="center" key="createTime" prop="createTime" />

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-space wrap>
            <el-button link icon="View">预览</el-button>
            <!-- <el-button link icon="Edit">编辑</el-button> -->
            <el-dropdown popper-class="dark-popper">
              <el-button link icon="MoreFilled">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>分享</el-dropdown-item>
                  <el-dropdown-item>编辑</el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(scope.row)">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination hide-on-single-page :page-size="state.queryParams.pageSize"
      v-model:current-page="state.queryParams.pageNum" :total="total" layout="prev, pager, next"
      @current-change="getList" />
  </div>
  <upload-dialog ref="uploadDialogRef" :projectOptions="projectOptions"></upload-dialog>
</template>

<script setup>
// import { getSceneList, deleteScene } from "@/api/slope/scene";
// import { getProjectList } from "@/api/slope/project";
import UploadDialog from "@/views/data-manage/profile/upload-dialog.vue";
import { dayjs } from "element-plus";

const { proxy } = getCurrentInstance();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});
const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 6,
    dataName: undefined,
  },
});

const dataList = ref([
  {
    "projectId": 29,
    "sceneId": 33,
    "sceneName": "我的场景_1703317056747",
    "remark": null,
    "createTime": "2023-12-23 15:37:37",
    "delFlag": 0,
    "img": null,
    "projectName": "准格尔旗"
  },
  {
    "projectId": 29,
    "sceneId": 34,
    "sceneName": "我的场景_1703317091211",
    "remark": null,
    "createTime": "2023-12-23 15:38:11",
    "delFlag": 0,
    "img": null,
    "projectName": "准格尔旗"
  }
]);
const loading = ref(false);
const dateRange = ref([]);
const total = ref(0);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const projectOptions = ref([]);

function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const handleUpload = () => {
  proxy.$refs["uploadDialogRef"].show(props.projectId);
};

const handleEdit = (row) => {
  // proxy.$refs["projectFormRef"].show(row);
};

const handleQuery = () => {
  state.queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
};

const handleUpdate = () => { };

/** 查询项目列表 */
function getList() {
  // loading.value = true;
  const params = {
    ...state.queryParams,
    createTime: dateRange.value[0],
    endTime: dateRange.value[1],
    projectId: props.projectId,
  };
  // getSceneList(params)
  //   .then((res) => {
  //     dataList.value = res.rows.map((item) => ({
  //       ...item,
  //       createTime: dayjs(item.createTime).format("MM/DD HH:mm"),
  //     }));
  //     total.value = res.total;
  //     console.log("total", total.value);
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const dataIds = row.id || ids.value.join(",");
  proxy.$modal
    .confirm("是否确认删除选中数据项？")
    .then(function () {
      // return deleteScene({ ids: dataIds });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => { });
}
// getProList();
getList();
</script>

<style lang="scss" scoped>
.top-block {
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  .query-input {
    width: 300px;
  }
}

.el-pagination {
  float: right;
  margin-top: 16px;
}

:deep(.dark-popper) {
  color: #fff !important;
  background: #303133 !important;
  border: 1px solid #303133 !important;
}
</style>
