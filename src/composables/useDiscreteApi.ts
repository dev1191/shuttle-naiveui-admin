import { enUS, dateEnUS } from 'naive-ui'
import { computed, h } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import type { ConfigProviderProps } from 'naive-ui'
import type { MessageApi, DialogApi, NotificationApi, LoadingBarApi, ModalApi } from 'naive-ui'
import themeOverrides from '@/common/theme/theme-overrides'
import { useThemeStore } from '@/stores/theme'

export function getConfigProviderProps() {
  const themeStore = useThemeStore()

  const configProviderProps = computed<ConfigProviderProps>(() => {
    const primaryColor = themeStore.primaryColor

    // Helper to lighten color for hover state
    const lightenColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16)
      const r = (num >> 16) + Math.round(((255 - (num >> 16)) * percent) / 100)
      const g = ((num >> 8) & 0x00FF) + Math.round(((255 - ((num >> 8) & 0x00FF)) * percent) / 100)
      const b = (num & 0x0000FF) + Math.round(((255 - (num & 0x0000FF)) * percent) / 100)
      return '#' + (0x1000000 + (r < 255 ? r : 255) * 0x10000 + (g < 255 ? g : 255) * 0x100 + (b < 255 ? b : 255)).toString(16).slice(1)
    }

    // Helper to darken color for pressed state
    const darkenColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16)
      const r = (num >> 16) - Math.round(((num >> 16) * percent) / 100)
      const g = ((num >> 8) & 0x00FF) - Math.round((((num >> 8) & 0x00FF) * percent) / 100)
      const b = (num & 0x0000FF) - Math.round(((num & 0x0000FF) * percent) / 100)
      return '#' + (0x1000000 + (r > 0 ? r : 0) * 0x10000 + (g > 0 ? g : 0) * 0x100 + (b > 0 ? b : 0)).toString(16).slice(1)
    }

    // Merge the dynamic primary color with hover/pressed variants and borderRadius
    const mergedOverrides = {
      ...themeOverrides,
      common: {
        ...themeOverrides.common,
        primaryColor: primaryColor,
        primaryColorHover: lightenColor(primaryColor, 10),
        primaryColorPressed: darkenColor(primaryColor, 10),
        primaryColorSuppl: primaryColor,
        borderRadius: `${themeStore.borderRadius}px`,
      },

    }

    return {
      locale: enUS,
      dateLocale: dateEnUS,
      theme: themeStore.isDark ? darkTheme : lightTheme,
      themeOverrides: mergedOverrides,
      icons: {
        info: () => h('span', { class: 'iconify ph--info size-full' }),
        success: () => h('span', { class: 'iconify ph--seal-check size-full' }),
        warning: () => h('span', { class: 'iconify ph--warning size-full' }),
        error: () => h('span', { class: 'iconify ph--x-square size-full' }),
      },
    }
  })

  return configProviderProps
}

// Global object to hold the API instances
export const discrete = {
  message: undefined as MessageApi | undefined,
  dialog: undefined as DialogApi | undefined,
  notification: undefined as NotificationApi | undefined,
  loadingBar: undefined as LoadingBarApi | undefined,
  modal: undefined as ModalApi | undefined
}

export function setupDiscreteApi(api: {
  message: MessageApi,
  dialog: DialogApi,
  notification: NotificationApi,
  loadingBar: LoadingBarApi,
  modal: ModalApi
}) {
  discrete.message = api.message
  discrete.dialog = api.dialog
  discrete.notification = api.notification
  discrete.loadingBar = api.loadingBar
  discrete.modal = api.modal
}