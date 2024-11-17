<template>
  <chart-card-layout class="chart" title="雷达图像">
    <template #extra>
      <div class="filter">
        <el-link type="primary" :underline="false" @click="onRefresh">
          <el-icon size="18px"> <Refresh /> </el-icon>
        </el-link>

        <el-dropdown size="small" @command="onChange">
          <el-link type="primary" :underline="false">
            {{ typeDict[imgType] }} <el-icon size> <ArrowDown /> </el-icon>
          </el-link>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">全部</el-dropdown-item>
              <el-dropdown-item command="00">形变</el-dropdown-item>
              <el-dropdown-item command="01">复散射</el-dropdown-item>
              <el-dropdown-item command="10">连续形变</el-dropdown-item>
              <el-dropdown-item command="04">连续形变速度</el-dropdown-item>
              <el-dropdown-item command="05">区间形变差值</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <div class="content">
      <div class="list">
        <div class="th">
          <div class="cell center" style="flex: 1.2">类型</div>
          <div class="cell center" style="flex: 0.8">序号</div>
          <div class="cell center" style="flex: 1.5">时间</div>
          <div class="cell center filter">
            <el-dropdown size="small" @command="onStateChange">
              <el-link type="primary" :underline="false">
                状态<el-icon> <ArrowDown /> </el-icon>
              </el-link>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="skip,success,fail">
                    全部
                  </el-dropdown-item>
                  <el-dropdown-item command="success">成功</el-dropdown-item>
                  <el-dropdown-item command="fail">失败</el-dropdown-item>
                  <el-dropdown-item command="skip">跳过</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="cell center">时间间隔</div>
          <div class="cell center">操作</div>
        </div>
        <div
          class="tb"
          v-loading="state.loading"
          element-loading-background="rgba(0, 0, 0, 0.6)"
        >
          <div class="trs">
            <div class="tr" v-for="(item, index) in currentList" :key="index">
              <div class="cell center" style="flex: 1.2">
                {{ typeDict[item.type] }}
              </div>
              <div class="cell center" style="flex: 0.8">
                {{ item.sequence }}
              </div>
              <div class="cell center" style="flex: 1.5">
                {{ dayjs(item.ts).format("MM-DD HH:mm:ss") }}
              </div>
              <div class="cell center">{{ stateDict[item.status] }}</div>
              <div class="cell center">{{ timeDict[item.timeUnit] }}</div>
              <div class="cell center">
                <el-link @click="onClick(item)" size="small" type="primary"
                  >加载</el-link
                >
              </div>
            </div>
          </div>
        </div>
        <div class="pager">
          <el-pagination
            :page-size="6"
            layout="total,prev, pager, next"
            small
            :total="state.pagination.total"
            @change="pagerChange"
          />
        </div>
      </div>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { watch, reactive, ref, computed } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
import { getRadarImgList } from "@/api/slope";
import useUserStore from "@/store/modules/user";
import { dayjs } from "element-plus";
import { ArrowDown, Refresh } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const userStore = useUserStore();

const state = reactive({
  scroll: true,
  dataList: [],
  pagination: {
    page: 1,
    total: 0,
  },
  loading: false,
});
const typeDict = {
  all: "全部类型",
  "00": "形变",
  "01": "复散射",
  "04": "连续形变速度",
  "05": "区间形变速度",
  10: "连续形变",
};
const timeDict = {
  "00": "默认",
  "02": "30分钟",
  "03": "1小时",
  "04": "1天",
  "05": "1周",
  "06": "1月",
};
const stateDict = {
  skip: "跳过",
  success: "成功",
  fail: "失败",
};

const emit = defineEmits(["onClick"]);
const currentList = ref([]);

const imgType = ref("all");
// const stateVal = ref("");
let stateVal = "skip,success,fail";

const pagerChange = (page) => {
  const startIndex = (page - 1) * 6;
  const endIndex = page * 6;
  currentList.value = state.dataList.slice(startIndex, endIndex);
};
const onClick = (row) => {
  if (row.status === "success") {
    emit("onClick", row);
  } else {
    ElMessageBox.alert("未成功的图像无法加载，请重新选择！", "警告", {
      confirmButtonText: "确认",
      callback: (action) => {},
    });
  }
};

const onChange = (command) => {
  imgType.value = command;
  getList();
};

const onStateChange = (command) => {
  stateVal = command;
  getList();
};

const onRefresh = () => {
  getList();
};

const getList = () => {
  const startDateTime = dayjs().subtract(7, "d").format("YYYY-MM-DD HH:mm:ss");
  const endDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let type = "01,10,04,05";
  if (imgType.value !== "all") {
    type = imgType.value;
  }
  const params = {
    deviceId: "ARCSAR_20231010_624365",
    projectId: userStore.projects[0],
    status: stateVal,
    page: 1,
    pageRowSize: 2000,
    type,
    startDateTime,
    endDateTime,
  };
  state.loading = true;
  getRadarImgList(params)
    .then((res) => {
      console.log("雷达图像列表", res);
      const { data, code } = res;
      if (code === 0) {
        const list = [];
        data.dataset.forEach((item) => {
          const row = {};
          item.forEach((tem, i) => {
            row[data.columns[i].name] = tem;
          });
          list.push(row);
        });

        state.pagination.total = data.count;
        state.dataList = list;
        pagerChange(1);
      }
    })
    .finally((res) => {
      state.loading = false;
    });
};
getList();
</script>

<style lang="less" scoped>
.chart {
  box-sizing: border-box;
  height: 300px;
  :deep(.el-pagination) {
    button {
      background: transparent !important;
      color: #fff;
    }
    li {
      background: transparent;
      color: #fff;
    }

    .el-pagination__total {
      color: #fff;
    }

    .number {
      color: rgba(255, 255, 255, 0.85);
    }

    .is-active {
      color: rgba(255, 255, 255, 1);
    }
  }
  .filter {
    display: flex;
    align-items: center;
    gap: 8px;
    i {
      margin-left: 4px;
      color: #1fc6ff;
    }
    div {
      color: #b4c0cc;
      // width: 60px;
      box-sizing: border-box;
      height: 28px;
      line-height: 28px;
      // background: #0f2839;
      text-align: center;
      margin: 0px 4px;
      pointer-events: all;

      a {
        color: #1fc6ff;
        display: inline-flex;
        align-items: center;
        // text-decoration: underline;
      }

      &.selected {
        border-top: 1px solid #1fc6ff;
        background: linear-gradient(
          180deg,
          rgba(31, 198, 255, 0.32) 0%,
          rgba(31, 198, 255, 0) 100%
        );
      }
    }

    div:hover {
      cursor: pointer;
    }
  }
  .content {
    box-sizing: border-box;
    height: 100%;
    color: #fff;
    padding: 0px 12px;
    display: flex;
    flex-direction: column;

    .list {
      box-sizing: border-box;
      font-size: 12px;
      padding: 0px 0px;
      flex: 1;
      // overflow: auto;

      display: flex;
      flex-direction: column;
      .th,
      .tr {
        height: 32px;
        line-height: 32px;
        display: flex;
        align-items: stretch;

        color: #b4c0cc;
        padding: 0px 8px;

        .cell {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          a {
            color: #1fc6ff;
          }

          &.center {
            text-align: center;
          }

          &.filter {
            display: flex;
          }
        }

        .cell:nth-child(2) {
          flex: none;
          width: 80px;
        }
      }

      .th {
        background: rgba(31, 198, 255, 0.2);
      }

      .tr {
        color: #fff;
      }
      .tr:hover {
        cursor: pointer;
        border-left: 2px solid #1fc6ff;
        background: rgba(31, 198, 255, 0.2);
      }
      .tb {
        flex: 1;
        position: relative;
        .trs {
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 100%;
          overflow-y: auto;
        }
      }

      .pager {
        display: flex;
        justify-content: flex-end;
        padding: 8px;
      }
    }
  }
}
</style>
