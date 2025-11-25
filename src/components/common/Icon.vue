<script setup lang="ts">
import { NIcon } from 'naive-ui'
import * as LucideIcons from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  name: string
  size?: number | string
  color?: string
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 2
})

const iconComponent = computed(() => {
  // @ts-ignore - Lucide icons are dynamically accessed
  const Icon = LucideIcons[props.name]
  return Icon
})

const iconSize = computed(() => {
  return typeof props.size === 'number' ? props.size : parseInt(props.size)
})
</script>

<template>
  <NIcon :size="iconSize" :color="color">
    <component 
      :is="iconComponent" 
      :size="iconSize"
      :stroke-width="strokeWidth"
    />
  </NIcon>
</template>
