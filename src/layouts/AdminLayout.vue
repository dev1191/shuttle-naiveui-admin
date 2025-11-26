<script setup lang="ts">
import { ref } from "vue";
import { useThemeStore } from "@/stores/theme";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppMobileDrawer from "@/components/layout/AppMobileDrawer.vue";
import AppHeader from "@/components/layout/AppHeader.vue";

const themeStore = useThemeStore();
const mobileOpen = ref(false);
</script>

<template>
  <NLayout has-sider class="h-screen flex">
    <!-- Desktop Sidebar -->
    <NLayoutSider
      v-model:collapsed="themeStore.sidebarCollapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="260"
      show-trigger
      bordered
      class="hidden md:block"
    >
      <AppSidebar v-model:collapsed="themeStore.sidebarCollapsed" />
    </NLayoutSider>

    <!-- Mobile Drawer -->
    <AppMobileDrawer v-model:show="mobileOpen" />

    <!-- Main Content -->
    <NLayout class="flex-1 flex flex-col min-w-0">
      <AppHeader @open-mobile="mobileOpen = true" />

      <main class="h-full overflow-auto p-1 bg-gray-100 dark:bg-gray-900">
        <router-view />
      </main>
    </NLayout>
  </NLayout>
</template>
