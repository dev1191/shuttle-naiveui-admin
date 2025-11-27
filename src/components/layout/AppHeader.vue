<script setup lang="ts">
import { useRouter } from "vue-router";
import { NLayoutHeader, NButton, NIcon, NSpace } from "naive-ui";
import ThemeSwitch from "@/components/common/ThemeSwitch.vue";
import Settings from "@/components/common/Settings.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import { useAuthStore } from "@/stores/auth";

defineEmits<{
  'open-mobile': [];
}>();

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.clearAuth();
  router.push({ name: "signIn" });
}
</script>

<template>
  <NLayoutHeader
    bordered
    class="flex items-center justify-between px-6 h-16 bg-white dark:bg-gray-700"
  >
    <!-- Left Side: Mobile Menu + Breadcrumb -->
    <div class="flex items-center gap-4">
      <NButton
        text
        class="md:hidden"
        @click="$emit('open-mobile')"
      >
        <template #icon>
          <NIcon size="20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </NIcon>
        </template>
      </NButton>
      <Breadcrumb />
    </div>

    <!-- Right Side: Theme Switch + Settings + Logout -->
    <NSpace align="center" :size="16">
      <ThemeSwitch />
      <Settings />
      <NButton quaternary circle @click="handleLogout">
        <template #icon>
          <span class="iconify ph--sign-out size-5"></span>
        </template>
      </NButton>
    </NSpace>
  </NLayoutHeader>
</template>
