<script setup lang="ts">
import { computed, h } from 'vue'
import { NDropdown, NButton } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/stores/theme'

const themeStore = useThemeStore()

const options = [
  {
    label: 'Light',
    key: 'light',
    icon: () => h('span', { class: 'iconify ph--sun size-5' })
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: () => h('span', { class: 'iconify ph--moon size-5' })
  },
  {
    label: 'System',
    key: 'auto',
    icon: () => h('span', { class: 'iconify ph--desktop size-5' })
  }
]

const currentIcon = computed(() => {
  switch (themeStore.themeMode) {
    case 'light':
      return 'ph--sun'
    case 'dark':
      return 'ph--moon'
    case 'auto':
      return 'ph--desktop'
    default:
      return 'ph--sun'
  }
})

function handleSelect(key: string) {
  themeStore.setThemeMode(key as ThemeMode)
}
</script>

<template>
  <NDropdown :options="options" trigger="click" @select="handleSelect">
    <NButton quaternary circle>
      <template #icon>
        <span :class="['iconify size-5', currentIcon]"></span>
      </template>
    </NButton>
  </NDropdown>
</template>
