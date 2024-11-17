<template>
  <chart-card-layout class="chart" title="矿山实景">
    <div class="chart-content">
      <!-- 使用 Element Plus 的 ElCarousel 实现轮播 -->
      <el-carousel
        :interval="3000"
        arrow="hover"
        height="150px"
        autoplay
        indicator-position="outside"
      >
        <el-carousel-item
          v-for="(img, index) in images"
          :key="index"
        >
          <img :src="img" :alt="'图片' + (index + 1)" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </chart-card-layout>
</template>

<script setup>
import { ref } from "vue";
import ChartCardLayout from "@/components/ChartCardLayout.vue";

const images = ref([
  "https://bpic.588ku.com/back_origin_min_pic/22/08/05/9a2e74e45ab4c9e3fbfbe20ffda019ca.jpg",
  "https://ts1.cn.mm.bing.net/th/id/R-C.6928e155a4db7e0fc316b761adb669a7?rik=bWJG04xih%2fgvhw&riu=http%3a%2f%2fimg.mp.sohu.com%2fupload%2f20180707%2fa73c050ae041468c99dbc0cf1b4f219b.jpg&ehk=u6%2fewBiekdSQGlmAmAiJ12fc6NshspbYDefVTxOiEYw%3d&risl=&pid=ImgRaw&r=0",
  "https://photo-static-api.fotomore.com/creative/vcg/veer/612/veer-103118048.jpg",
  "https://www.kuangyeyuan.com/files/default/2018/11-30/1644579d35bd656374.jpg",
]);
</script>

<style scoped lang="less">
.chart {
  height: 220px;
  display: flex;
  align-items: left;
  justify-content: center;
}

.chart-content {
  width: 400px;
  max-width: 600px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>
