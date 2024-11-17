<template>
  <el-dialog title="上传数据" v-model="visible" width="750px" append-to-body :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" @close="cancel" @opened="opened">
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="数据类型" description="选择所属项目和数据类型" />
      <el-step title="上传资料" description="选择文件及填写数据信息" />
      <el-step title="提交成功" description="查看上传进度" />
    </el-steps>
    <div class="form-block">
      <el-form v-show="active == 0" :model="state.typeForm" :rules="typeRules" ref="typeFormRef" label-width="100px">
        <el-form-item label="所在目录" prop="projectId" v-if="!state.projectId">
          <el-tree-select v-model="state.typeForm.projectId" :data="treeData" :props="defaultProps" value-key="id"
            placeholder="请选择所在目录" check-strictly />
        </el-form-item>
        <el-form-item label="文件日期" prop="dataDate">
          <el-date-picker v-model="state.typeForm.dataDate" type="date" placeholder="请选择文件日期" :size="size" />
        </el-form-item>
      </el-form>
      <el-form v-show="active === 1" :model="state.infoForm" :rules="infoRules" ref="infoFormRef" label-width="100px">
        <el-form-item label="文件名称" prop="dataName">
          <el-input v-model="state.infoForm.dataName" placeholder="请输入文件名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="选择文件" prop="fileName">
          <uploader :options="options" :autoStart="false" class="uploader-block" ref="uploaderRef"
            @file-complete="fileComplete" @complete="complete" :onFileAdded="onFileAdded" @file-progress="fileProgress"
            @file-error="fileError" @file-success="fileSuccess">
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
              <template v-if="state.uploadFile">
                <el-icon class="el-icon--upload">
                  <Document />
                </el-icon>
                <div>
                  {{ state.uploadFile.name }}
                  <el-divider direction="vertical" />
                  {{ parseFilesize(state.uploadFile.size) }}
                  <el-divider direction="vertical" />
                  <uploader-btn :single="true">重新选择</uploader-btn>
                </div>
              </template>
              <template v-else>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div>
                  拖动文件到这里 或者
                  <uploader-btn :single="true">点击选择</uploader-btn>
                </div>
              </template>
            </uploader-drop>
          </uploader>
          <div class="upload-tips">
            <div v-if="state.typeForm.dataType == 'dom'">
              *正射影像支持*.tif、*.tiff格式。
            </div>
            <div v-else-if="state.typeForm.dataType == 'dem'">
              *高程模型支持*.tif、*.tiff格式。
            </div>
            <div v-else-if="state.typeForm.dataType == 'osgb'">
              <div>
                为保证正确读取到模型文件，需要你的OSGB压缩包*.zip结构满足以下规则:
              </div>
              <div>
                *重建大师等软件导出的OSGB需要满足Data文件夹、matedata.xml文件在同一层级，Data文件夹下是各瓦块文件夹，瓦块文件夹下是OSGB文件，每个瓦块文件夹的名称要与里面OSGB文件的名称一致。
              </div>
              <div>
                *大疆导出的osgb需要满足Block文件夹、matedata.xmlosgb文件在同一层级。
              </div>
            </div>
            <div v-else-if="state.typeForm.dataType == 'tiles3d'">
              *三维切片支持*.zip 压缩包。
            </div>
            <div v-else-if="state.typeForm.dataType == 'las'">
              *激光点云支持*.las格式。
            </div>
            <div v-else-if="state.typeForm.dataType == 'cad'">
              *CAD文件支持*.dwg、*.dxf。
            </div>
            <div v-else-if="state.typeForm.dataType == 'vector'">
              *支持shp文件zip格式压缩包、*.kml文件
            </div>
            <div>
              *当前仅支持WGS_80，CGS2000地理坐标系，错误的坐标系可能导致无法正确的显示数据
            </div>
          </div>
          <el-alert show-icon v-if="state.alertShow" :title="state.alertMsg" type="warning" effect="dark"
            style="height: 38px" />
        </el-form-item>

        <!-- <el-form-item
          label="Activity zone"
          prop="region"
          v-if="state.typeForm.dataType == 'cad'"
        >
          <el-select v-model="ruleForm.region" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="备注">
          <el-input v-model="state.infoForm.remark" type="textarea" maxlength="200" :rows="4" show-word-limit
            placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div class="upload-progress" v-show="active === 2">
        <template v-if="state.uploadState === 4">
          <el-icon :size="64" color="#67C23A">
            <CircleCheckFilled />
          </el-icon>
          <div class="upload-progress-txt">上传成功</div>
          <div class="upload-progress-memo">
            <el-button type="primary" plain @click="uploadAgain">继续上传</el-button>
            <el-button @click="cancel">关闭</el-button>
          </div>
        </template>
        <template v-else-if="state.uploadState === 1">
          <el-progress type="circle" :percentage="state.progress" />
          <div class="upload-progress-txt">正在上传...</div>
          <div class="upload-progress-memo">
            上传时间可能会比较长，请勿关闭页面！
            <el-link type="primary" @click="cancelUpload">取消上传</el-link>
          </div>
        </template>
        <template v-else-if="state.uploadState === 2 || state.uploadState === 3">
          <el-icon :size="64" color="#F56C6C">
            <CircleCloseFilled />
          </el-icon>
          <div class="upload-progress-txt">上传失败</div>
          <div class="upload-progress-memo">
            失败原因：
            <el-tooltip :content="state.errorMsg || '未知错误！'" placement="top">
              <div class="upload-progress-memo-msg">
                {{ state.errorMsg || "未知错误！" }}
              </div>
            </el-tooltip>
            &nbsp;&nbsp;
            <!-- <el-link
              type="primary"
              @click="handleRetry"
              v-if="state.uploadState === 2"
              >重试</el-link
            > -->
            <el-link type="primary" @click="handlePreStep">上一步</el-link>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <template v-if="active === 0">
          <el-button type="primary" @click="handleNextStep">下一步</el-button>
        </template>
        <template v-if="active === 1">
          <el-button @click="handlePreStep">上一步</el-button>
          <el-button type="primary" @click="handleNextStep">下一步</el-button>
        </template>

        <el-button @click="cancel" v-if="active < 2">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Box, Upload, Select, WarningFilled } from "@element-plus/icons-vue";
import GeoTIFF, { fromUrl, fromArrayBuffer, fromBlob } from "geotiff";
import { fileToBlob, getFileExtension } from "@/utils";
// import { addData, isDataExist } from "@/api/slope/data-manage";
import { getToken } from "@/utils/auth";
import { reactive } from "vue";

import useUserStore from "@/store/modules/user";

// const props = defineProps({
//   projectOptions: {
//     type: Array,
//     required: true,
//     default: [],
//   },
// });

const { proxy } = getCurrentInstance();
const emit = defineEmits(["ok"]);
const visible = ref(false);
const loading = ref(false);
const active = ref(0);
// const
const state = reactive({
  typeForm: {
    dataType: "dom",
  },
  projectId: null,
  dataDate: null,
  infoForm: {},
  uploadFile: null,
  progress: 0,
  overtime: 0,
  complete: true,
  uploadCancel: false,
  uploadState: 0, // 0 未开始，1 上传中， 2 上传出错，3 上传被取消， 4上传成功
  errorMsg: "",
  alertShow: false,
  alertMsg: "",
});
let uploaderInstance;

const options = reactive({
  target: import.meta.env.VITE_APP_BASE_API + "/file/fileUpload",
  headers: {
    Authorization: "Bearer " + getToken(),
  },
  testChunks: false,
  singleFile: true,
  autoStart: false,
  simultaneousUploads: 1,
  query: {},
  withCredentials: true,
});
//
const defaultProps = {
  children: "children",
  label: "label",
  disabled: "disabled",
};
// 项目树数据
const treeData = ref([
{
    id: 1,
    label: "内蒙古",
    children: [
      {
        id: 11,
        label: "呼和浩特市",
        children: [
          {
            id: 101,
            label: "新城区",
          },
          {
            id: 102,
            label: "回民区",
          },
          {
            id: 103,
            label: "玉泉区",
          },
        ],
      },
      {
        id: 22,
        label: "巴彦淖尔市",
        children: [
          {
            id: 201,
            label: "临河区",
            children: [
              {
                id: 2011,
                label: "宏燃煤矿",
                children: [
                  {
                    id: 20111,
                    label: "日常上报数据",
                    children: [
                      {
                        id: 201111,
                        label: "卫星数据",
                        children: [
                          {
                            id: 2011111,
                            label: "卫星数据",
                          },
                        ],
                      },
                      {
                        id: 201112,
                        label: "无人机点云数据",
                        children: [
                          {
                            id: 2011121,
                            label: "地面数据",
                          },
                        ],
                      },
                      {
                        id: 201113,
                        label: "无人机正摄",
                        children: [
                          {
                            id: 2011131,
                            label: "雷达数据",
                          },
                        ],
                      },
                      {
                        id: 201114,
                        label: "三维模型",
                        children: [
                          {
                            id: 2011141,
                            label: "雷达数据",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 20112,
                    label: "日常监测报告",
                    children: [

                    ],
                  },
                  {
                    id: 20113,
                    label: "预警结果数据",
                    children: [
                      {
                        id: 201131,
                        label: "卫星预警结果范围",
                        children: [],
                      },
                      {
                        id: 201132,
                        label: "无人机预警范围",
                        children: [],
                      },
                      {
                        id: 201133,
                        label: "物联网预警范围",
                        children: [],
                      },
                      {
                        id: 201134,
                        label: "预警PDF范围",
                        children: [],
                      },
                      {
                        id: 201135,
                        label: "预警时物联网数据",
                        children: [],
                      }
                    ],

                  },
                  {
                    id: 20114,
                    label: "CAD类数据",
                    children: [
                      {
                        id: 201141,
                        label: "CAD",
                      },
                    ],
                  },
                  {
                    id: 20115,
                    label: "初设信息数据",
                    children: [
                      {
                        id: 201151,
                        label: "初设信息数据",
                      },
                    ],
                  },
                  {
                    id: 20116,
                    label: "物联网阈值数据",
                    children: [
                      {
                        id: 201161,
                        label: "物联网阈值数据",
                      },
                    ],
                  },
                  {
                    id: 20117,
                    label: "预警处理报告数据",
                    children: [
                      {
                        id: 201171,
                        label: "预警处理报告数据",
                      },
                    ],
                  }
                ]
              },
            ]
          },
          {
            id: 202,
            label: "五原区",
          },
          {
            id: 203,
            label: "磴口县",
          },
        ],
      },
      {
        id: 33,
        label: "通辽市",
        children: [
          {
            id: 301,
            label: "科尔沁区",
          },
          {
            id: 302,
            label: "科尔沁左翼中旗",
          },
          {
            id: 303,
            label: "科尔沁左翼后旗",
          },

        ],
      },


    ],
  }
]); // 创建一个空数组来存储树形结构的数据

const opened = () => {
  nextTick(() => {
    if (!uploaderInstance) {
      uploaderInstance = uploaderRef.value.uploader;
    }
  });
};

const onFileAdded = async (file) => {
  console.log("文件选中了", file);
  const params = {
    projectId: state.typeForm.projectId,
    fileName: file.name,
    dataType: state.typeForm.dataType,
    size: file.size,
  };
  // 检查数据是否已经存在
  try {
    // await isDataExist(params);
  } catch (error) {
    // proxy.$modal.msgError(`您上传的数据已在项目中存在！`);
    return false;
  }
  // let result = await isDataExist(params);
  // if (result.data) {
  //   proxy.$modal.msgError(`您上传的数据已在项目中存在！`);
  //   return false;
  // }
  state.alertShow = false;
  // options.query.dataType = state.typeForm.dataType;
  const extName = getFileExtension(file.name);
  if (["dom", "dem"].includes(state.typeForm.dataType)) {
    if (["tif", "tiff"].includes(extName)) {
      state.uploadFile = file;
      state.infoForm.dataName = file.name;
      state.infoForm.fileName = file.name;
      proxy.$refs["infoFormRef"].validateField("fileName");
      const blob = await fileToBlob(file.file);
      fromBlob(blob)
        .then(async (tiff) => {
          console.log("tiff", tiff);
          const image = await tiff.getImage();
          // when we are actually dealing with geo-data the following methods return
          // meaningful results:
          const origin = image.getOrigin();
          const resolution = image.getResolution();
          const bbox = image.getBoundingBox();
          if (bbox && bbox.length === 4) {
            state.infoForm.maxLongitude = bbox[2];
            state.infoForm.minLongitude = bbox[0];
            state.infoForm.maxLatitude = bbox[3];
            state.infoForm.minLatitude = bbox[1];
          }
        })
        .catch((err) => {
          state.alertShow = true;
          state.alertMsg = "无法识别tiff文件投影信息";
        });
    } else {
      proxy.$modal.msgError(`请选择正确的tiff格式的文件`);
      return false;
    }
  } else if (state.typeForm.dataType === "vector") {
    if (["zip", "kml"].includes(extName)) {
      // 支持压缩包 "application/x-zip-compressed" 和 kml文件
      state.uploadFile = file;
      state.infoForm.dataName = file.name;
      state.infoForm.fileName = file.name;
      proxy.$refs["infoFormRef"].validateField("fileName");
    } else {
      proxy.$modal.msgError(`请选择正确的文件格式`);
      return false;
    }
  } else if (state.typeForm.dataType === "tiles3d") {
    if (["zip"].includes(extName)) {
      state.uploadFile = file;
      state.infoForm.dataName = file.name;
      state.infoForm.fileName = file.name;
      proxy.$refs["infoFormRef"].validateField("fileName");
    } else {
      proxy.$modal.msgError(`请选择正确的文件格式`);
      return false;
    }
  } else if (state.typeForm.dataType === "osgb") {
    if (["zip"].includes(extName)) {
      state.uploadFile = file;
      state.infoForm.dataName = file.name;
      state.infoForm.fileName = file.name;
      proxy.$refs["infoFormRef"].validateField("fileName");
    } else {
      proxy.$modal.msgError(`请选择正确的文件格式`);
      return false;
    }
  } else if (state.typeForm.dataType === "las") {
    // 点云
    if (extName === "las") {
      state.uploadFile = file;
      state.infoForm.dataName = file.name;
      state.infoForm.fileName = file.name;
      proxy.$refs["infoFormRef"].validateField("fileName");
    } else {
      proxy.$modal.msgError(`请选择正确的文件格式`);
      return false;
    }
  } else if (state.typeForm.dataType === "cad") {
    // cad文件
    if (extName === "dwg" || extName === "dxf") {
      state.uploadFile = file;
      state.infoForm.dataName = file.name;
      state.infoForm.fileName = file.name;
      proxy.$refs["infoFormRef"].validateField("fileName");
    } else {
      proxy.$modal.msgError(`请选择正确的文件格式`);
      return false;
    }
  }
};
const complete = () => {
  state.uploadState = 4;
};
const fileComplete = () => {
  console.log("file complete", arguments);
};

const fileProgress = (rootFile, file, chunk) => {
  state.progress = Number((uploaderInstance.progress() * 100).toFixed(2));
};

const fileError = (rootFile, file, message, chunk) => {
  state.uploadState = 2;
  try {
    const result = JSON.parse(message);
    state.errorMsg = result.msg;
  } catch (error) {
    state.errorMsg = message;
  }
  // uploaderInstance.cancel();
  // state.alertShow = false;
  // state.errorMsg = message;
};

const fileSuccess = (rootFile, file, message, chunk) => {
  // console.log("上传成功", { rootFile, file, message, chunk });
  const result = JSON.parse(message);
  if (result.code === 200) {
    // state.infoForm.dataFormat = result.data.dataFormat;
    // saveData(result.data.url);
    console.log("上传成功", { rootFile, file, message, chunk });
  } else {
    console.log("失败原因", result);
    state.uploadState = 3;
    state.errorMsg = result.msg;
    uploaderInstance.cancel();
  }
};

const handleRetry = () => {
  uploaderInstance.upload();
};

const typeRules = {
  projectId: [{ required: true, message: "请选择所在项目" }],
  dataType: [{ required: true, message: "请选择数据类型" }],
};

const infoRules = {
  dataName: [{ required: true, message: "请输入文件名称" }],
  fileName: [{ required: true, message: "请选择上传文件" }],
  // fileName: [{ required: true, message: "请选择坐标系" }],
};
const uploaderRef = ref(null);

const show = (projectId) => {
  state.projectId = projectId;
  state.typeForm.projectId = projectId;
  visible.value = true;
};

const cancelUpload = () => {
  proxy.$modal.confirm("是否取消上传操作？").then(function () {
    uploaderInstance.cancel();
    state.uploadState = 3;
    state.uploadFile = null;
    state.infoForm.fileName = null;
    state.errorMsg = "用户主动取消";
    state.alertShow = false;
  });
};

const cancel = () => {
  console.log("cancel==============================");
  if (state.uploadState != 0) {
    emit("ok");
  }
  proxy.resetForm("typeFormRef");
  proxy.resetForm("infoFormRef");
  state.typeForm = {};
  state.infoForm = {};
  state.progress = 0;
  active.value = 0;
  visible.value = false;
  state.uploadState = 0;
  uploaderInstance = null;
  state.uploadFile = null;
  state.alertShow = false;
  state.projectId = null;
};

const handleNextStep = () => {
  if (active.value === 0) {
    proxy.$refs["typeFormRef"].validate((valid) => {
      if (valid) {
        active.value = 1;
        console.log("数据类型", state.typeForm.dataType);
      }
    });
  } else if (active.value === 1) {
    // if (state.alertShow) {
    //   return;
    // }

    proxy.$refs["infoFormRef"].validate(async (valid) => {
      if (valid) {
        const params = {
          projectId: state.typeForm.projectId,
          fileName: state.infoForm.fileName,
          dataType: state.typeForm.dataType,
          size: state.uploadFile.size,
        };
        try {
          await isDataExist(params);
          if (uploaderInstance && uploaderInstance.getSize() > 0) {
            options.query.dataType = state.typeForm.dataType;
            options.query.projectId = state.typeForm.projectId;
            options.query.dataName = state.infoForm.dataName;
            options.query.size = state.uploadFile.size;
            options.query.remark = state.infoForm.remark;
            options.query.createId = useUserStore().id;
            options.query.createName = useUserStore().name;
            options.query.fileName = state.infoForm.fileName;

            uploaderInstance.upload();
            state.uploadState = 1;
          }
          state.progress = 0;
          active.value = 2;
        } catch (error) {
          // proxy.$modal.msgError(`您上传的数据已在项目中存在！`);
          return;
        }
      }
    });
  }
};

const uploadAgain = () => {

  proxy.resetForm("typeFormRef");
  proxy.resetForm("infoFormRef");
  state.typeForm = {};
  state.infoForm = {};
  state.progress = 0;
  active.value = 0;
  state.uploadState = 0;
  uploaderInstance.cancel();
  state.uploadFile = null;
};

const handlePreStep = () => {
  active.value--;
};

const parseFilesize = (size) => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}K`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)}M`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)}G`;
  }
};

const saveData = (url) => {
  const params = {
    ...state.typeForm,
    ...state.infoForm,
    size: state.uploadFile.size,
    link: url,
    datumPlane: "WGS_1984",
    spheroid: " WGS 84",
  };
  // addData(params).then((res) => {
  //   console.log("保存结果", res);
  // });
};
defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
:deep(.el-radio.is-bordered) {
  margin-bottom: 8px;
}

.form-block {
  margin-top: 24px;
  box-sizing: border-box;
  padding: 0px 24px;

  .upload-tips {
    margin-top: 4px;
    color: rgba($color: #000000, $alpha: 0.55);
    line-height: normal;
  }

  .uploader-block {
    width: 100%;

    .uploader-drop {
      // height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fafafa;
      border-radius: 4px;

      .el-icon--upload {
        font-size: 54px;
        color: var(--el-text-color-placeholder);
      }

      div {
        text-align: center;
      }

      .uploader-btn {
        border: 0px;
        color: var(--el-color-primary);
      }

      .uploader-btn:hover {
        color: var(--el-color-primary-light-4);
        background-color: transparent;
      }
    }
  }

  .upload-progress {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-txt {
      margin-top: 12px;
      font-size: 20px;
      color: var(--el-text-color-primary);
    }

    &-memo {
      margin-top: 16px;
      font-size: var(--el-font-size-base);
      color: var(--el-text-color-regular);
      display: flex;
      align-items: center;

      a {
        margin: 0px 4px;
      }

      &-msg {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

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
