<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { availableLocales } from '@/plugins/i18n'

const themeStore = useThemeStore()

const languages = {
  en: 'English',
  ar: 'Arabic'
}

const options = availableLocales.map(locale => ({
  label: languages[locale as keyof typeof languages] || locale,
  value: locale
}))
</script>

<template>
  <n-select
    v-model:value="themeStore.language"
    :options="options"
    size="small"
    class="w-32"
  />
</template>
