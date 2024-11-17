<template>
  <div style="position: relative; height: 100%">
    <div class="top-block">
      <el-button
        size="large"
        type="primary"
        icon="UploadFilled"
        @click="handleUpload"
      >
        上传数据
      </el-button>
      <el-input placeholder="请输入关键字" class="query-input">
        <!-- <template #prepend>
          <el-select size="large" placeholder="数据类型" style="width: 115px">
            <el-option label="Restaurant" value="1" />
            <el-option label="Order No." value="2" />
            <el-option label="Tel" value="3" />
          </el-select>
        </template> -->
        <template #append>
          <el-button type="primary" @click="handleQuery" icon="Search" />
        </template>
      </el-input>
    </div>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
      size="large"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
    >
      <el-table-column type="selection" width="50" align="center" />

      <el-table-column
        label="名称"
        align="center"
        key="dataName"
        prop="dataName"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="类型"
        align="center"
        key="dataType"
        prop="dataType"
        :filters="[
          { text: '正射影像', value: 'dom' },
          { text: '高程模型', value: 'dem' },
          { text: '倾斜模型', value: 'osgb' },
          { text: '三维切片', value: 'tiles3d' },
          { text: '激光点云', value: 'las' },
          { text: 'CAD文件', value: 'cad' },
          { text: '矢量数据', value: 'vector' },
        ]"
        :filter-method="filterHandler"
      >
        <template #default="scope">
          {{ typeDict[scope.row.dataType] }}
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        align="center"
        key="time"
        prop="time"
        sortable
      />
      <el-table-column
        label="大小"
        align="center"
        key="size"
        prop="size"
        width="80"
      >
        <template #default="scope">
          {{ parseFileSize(scope.row.size) }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-space wrap>
            <el-button link icon="Document" @click="handleInfo(scope.row)"
              >详情</el-button
            >
            <el-dropdown popper-class="dark-popper">
              <el-button link icon="MoreFilled">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(scope.row)">
                    编辑
                  </el-dropdown-item>
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
    <el-pagination
      hide-on-single-page
      :page-size="state.queryParams.pageSize"
      v-model:current-page="state.queryParams.pageNum"
      :total="total"
      layout="prev, pager, next"
      @current-change="getList"
    />
    <div class="footer" v-if="ids.length > 0">
      <div class="checked-count">
        <el-icon size="16"><WarningFilled /></el-icon>
        <div>
          已选择<span>{{ ids.length }}</span
          >项
        </div>
      </div>
      <el-divider direction="vertical" />
      <el-button link icon="View" @click="handleView">叠加显示</el-button>
      <el-divider direction="vertical" />
      <!-- <el-button link icon="Share" @click="handleShare">分享</el-button>
      <el-divider direction="vertical" /> -->
      <el-button link icon="Delete" @click="handleDelete">删除</el-button>
      <el-icon class="close-btn" @click="closeFooter"><Close /></el-icon>
    </div>
  </div>
  <upload-dialog
    ref="uploadDialogRef"
    :projectOptions="projectOptions"
    @ok="getList"
  ></upload-dialog>
  <data-info-dialog ref="dataInfoDialogRef"></data-info-dialog>
  <data-update-dialog
    ref="dataUpdateDialogRef"
    @ok="getList"
  ></data-update-dialog>
</template>

<script setup>
// import { getDataList, deleteData } from "@/api/slope/data-manage";
// import { getProjectList } from "@/api/slope/project";
import UploadDialog from "@/views/data-manage/profile/upload-dialog.vue";
import DataInfoDialog from "@/views/data-manage/profile/data-info-dialog.vue";
import DataUpdateDialog from "@/views/data-manage/profile/data-update-dialog.vue";
import { dayjs } from "element-plus";
import { parseFileSize } from "@/utils";
const { proxy } = getCurrentInstance();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  layerLoad: {
    type: Function,
    required: false,
  },
});
const emits = defineEmits(["layersLoad"]);

const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 6,
    dataName: undefined,
  },
});

const typeDict = {
  dom: "正射影像",
  dem: "高程模型",
  osgb: "倾斜模型",
  tiles3d: "三维切片",
  las: "激光点云",
  cad: "CAD文件",
  vector: "矢量数据",
};
const dataList = ref([
  {
    id: "1",
    dataName: "数据1",
    size: 1024,
    dataType: "dom",
    time: "2022-01-01",
  },
  {
    id: "2",
    dataName: "数据2",
    size: 1024,
    dataType: "dom",
    time: "2022-01-01",
  },
]);
const loading = ref(false);
const dateRange = ref([]);
const total = ref(0);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const projectOptions = ref([]);
const route = useRoute();

onMounted(() => {
  previewSingle();
});

function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  // single.value = selection.length != 1;
  // multiple.value = !selection.length;
}

const handleUpload = () => {
  proxy.$refs["uploadDialogRef"].show(props.projectId);
};

const handleEdit = (row) => {
  proxy.$refs["dataUpdateDialogRef"].show(row);
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

const filterHandler = () => {};

const handleInfo = (row) => {
  proxy.$refs["dataInfoDialogRef"].show(row);
};

const handleUpdate = () => {};

const handleShare = () => {};

const handleView = () => {
  const layers = dataList.value
    .filter((item) => ids.value.includes(item.id))
    .map((item) => ({ ...item, nodeId: `layer_${item.id}` }));

  emits("layersLoad", layers);
};

const closeFooter = () => {
  proxy.$refs["tableRef"].clearSelection();
  emits("layersLoad", []);
};

/** 查询项目列表 */
function getList() {
  loading.value = true;
  const params = {
    ...state.queryParams,
    createTime: dateRange.value[0],
    endTime: dateRange.value[1],
    projectId: props.projectId,
  };
      loading.value = false;

  // getDataList(params)
  //   .then((res) => {
  //     dataList.value = res.rows.map((item) => ({
  //       ...item,
  //       time: dayjs(item.createTime).format("MM/DD HH:mm"),
  //     }));
  //     total.value = res.total;
  //     console.log("total", total.value);
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
}

/** 删除按钮操作 */
function handleDelete() {
  const dataIds = ids.value.join(",");
  proxy.$modal
    .confirm("是否确认删除选中数据项？")
    .then(function () {
      // return deleteData({ ids: dataIds });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

const previewSingle = () => {
  const id = route.query?.dataId;
  if (id) {
    getDataList({ id })
      .then((res) => {
        console.log("预览数据", res.rows);
        if (res.rows.length) {
          res.rows[0].nodeId = `layer_${id}`;
          emits("layersLoad", res.rows);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
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
    width: 320px;
  }
}

.el-pagination {
  float: right;
  margin-top: 16px;
}

.footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  // width: 100%;
  left: calc(50% - 200px);
  width: 400px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #0a2660;
  box-shadow: 3px 3px 10px 1px #0003;
  border: 1px solid #0f5eff;

  .checked-count {
    display: flex;
    color: var(--el-text-color-regular);
    align-items: center;
    font-size: 14px;

    i,
    span {
      color: #0f5eff;
      margin: 0px 4px;
    }
  }

  .close-btn {
    font-size: 20px;
    color: var(--el-text-color-regular);
    cursor: pointer;
  }

  .close-btn:hover {
    cursor: pointer;
    color: #909399;
  }
}

:deep(.dark-popper) {
  color: #fff !important;
  background: #303133 !important;
  border: 1px solid #303133 !important;
}
</style>
