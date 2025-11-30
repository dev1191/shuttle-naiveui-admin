<script setup lang="ts">
import { settingsApi } from "@/services/setting.service";

const item = ref([]);

onMounted(async () => {
  const response = await settingsApi.getById("referral");
  item.value = response.data.referral;
});
</script>

<template>
  <AppSetting
    title="Referral"
    description="Manage application referral settings"
  >
    <ReferralForm :item="item" />
  </AppSetting>
</template>
