<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import SettingsDrawer from '@/components/common/SettingsDrawer.vue'

const show = ref(false)
</script>

<template>
  <NButton quaternary circle @click="show = true">
    <template #icon>
      <span class="iconify ph--gear size-5"></span>
    </template>
  </NButton>

  <SettingsDrawer v-model:show="show" />
</template>
