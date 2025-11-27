import type { MenuOption } from 'naive-ui'
import routes from '@/router/routes'
import { computed, h } from 'vue'
import { useAuthStore } from '@/stores'
import * as LucideIcons from 'lucide-vue-next'

export function useMenu() {
  const auth = useAuthStore()

  function renderIcon(iconName?: string) {
    if (!iconName) return undefined
    // @ts-ignore
    const iconComp = LucideIcons[iconName]
    return iconComp ? () => h(iconComp, { size: 20 }) : undefined
  }

  function transformRouteToMenu(route: any, parentPath = ''): MenuOption | undefined {
    if (!route.meta) return undefined

    // Hide from menu check
    if (route.meta.hideInMenu) return undefined

    // Role check
    const roles = route.meta.roles as string[] | undefined
    if (auth.isLoggedIn) {
      if (roles && roles.length > 0 && !roles.includes(auth.userRole)) {
        return undefined
      }
    } else {
      // If not logged in, maybe hide? Or handled by router guard.
      // For menu, we usually only show what's accessible.
      return undefined
    }

    // Build the full path
    const fullPath = route.path.startsWith('/')
      ? route.path
      : parentPath + '/' + route.path

    const children = route.children
      ? route.children
        .map((child: any) => transformRouteToMenu(child, fullPath))
        .filter((item: any) => item !== undefined)
      : undefined

    // If it has children but all are filtered out, and it's not a leaf itself (no path?), maybe hide it?
    // But usually parent path is clickable or just a group.
    // If we want to show parents only if they have accessible children:
    if (route.children && (!children || children.length === 0)) {
      // If it was intended to be a group but has no visible children, skip it.
      // Unless it's a page itself.
      if (!route.component) return undefined
    }

    // Only include path if this is a leaf node (no children)
    // Parent items with children should not be clickable
    const menuItem: MenuOption = {
      label: route.meta.title || route.name,
      key: route.name,
      icon: renderIcon(route.meta.icon),
      children: children && children.length > 0 ? children : undefined
    }

    // Only add path if this is a leaf node (no children)
    if (!children || children.length === 0) {
      menuItem.path = fullPath
    }

    return menuItem
  }

  const menuItems = computed<MenuOption[]>(() => {
    const topLevelRoute = routes.find((r) => r.path === '/')
    if (!topLevelRoute || !topLevelRoute.children) return []

    return topLevelRoute.children
      .map((route) => transformRouteToMenu(route))
      .filter((item) => item !== undefined) as MenuOption[]
  })

  return { menuItems }
}
