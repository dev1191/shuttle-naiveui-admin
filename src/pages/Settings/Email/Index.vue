<script setup lang="ts">
import { settingsApi } from "@/services/setting.service";

const item = ref();

onMounted(async () => {
  const response = await settingsApi.getById("smtp");
  item.value = response.data;
});
</script>

<template>
  <AppSetting
    title="Email Settings"
    description="Configure email server settings for sending emails"
  >
    <EmailForm :item="item" />
  </AppSetting>
</template>
