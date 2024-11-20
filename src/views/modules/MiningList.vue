<template>
  <chart-card-layout class="chart" title="生态修复实施工程进展">
    <div class="content">
      <!-- 标题行 -->
      <div class="header-row">
        <div class="header-title-left">修复工程名称</div>
        <div class="header-title-right">修复工程时间节点</div>
      </div>
      <!-- 动态渲染每个工程的时间轴 -->
      <div v-for="(project, index) in state.dataList" :key="index" class="project">
        <!-- 左侧：工程名称 -->
        <div class="project-title">{{ project.name }}</div>
        <!-- 右侧：时间轴 -->
        <el-steps style="white-space: nowrap; font-size: 9px;" :space="200" direction="horizontal" align-center>
          <el-step
            v-for="(step, i) in project.steps"
            :key="i"
            :title="step.title"
            :description="step.date"
            :status="step.status"
          >
            <!-- 已完成节点的自定义图标 -->
            <template #icon v-if="step.status === 'finish'">
              <el-icon>
                <Check style="color: #1fffc7 ; size: 16px;" />
              </el-icon>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { reactive } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";
import { ElIcon } from 'element-plus';
import { Check } from '@element-plus/icons-vue';

const now = new Date(); // 当前时间

// 模拟数据，当前时间在中间节点
const state = reactive({
  dataList: [
    {
      name: "黑岱沟边坡修复",
      steps: [
        { title: "可行性研究", date: "2023-09-01" },
        { title: "方案设计", date: "2024-08-01" },
        { title: "项目实施", date: "2024-12-01" },
        { title: "验收完成", date: "2025-09-01" },
      ],
    },
    {
      name: "黑岱沟1期修复",
      steps: [
        { title: "可行性研究", date: "2022-06-01" },
        { title: "方案设计", date: "2024-12-19" },
        { title: "项目实施", date: "2025-03-01" },
        { title: "验收完成", date: "2026-07-01" },
      ],
    },
    {
      name: "黑岱沟2期修复",
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
      step.status = "in-progress"; // 当前时间之后第一个节点，为当前所处阶段
      hasHighlightedNext = true;
    } else {
      step.status = "wait"; // 其他未来节点
    }
  });
});
</script>

<style lang="less">
.chart {
  box-sizing: border-box;
  margin-top: 10px;

  .content {
    box-sizing: border-box;
    color: #1fc6ff;
    padding: 12px;
    height: 300px; // 设置固定高度
    overflow-y: auto; // 添加垂直滚动条

    // 标题行样式
    .header-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      
      border-bottom: 1px solid rgba(255, 255, 255, 0.3); // 分割线
      margin-bottom: 15px;

      .header-title-left {
        flex: 0 0 100px; // 左侧固定宽度
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #1fc6ff;
      }

      .header-title-right {
        flex: 1; // 右侧自适应宽度
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #1fc6ff;
      }
    }

    .project {
      display: flex; // 使用 Flex 布局
      align-items: center;
      margin-bottom: 20px;

      .project-title {
        flex: 0 0 100px; // 左侧固定宽度
        text-align: center;
        font-size: 12px;
        color: #fff;
        font-weight: bold;
      }

      .el-steps {
        flex: 1; // 右侧自适应宽度
        margin-top: 18px;

        .el-step__title,
        .el-step__description {
          padding: 0 !important;
          white-space: nowrap;
          display: block;
          font-size: 14px;
        }
        .el-step__icon {
          width: 25px;
          border-radius: 50%;
        }

        .el-step__title.is-in-progress,
        .el-step__title.is-process,
        .el-step__description.is-in-progress {
          color: #1fc6ff; // 当前时间后第一个节点
        }
        .el-step__title.is-finish,
        .el-step__description.is-finish {
          color: #1fffc7; // 已完成绿色

        }

        .el-step__title.is-wait,
        .el-step__description.is-wait {
          color: rgba(255, 255, 255, 0.5); // 未来节点灰色
        }

        .el-step__icon.is-finish {
          border: 4px solid #1fffc7 !important;
          border-radius: 50%; // 确保描边圆形
          background-color: transparent; // 防止背景遮挡
        }


        .el-step__icon-inner.is-finish {
          // display: none;.
          border: 4px solid #1fffc7 !important;
          /* 隐藏默认的数字或文字 */
        }
      }
    }
  }
}
</style>