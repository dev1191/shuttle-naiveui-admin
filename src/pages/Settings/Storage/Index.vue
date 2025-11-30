<script setup lang="ts">
import { settingsApi } from "@/services/setting.service";

const item = ref();

onMounted(async () => {
  const response = await settingsApi.getById("storage");
  item.value = response.data;
});
    </script>


<template>
      <AppSetting title="Storage" description="Manage application storage settings">
  
        <StorageForm :item="item" />
  </AppSetting>
</template>
