<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import type { RouteLocationMatched } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface BreadcrumbItem {
  title: string
  path?: string
  clickable: boolean
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter((r) => r.meta?.title)
  
  return matched.map((routeRecord: RouteLocationMatched, index) => {
    const isLast = index === matched.length - 1
    
    return {
      title: routeRecord.meta?.title as string,
      path: isLast ? undefined : routeRecord.path,
      clickable: !isLast && !!routeRecord.path
    }
  })
})

function handleClick(item: BreadcrumbItem) {
  if (item.clickable && item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <NBreadcrumb v-if="breadcrumbs.length > 0">
    <NBreadcrumbItem
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :clickable="item.clickable"
      @click="handleClick(item)"
    >
      {{ item.title }}
    </NBreadcrumbItem>
  </NBreadcrumb>
</template>
