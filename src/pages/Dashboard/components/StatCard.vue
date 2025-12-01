<script setup lang="ts">
import { NCard, NIcon, NSkeleton } from "naive-ui";
import { type Component } from "vue";

defineProps<{
  title: string;
  value: string | number;
  icon: Component;
  iconColor?: string;
  trend?: "up" | "down";
  trendValue?: string;
  footer?: string;
  loading?: boolean;
}>();
</script>

<template>
  <NCard size="small" class="stat-card hover:shadow-md transition-shadow duration-300 cursor-pointer" :bordered="false">
    <div v-if="loading">
      <NSkeleton text :repeat="1" />
      <NSkeleton text :repeat="1" width="60%" class="mt-2" />
      <NSkeleton text :repeat="1" width="40%" class="mt-4" />
    </div>
    <div v-else class="flex justify-between items-start">
      <div>
        <p class="text-gray-500 text-sm font-medium mb-1">{{ title }}</p>
        <h3 class="text-2xl font-bold text-gray-800">{{ value }}</h3>
      </div>
      <div 
        class="p-2 rounded-lg bg-opacity-10" 
        :class="iconColor ? '' : 'bg-primary'"
        :style="iconColor ? { backgroundColor: `${iconColor}20`, color: iconColor } : {}"
      >
        <NIcon size="24" :component="icon" />
      </div>
    </div>
    
    <div class="mt-4 flex items-center text-xs" v-if="!loading && (trend || footer)">
      <span 
        v-if="trend" 
        class="flex items-center font-medium mr-2"
        :class="trend === 'up' ? 'text-green-500' : 'text-red-500'"
      >
        {{ trend === 'up' ? '↑' : '↓' }} {{ trendValue }}
      </span>
      <span class="text-gray-400">{{ footer }}</span>
    </div>
  </NCard>
</template>

<style scoped>
.stat-card {
  border-radius: 12px;
}
</style>
