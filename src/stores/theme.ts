import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
    const themeMode = ref<ThemeMode>('auto')
    const preferredDark = usePreferredDark()
    const primaryColor = ref(import.meta.env.VITE_DEFAULT_PRIMARY_COLOR || '#3a8696')
    const borderRadius = ref(Number(import.meta.env.VITE_DEFAULT_BORDER_RADIUS) || 6)
    const sidebarCollapsed = ref(false)
    const language = ref(import.meta.env.VITE_DEFAULT_LANGUAGE || 'en')

    const isDark = computed(() => {
        if (themeMode.value === 'auto') {
            return preferredDark.value
        }
        return themeMode.value === 'dark'
    })

    function setPrimaryColor(color: string) {
        primaryColor.value = color
    }

    function setBorderRadius(radius: number) {
        borderRadius.value = radius
    }

    function setSidebarCollapsed(collapsed: boolean) {
        sidebarCollapsed.value = collapsed
    }

    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    function setThemeMode(mode: ThemeMode) {
        themeMode.value = mode
    }

    function toggleTheme() {
        themeMode.value = isDark.value ? 'light' : 'dark'
    }

    // Watch isDark and update document class
    watch(isDark, (val) => {
        if (val) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, { immediate: true })

    return {
        themeMode,
        language,
        isDark,
        primaryColor,
        borderRadius,
        sidebarCollapsed,
        setPrimaryColor,
        setBorderRadius,
        setSidebarCollapsed,
        toggleSidebar,
        setThemeMode,
        toggleTheme
    }
}, {
    persist: {
        key: 'theme-store',
        storage: localStorage,
        pick: ['sidebarCollapsed', 'primaryColor', 'borderRadius', 'themeMode', 'language']
    }
});