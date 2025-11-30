<script setup lang="ts">
import { settingsApi } from "@/services/setting.service";

const item = ref();

onMounted(async () => {
  const response = await settingsApi.getById("refunds");
  item.value = response.data;
});
</script>

<template>
  <AppSetting title="Refund" description="Manage application refund settings">
    <RefundForm :item="item" />
  </AppSetting>
</template>
