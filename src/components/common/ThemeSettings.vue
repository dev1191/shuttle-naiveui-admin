<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { NSpace, NText, NSwitch, NColorPicker, NSlider } from 'naive-ui'
import LanguageSwitcher from './LanguageSwitcher.vue'

const themeStore = useThemeStore()

const swatches = [
  '#3a8696',
  '#18a058',
  '#413bff',
  '#f0a020',
  '#d03050',
  '#8a2be2',
  '#e91e63',
  '#9c27b0',
  '#000000',
  '#615FFF',
  '#00B8DB',
  '#FF0055',
  '#FF8000',
  '#a7fb00',
  '#facc15',
  '#001529'
]
</script>

<template>
  <div class="p-4">
    <NSpace vertical>
      <NText strong>Language</NText>
      <LanguageSwitcher />

      <NText strong class="mt-4">Theme Mode</NText>
      <NSpace align="center">
        <NText>Light</NText>
        <NSwitch :value="themeStore.isDark" @update:value="themeStore.toggleTheme" />
        <NText>Dark</NText>
      </NSpace>

      <NText strong class="mt-4">Primary Color</NText>
      <NColorPicker
        :value="themeStore.primaryColor"
        :swatches="swatches"
        @update:value="themeStore.setPrimaryColor"
      />

      <NText strong class="mt-4">Border Radius ({{ themeStore.borderRadius }}px)</NText>
      <NSlider
        :value="themeStore.borderRadius"
        :min="0"
        :max="20"
        :step="1"
        @update:value="themeStore.setBorderRadius"
      />
    </NSpace>
  </div>
</template>
