<script setup lang="ts">
import { NDrawer, NDrawerContent } from 'naive-ui'
import ThemeSettings from '@/components/common/ThemeSettings.vue'

const show = defineModel<boolean>('show')
</script>

<template>
  <NDrawer v-model:show="show" width="300" placement="right">
    <NDrawerContent title="Theme Settings">
      <ThemeSettings />
    </NDrawerContent>
  </NDrawer>
</template>
