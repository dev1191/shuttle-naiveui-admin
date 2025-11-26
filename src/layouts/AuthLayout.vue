<template>
  <n-layout
    class="min-h-screen w-full"
  >
    <div class="relative p-6 z-1 dark:bg-gray-900 sm:p-0" :style="{ backgroundColor: bgColor }">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <RouterView />
        </div>

        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 dark:bg-white/5 lg:grid"
          :style="{ backgroundColor: sideBgColor }"
        >
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img
                  width="{231}"
                  height="{48}"
                  src="@/assets/images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Lighten the primary color for the main background
const bgColor = computed(() => {
  const color = themeStore.primaryColor
  // Add opacity to make it lighter
  return `${color}15` // 15 is hex for ~8% opacity
})

// Darken the primary color for the side panel
const sideBgColor = computed(() => {
  const color = themeStore.primaryColor
  // Convert hex to RGB and darken
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Darken by reducing RGB values
  const darkenFactor = 0.15
  const darkR = Math.floor(r * darkenFactor)
  const darkG = Math.floor(g * darkenFactor)
  const darkB = Math.floor(b * darkenFactor)
  
  return `rgb(${darkR}, ${darkG}, ${darkB})`
})
</script>
