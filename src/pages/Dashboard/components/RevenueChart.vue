<script setup lang="ts">
import { ref, computed } from "vue";
import { NCard, NSelect, NSkeleton } from "naive-ui";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import type { EChartsOption } from "echarts";
import { useThemeStore } from "@/stores/theme";

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

defineProps<{
  loading?: boolean;
}>();

const themeStore = useThemeStore();
const timeRange = ref("7d");
const options = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Year", value: "1y" },
];

// Helper function to adjust color brightness
const adjustColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

// Mock data - replace with real API data
const chartData = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [4200, 6500, 5500, 8000, 7000, 9200, 4500],
  },
  "30d": {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    revenue: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5000) + 3000),
  },
  "1y": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    revenue: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 71000, 75000, 69000, 78000],
  },
};

const chartOption = computed<EChartsOption>(() => {
  const data = chartData[timeRange.value as keyof typeof chartData];
  
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const item = params[0];
        return `${item.name}<br/>Revenue: $${item.value.toLocaleString()}`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.labels,
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: "#e0e0e0",
        },
      },
      axisLabel: {
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#666",
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
      },
      splitLine: {
        lineStyle: {
          color: "#f0f0f0",
        },
      },
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        data: data.revenue,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: themeStore.primaryColor },
              { offset: 1, color: adjustColor(themeStore.primaryColor, 20) },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: adjustColor(themeStore.primaryColor, -20) },
                { offset: 1, color: adjustColor(themeStore.primaryColor, 10) },
              ],
            },
          },
        },
        barWidth: "60%",
      },
    ],
  };
});
</script>

<template>
  <NCard title="Revenue Analytics" :bordered="false" class="h-full rounded-2xl">
    <template #header-extra>
      <NSelect v-model:value="timeRange" :options="options"  class="w-50" :disabled="loading" />
    </template>
    
    <div v-if="loading" class="h-80 flex items-end justify-around gap-4 p-8">
      <NSkeleton height="60%" width="10%" />
      <NSkeleton height="80%" width="10%" />
      <NSkeleton height="70%" width="10%" />
      <NSkeleton height="95%" width="10%" />
      <NSkeleton height="45%" width="10%" />
      <NSkeleton height="85%" width="10%" />
      <NSkeleton height="65%" width="10%" />
    </div>
    <VChart v-else :option="chartOption" autoresize class="h-80" />
  </NCard>
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
