<script setup lang="ts">
import { NDrawer, NMenu } from "naive-ui";
import { useMenu } from "@/composables/useMenu";
import { computed } from "vue";
import { useRouter } from "vue-router";

const show = defineModel<boolean>('show', { default: false });

const router = useRouter();
const { menuItems } = useMenu();
const menuOptions = computed(() => menuItems.value);

function onSelect(_key: string, item: any) {
  router.push(item.path);
  show.value = false; // Close drawer after navigation
}
</script>

<template>
  <NDrawer v-model:show="show" :width="280" placement="left">
    <div class="flex flex-col h-full bg-white dark:bg-gray-800">
      <!-- Logo -->
      <div class="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div class="text-xl font-bold text-gray-800 dark:text-white">
          Shuttle
        </div>
        <button
          @click="show = false"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Menu -->
      <div class="flex-1 overflow-y-auto">
        <NMenu
          :options="menuOptions"
          @update:value="onSelect"
        />
      </div>
    </div>
  </NDrawer>
</template>
