<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import {
  NForm,
  NFormItem,
  NSpin,
} from "naive-ui";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import type { RefundSettings } from "@/types/settings/refund";
import { settingsApi } from "@/services/setting.service";

const props = defineProps({
  item: {
    type: Object as PropType<RefundSettings>,
    default: null,
  },
});

const message = useMessage();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const saving = ref(false);

const formData = ref<RefundSettings>({
  type: "fixed",
  amount: 0,
  minimum_time: 0,
  contents: "",
});

const typeOptions = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

// Watch for props.item changes and populate form
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = {
        type: newItem.type || "Fixed",
        amount: newItem.amount || 0,
        minimum_time: newItem.minimum_time || 0,
        contents: newItem.contents || "",
      };
    }
  },
  { immediate: true }
);

const rules: FormRules = {
  type: {
    required: true,
    message: "Refund type is required",
    trigger: ["blur", "change"],
  },
  amount: {
    required: true,
    type: "number",
    message: "Amount is required",
    trigger: ["blur", "input"],
  },
  minimum_time: {
    required: true,
    type: "number",
    message: "Minimum time is required",
    trigger: ["blur", "input"],
  },
};

// Save refund settings
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    await settingsApi.update("refunds", formData.value)

    message.success("Refund settings saved successfully");
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      // Validation errors
      message.error("Please fill in all required fields");
    } else {
      message.error("Failed to save refund settings");
    }
    console.error("Submit error:", error);
  } finally {
    saving.value = false;
  }
};

// Test refund connection
const handleTestConnection = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    // TODO: Replace with actual API call
    // await refundApi.testConnection(formData.value)

    // Mock test
    await new Promise((resolve) => setTimeout(resolve, 1500));

    message.success("Refund connection test successful!");
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      message.error("Please fill in all required fields before testing");
    } else {
      message.error("Refund connection test failed");
    }
    console.error("Test error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <NSpin :show="loading">
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
    >
      <!-- 2-Column Form Layout -->
      <NGrid :cols="2" :x-gap="24" :y-gap="16">
        <NGi>
          <NFormItem label="Refund Type" path="type">
            <NRadioGroup v-model:value="formData.type">
              <NRadioButton
                v-for="option in typeOptions"
                :key="option.value"
                :value="option.value"
                >{{ option.label }}</NRadioButton
              >
            </NRadioGroup>
          </NFormItem>
        </NGi>

        <NGi>
          <FormInput
            type="number"
            v-model="formData.amount"
            :label="formData.type === 'fixed' ? 'Amount' : 'Percentage'"
            path="amount"
            placeholder="Enter amount"
            required
          />
        </NGi>
        <NGi>
          <FormInput
            type="number"
            v-model="formData.minimum_time"
            label="Minimum Time"
            path="minimum_time"
            placeholder="Enter minimum time"
            required
          />
        </NGi>
      </NGrid>
      <NGrid :cols="1" :x-gap="24" :y-gap="16">
        <NGi>
          <NFormItem label="Content" path="contents">
            <RichTextEditor
              v-model="formData.contents"
              placeholder="Page Content"
            />
          </NFormItem>
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
