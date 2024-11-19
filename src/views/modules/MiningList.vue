<template>
  <chart-card-layout class="chart" title="生态修复实施工程进展">
    <div class="content">
      <!-- 动态渲染每个工程的时间轴 -->
      <div v-for="(project, index) in state.dataList" :key="index" class="project">
        <!-- 工程名称 -->
        <div class="project-title">{{ project.name }}</div>
        <!-- 时间轴 -->
        <el-steps :space="200" direction="horizontal" align-center>
          <el-step
            v-for="(step, i) in project.steps"
            :key="i"
            :title="step.title"
            :description="step.date"
            :status="step.status"
          />
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
        { title: "方案设计", date: "2024-08-01" }, // 当前时间节点
        { title: "项目实施", date: "2024-12-01" },
        { title: "验收完成", date: "2025-09-01" },
      ],
    },
    {
      name: "黑岱沟1期修复工程",
      steps: [
        { title: "可行性研究", date: "2022-06-01" },
        { title: "方案设计", date: "2024-12-19" }, // 当前时间节点
        { title: "项目实施", date: "2025-03-01" },
        { title: "验收完成", date: "2026-07-01" },
      ],
    },
    {
      name: "黑岱沟2期修复工程",
      steps: [
        { title: "可行性研究", date: "2022-01-01" },
        { title: "方案设计", date: "2024-11-19" }, // 当前时间节点
        { title: "项目实施", date: "2025-01-01" },
        { title: "验收完成", date: "2026-06-01" },
      ],
    },
  ],
});

// 动态设置状态
state.dataList.forEach((project) => {
  project.steps.forEach((step) => {
    const stepDate = new Date(step.date);
    if (stepDate < now) {
      step.status = "finish";
    } else if (stepDate.toDateString() === now.toDateString()) {
      step.status = "process";
    } else {
      step.status = "wait";
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
    color: #fff;
    padding: 12px;  
    height: 300px; // 设置固定高度
    overflow-y: auto; // 添加垂直滚动条
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
          color: #fff;
        }

        .el-step__title.is-finish {
          color: #1fc6ff;
        }

        .el-step__title.is-process {
          color: #ffd700;
        }

        .el-step__title.is-wait {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>
