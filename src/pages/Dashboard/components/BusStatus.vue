<script setup lang="ts">
import { NCard, NProgress, NSkeleton } from "naive-ui";

defineProps<{
  loading?: boolean;
}>();

const stats = [
  { label: "On Route", value: 45, color: "#18a058", count: 12 },
  { label: "Idle / Garage", value: 30, color: "#f0a020", count: 8 },
  { label: "Maintenance", value: 15, color: "#d03050", count: 4 },
  { label: "Breakdown", value: 10, color: "#2080f0", count: 2 },
];
</script>

<template>
  <NCard title="Fleet Status" :bordered="false" class="h-full rounded-2xl">
    <div v-if="loading" class="flex flex-col justify-center h-full gap-6">
      <div v-for="i in 4" :key="i" class="w-full">
        <NSkeleton text :repeat="1" width="60%" class="mb-2" />
        <NSkeleton height="10px" />
      </div>
    </div>
    <div v-else class="flex flex-col justify-center h-full gap-6">
      <div v-for="item in stats" :key="item.label" class="w-full">
        <div class="flex justify-between mb-1">
          <span class="text-gray-600 font-medium">{{ item.label }}</span>
          <span class="font-bold">{{ item.count }} Buses</span>
        </div>
        <NProgress
          type="line"
          :percentage="item.value"
          :color="item.color"
          :height="10"
          border-radius="4px"
          processing
        />
      </div>
    </div>
  </NCard>
</template>
