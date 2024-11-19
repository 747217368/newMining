<template>
  <chart-card-layout class="chart" title="生态修复实施工程进展">
    <div class="content">
      <!-- 动态渲染每个工程的时间轴 -->
      <div v-for="(project, index) in state.dataList" :key="index" class="project">
        <!-- 工程名称 -->
        <div class="project-title">{{ project.name }}</div>
        <!-- 时间轴 -->
        <el-steps :space="200" direction="horizontal" align-center>
          <el-step v-for="(step, i) in project.steps" :key="i" :title="step.title" :description="step.date"
            :status="step.status" />
        </el-steps>
      </div>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { reactive } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";

const now = new Date(); // 当前时间

// 模拟数据，当前时间在中间节点
const state = reactive({
  dataList: [
    {
      name: "黑岱沟边坡修复工程",
      steps: [
        { title: "可行性研究", date: "2023-09-01" },
        { title: "方案设计", date: "2024-08-01" },
        { title: "项目实施", date: "2024-12-01" },
        { title: "验收完成", date: "2025-09-01" },
      ],
    },
    {
      name: "黑岱沟1期修复工程",
      steps: [
        { title: "可行性研究", date: "2022-06-01" },
        { title: "方案设计", date: "2024-12-19" },
        { title: "项目实施", date: "2025-03-01" },
        { title: "验收完成", date: "2026-07-01" },
      ],
    },
    {
      name: "黑岱沟2期修复工程",
      steps: [
        { title: "可行性研究", date: "2022-01-01" },
        { title: "方案设计", date: "2024-11-19" },
        { title: "项目实施", date: "2025-01-01" },
        { title: "验收完成", date: "2026-06-01" },
      ],
    },
  ],
});


// 动态设置状态
state.dataList.forEach((project) => {
  let hasHighlightedNext = false; // 标记是否已设置黄色节点
  project.steps.forEach((step) => {
    const stepDate = new Date(step.date);
    if (stepDate < now) {
      step.status = "finish"; // 已完成
    } else if (stepDate.toDateString() === now.toDateString()) {
      step.status = "process"; // 当前节点
    } else if (!hasHighlightedNext) {
      step.status = "in-progress"; // 当前时间之后第一个节点
      hasHighlightedNext = true;
    } else {
      step.status = "wait"; // 其他未来节点
    }
  });
});


</script>

<style lang="less" scoped>
.chart {
  box-sizing: border-box;
  margin-top: 10px;

  .content {
    box-sizing: border-box;
    color: #1fc6ff;
    padding: 12px;
    height: 300px; // 设置固定高度
    overflow-y: auto; // 添加垂直滚动条
    text-align: center;

    .project {
      margin-bottom: 24px;

      .project-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .el-steps {
        margin-top: 10px;

        .el-step__title,
        .el-step__description {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: block;
         width: 100px; // 根据实际需求调整宽度
          margin: 0 auto; // 居中对齐
        }


        .el-step__title.is-finish {
          color: #1fffc7; // 已完成绿色
        }

        .el-step__title.is-process {
          color: #ffd700; // 当前节点黄色
        }

        .el-step__title.is-in-progress {
          color: #ffd700; // 当前时间后第一个节点黄色
        }

        .el-step__title.is-wait {
          color: rgba(255, 255, 255, 0.5); // 未来节点灰色
        }


      }
    }
  }
}
</style>
