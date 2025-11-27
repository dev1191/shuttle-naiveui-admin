<script setup lang="ts">
import { NDrawer, NDrawerContent } from 'naive-ui'
import ThemeSettings from '@/components/common/ThemeSettings.vue'
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

const show = defineModel<boolean>('show')

const themeStore = useThemeStore()
const placement = computed(() => themeStore.language === 'ar' ? 'left' : 'right')
</script>

<template>
  <NDrawer v-model:show="show" width="300" :placement="placement">
    <NDrawerContent title="Theme Settings">
      <ThemeSettings />
    </NDrawerContent>
  </NDrawer>
</template>
