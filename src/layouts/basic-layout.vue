<template>
  <chart-card-layout class="chart" title="生态退化预警信息">
    <div class="warning-list">


      <!-- 统计信息 -->
      <div class="stats">
        <div class="stat-item">
          <div class="stat-title">生态退化个数</div>
          <div class="stat-value">{{ data.length }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-title">待处理个数</div>
          <div class="stat-value pending">
            {{ pendingCount }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-title">已处理个数</div>
          <div class="stat-value processed">
            {{ processedCount }}
          </div>
        </div>
      </div>

      <!-- 表格数据 -->
      <div class="table">
        <!-- 表格头 -->
        <div class="table-header">
          <div class="table-cell">风险位置</div>
          <div class="table-cell">风险面积</div>
          <div class="table-cell">风险等级</div>
          <div class="table-cell">风险日期</div>
          <div class="table-cell">风险处置情况</div>
        </div>
        <!-- 表格内容 -->
        <div class="table-body">
          <div class="table-row" v-for="(row, index) in data" :key="index">
            <div class="table-cell" style="font-size: 12px;">
              {{ row.location }}
            </div>
            <div class="table-cell">{{ row.area }}</div>
            <div class="table-cell">{{ row.level }}</div>
            <div class="table-cell" :class="{ 'highlight-date': row.status === '待处置' }">
              {{ row.date }}
            </div>
            <div class="table-cell">
              <!-- 使用 el-button 显示按钮 -->
              <el-button v-if="row.status === '待处置'" type="danger" size="small" @click="markAsProcessed(index)">
                {{ row.status }}
              </el-button>
              <span v-else class="status-text processed">
                {{ row.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </chart-card-layout>
</template>


<script setup>
import { reactive, computed } from "vue";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式
// 表格数据
const data = reactive([
  {
    location: `39°17'15\"N, 111°17'15\"N`,
    area: 240,
    level: "2级退化",
    date: "2024年6月7日",
    status: "已处置",
  },
  {
    location: `39°17'15\"N, 111°17'15\"N`,
    area: 200,
    level: "3级退化",
    date: "2024年7月12日",
    status: "待处置",
  },
  {
    location: `39°17'15\"N, 111°17'15\"N`,
    area: 250,
    level: "1级退化",
    date: "2024年9月12日",
    status: "待处置",
  },
  {
    location: `39°17'15\"N, 111°17'15\"N`,
    area: 320,
    level: "4级退化",
    date: "2024年10月1日",
    status: "已处置",
  },
]);

// 统计数量
const pendingCount = computed(() => data.filter((item) => item.status === "待处置").length);
const processedCount = computed(() => data.filter((item) => item.status === "已处置").length);

// 更新状态为“已处置”
const markAsProcessed = (index) => {
  data[index].status = "已处置";
};
</script>

<style lang="less">
.chart {
  box-sizing: border-box;
  padding: 8px;

  .warning-list {
    width: 106%;
    position: relative;
    right: 15px;
    .stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .stat-item {
        flex: 1;
        text-align: center;
        padding: 10px;
        background-color: #061235;
        margin: 0 5px;
        border-radius: 8px;
        color: #fff;

        .stat-title {
          font-size: 14px;
          color: #aaa;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
        }

        .stat-value.pending {
          color: #ff4242;
          /* 待处理状态为红色 */
        }

        .stat-value.processed {
          color: #1fffc7;
          /* 已处理状态为绿色 */
        }
      }
    }

    .table-body {
      max-height: 100px;
      /* 限制表格最大高度 */
      overflow-y: auto;
      /* 启用垂直滚动条 */
      scrollbar-width: thin;
      scrollbar-color: #1fffc7 #061235;
      &::-webkit-scrollbar {
        width: 6px;
        /* 滚动条宽度 */
      }

      &::-webkit-scrollbar-thumb {
        background-color: #1fffc7;
        /* 滚动条滑块颜色 */
        border-radius: 10px;
        /* 圆角 */
      }

      &::-webkit-scrollbar-track {
        background-color: #061235;
        /* 滚动条轨道颜色 */
      }
    }

    .table-cell {
      pointer-events: auto;
      /* 确保按钮点击事件正常 */
      position: relative;
      /* 修复按钮可能受影响的问题 */
    }
  }
}
</style>
