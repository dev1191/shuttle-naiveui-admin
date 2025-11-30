<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import {
  NForm,
  NSpin,
  NGrid,
  NGi,
  NButton,
  NSpace,
} from "naive-ui";
import { useMessage } from "naive-ui";
import type { FormInst } from "naive-ui";
import type { ReferralSettingItem } from "@/types/settings/referral";
import { settingsApi } from "@/services/setting.service";

const props = defineProps({
  item: {
    type: Array as PropType<ReferralSettingItem[]>,
    default: () => [],
  },
});

const message = useMessage();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const saving = ref(false);

const formData = ref<ReferralSettingItem[]>([]);

// Helper to format label from snake_case
const formatLabel = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Watch for props.item changes and populate form
watch(
  () => props.item,
  (newItems) => {
    if (newItems && Array.isArray(newItems)) {
      // Create a deep copy to avoid mutating props directly
      formData.value = newItems.map(item => ({ ...item }));
    }
  },
  { immediate: true }
);

// Save referral settings
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    await settingsApi.update("refferal", formData.value);

    message.success("Referral settings saved successfully");
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      // Validation errors
      message.error("Please fill in all required fields");
    } else {
      message.error("Failed to save referral settings");
    }
    console.error("Submit error:", error);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <NSpin :show="loading">
    <NForm
      ref="formRef"
      :model="formData"
      label-placement="top"
      require-mark-placement="right-hanging"
    >
      <!-- Dynamic Form Layout -->
      <NGrid :cols="2" :x-gap="24" :y-gap="16">
        <NGi v-for="(setting, index) in formData" :key="index">
          <FormInput
            v-model="setting.value"
            :label="formatLabel(setting.name)"
            :path="`[${index}].value`"
            :placeholder="`Enter ${formatLabel(setting.name).toLowerCase()}`"
            :type="['number_of_days', 'referral_amount'].includes(setting.name) ? 'number' : 'text'"
            required
          />
        </NGi>
      </NGrid>

      <!-- Buttons -->
      <NSpace class="m-10" justify="end">
        <NButton type="primary" :loading="saving" @click="handleSubmit">
          Save Settings
        </NButton>
      </NSpace>
    </NForm>
  </NSpin>
</template>
