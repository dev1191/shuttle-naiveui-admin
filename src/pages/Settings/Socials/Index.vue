<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { settingsApi } from "@/services/setting.service";
import AppSetting from '@/components/layout/AppSetting.vue';
import SocialLinkForm from '@/components/settings/SocialLinkForm.vue';

const item = ref();

onMounted(async () => {
  const response = await settingsApi.getById("social_links");
  item.value = response.data;
});
</script>

<template>
  <AppSetting title="Social Links" description="Manage application social links settings">
    <SocialLinkForm :item="item" />
  </AppSetting>
</template>
