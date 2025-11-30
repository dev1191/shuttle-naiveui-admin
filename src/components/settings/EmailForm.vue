<script setup lang="ts">
import { ref, watch, computed, type PropType } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadioButton,
  NSelect,
  NButton,
  NSpace,
  NSpin,
  NGrid,
  NGi,
} from "naive-ui";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import type { EmailSettings } from "@/types/settings/email";
import { settingsApi } from "@/services/setting.service";

const props = defineProps({
  item: {
    type: Object as PropType<EmailSettings>,
    default: null,
  },
});

const message = useMessage();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const saving = ref(false);

const formData = ref<EmailSettings>({
  is_production: false,
  type: "SMTP",
  username: "",
  host: "",
  password: "",
  port: 587,
  encryption: "tls",
  email: "",
  name: "",
  apiKey: "",
});

const encryptionOptions = [
  { label: "TLS", value: "tls" },
  { label: "SSL", value: "ssl" },
  { label: "None", value: "none" },
];

const typeOptions = [
  { label: "SMTP", value: "SMTP" },
  { label: "Resend", value: "Resend" },
];

const rules = computed<FormRules>(() => {
  const commonRules = {
    type: {
      required: true,
      message: "Email type is required",
      trigger: ["blur", "change"],
    },
    email: {
      required: true,
      type: "email",
      message: "Valid email is required",
      trigger: ["blur", "input"],
    },
    name: {
      required: true,
      message: "Name is required",
      trigger: ["blur", "input"],
    },
  };

  if (formData.value.type === "Resend") {
    return {
      ...commonRules,
      apiKey: {
        required: true,
        message: "API Key is required",
        trigger: ["blur", "input"],
      },
    };
  }

  return {
    ...commonRules,
    username: {
      required: true,
      message: "Username is required",
      trigger: ["blur", "input"],
    },
    host: {
      required: true,
      message: "Host is required",
      trigger: ["blur", "input"],
    },
    password: {
      required: true,
      message: "Password is required",
      trigger: ["blur", "input"],
    },
    port: {
      required: true,
      type: "number",
      message: "Port is required",
      trigger: ["blur", "input"],
    },
    encryption: {
      required: true,
      message: "Encryption type is required",
      trigger: ["blur", "change"],
    },
  };
});

// Watch for props.item changes and populate form
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = {
        is_production: newItem.is_production ?? false,
        type: newItem.type || "SMTP",
        username: newItem.username || "",
        host: newItem.host || "",
        password: newItem.password || "",
        port: Number(newItem.port) || 587,
        encryption: newItem.encryption || "tls",
        email: newItem.email || "",
        name: newItem.name || "",
        apiKey: newItem.apiKey || "",
      };
    }
  },
  { immediate: true }
);

// Save email settings
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    await settingsApi.update("smtp", formData.value);

    message.success("Email settings saved successfully");
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      // Validation errors
      message.error("Please fill in all required fields");
    } else {
      message.error("Failed to save email settings");
    }
    console.error("Submit error:", error);
  } finally {
    saving.value = false;
  }
};

// Test email connection
const handleTestConnection = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    await settingsApi.update("smtp", formData.value);

    message.success("Email connection test successful!");
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      message.error("Please fill in all required fields before testing");
    } else {
      message.error("Email connection test failed");
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
          <NFormItem label="Email Service Type" path="type">
            <NRadioGroup v-model:value="formData.type" :options="typeOptions">
              <NRadioButton
                v-for="option in typeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </NRadioButton>
            </NRadioGroup>
          </NFormItem>
        </NGi>

        <NGi v-if="formData.type === 'SMTP'">
          <FormInput
            v-model="formData.host"
            label="SMTP Host"
            path="host"
            placeholder="Enter host"
            required
          />
        </NGi>

        <NGi v-if="formData.type === 'SMTP'">
          <FormInput
            type="number"
            v-model="formData.port"
            label="SMTP Port"
            path="port"
            placeholder="587"
            required
          />
        </NGi>

        <NGi v-if="formData.type === 'SMTP'">
          <NFormItem label="Encryption" path="encryption">
            <NSelect
              v-model:value="formData.encryption"
              :options="encryptionOptions"
              placeholder="Select encryption type"
            />
          </NFormItem>
        </NGi>

        <NGi v-if="formData.type === 'SMTP'">
          <NFormItem label="Username" path="username">
            <NInput
              v-model:value="formData.username"
              placeholder="SMTP username"
            />
          </NFormItem>
        </NGi>

        <NGi v-if="formData.type === 'SMTP'">
          <NFormItem label="Password" path="password">
            <NInput
              v-model:value="formData.password"
              type="password"
              show-password-on="click"
              placeholder="SMTP password"
            />
          </NFormItem>
        </NGi>

        <NGi v-if="formData.type === 'Resend'">
          <FormInput
            type="text"
            v-model="formData.apiKey"
            label="API Key"
            path="apiKey"
            placeholder="Enter API Key"
            required
          />
        </NGi>

        <NGi>
          <NFormItem label="From Email" path="email">
            <NInput
              v-model:value="formData.email"
              placeholder="noreply@example.com"
            />
          </NFormItem>
        </NGi>

        <NGi>
          <NFormItem label="From Name" path="name">
            <NInput
              v-model:value="formData.name"
              placeholder="Your Company Name"
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <!-- Buttons -->

      <NSpace class="m-10" justify="end">
        <NButton type="primary" :loading="saving" @click="handleSubmit">
          Save Settings
        </NButton>
        <NButton :loading="loading" @click="handleTestConnection">
          Test Connection
        </NButton>
      </NSpace>
    </NForm>
  </NSpin>
</template>
