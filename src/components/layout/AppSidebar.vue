<script setup lang="ts">
import { useMenu } from "@/composables/useMenu";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NMenu, NScrollbar } from "naive-ui";
import UserProfile from "@/components/common/UserProfile.vue";

const collapsed = defineModel<boolean>('collapsed', { default: false });

const router = useRouter();
const route = useRoute();
const { menuItems } = useMenu();
const menuOptions = computed(() => menuItems.value);

const activeKey = computed(() => route.name as string);

function onSelect(_key: string, item: any) {
  // Only navigate if the item has a path (leaf nodes)
  // Parent items with children won't have a path
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-800">
    <!-- Logo -->
    <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div v-if="!collapsed" class="text-xl font-bold text-gray-800 dark:text-white">
        Shuttle
      </div>
      <div v-else class="text-xl font-bold text-gray-800 dark:text-white">
        S
      </div>
    </div>

    <!-- Scrollable Menu Area -->
    <div class="flex-1 overflow-hidden">
      <NScrollbar>
        <NMenu
          :options="menuOptions"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :value="activeKey"
          accordion
          @update:value="onSelect"
        />
      </NScrollbar>
    </div>

    <!-- User Profile at Bottom -->
    <div class="shrink-0 border-t border-gray-200 dark:border-gray-700 py-3">
      <UserProfile :collapsed="collapsed" />
    </div>
  </div>
</template>
