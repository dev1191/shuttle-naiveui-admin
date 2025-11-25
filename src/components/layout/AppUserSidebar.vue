<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

interface Props {
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const auth = useAuthStore();

const userName = computed(() => auth.user?.name || "Admin");
const userEmail = computed(() => auth.user?.email || "admin@example.com");
</script>

<template>
  <div
    class="flex cursor-pointer items-center transition-[background-color,border-radius,margin,padding] hover:bg-neutral-200/90 dark:hover:bg-neutral-750/65"
    :class="
      props.collapsed
        ? 'mx-2 rounded-naive px-2 py-1.5'
        : 'mx-4 rounded-xl bg-neutral-150 py-3.5 pr-2.5 pl-3.5 dark:bg-neutral-800'
    "
  >
    <UserProfile placement="right-end" :disabled="!props.collapsed">
      <template #trigger>
        <div
          class="flex items-center overflow-hidden rounded-full transition-[margin]"
          :class="{ 'mr-2': !props.collapsed }"
        >
          <NAvatar :size="36" :round="true" style="background-color: #3a8696">
            {{ userName.charAt(0).toUpperCase() }}
          </NAvatar>

          <div v-if="!props.collapsed" class="flex-1 min-w-0 ml-2">
            <NText
              class="block text-sm font-medium text-gray-900 dark:text-white truncate"
            >
              {{ userName }}
            </NText>
            <NText
              class="block text-xs text-gray-500 dark:text-gray-400 truncate"
            >
              {{ userEmail }}
            </NText>
          </div>
        </div>
      </template>
    </UserProfile>
  </div>
</template>
