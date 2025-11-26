<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import AppSetting from "@/components/layout/AppSetting.vue";
import GeneralForm from "@/components/settings/GeneralForm.vue";

const authStore = useAuthStore();
const { generalSettings } = storeToRefs(authStore);

const isLoading = ref(false);
const handleEditSetting = async (formData: Record<string, any>) => {};
</script>

<template>
  <AppSetting title="Site Settings" description="Site Settings">
    <GeneralForm
      :item="generalSettings"
      :isLoading="isLoading"
      @submit="handleEditSetting"
    />
  </AppSetting>
</template>
