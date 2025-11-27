<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NSelect,
  NButton,
  NSpace,
  NSpin,
} from "naive-ui";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import type { EmailSettings } from "@/types/settings/email";

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
});

const encryptionOptions = [
  { label: "TLS", value: "tls" },
  { label: "SSL", value: "ssl" },
  { label: "None", value: "none" },
];

const typeOptions = [
  { label: "SMTP", value: "SMTP" },
  { label: "SendGrid", value: "SendGrid" },
  { label: "Mailgun", value: "Mailgun" },
];

const rules: FormRules = {
  type: {
    required: true,
    message: "Email type is required",
    trigger: ["blur", "change"],
  },
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
        port: parseInt(newItem.port) || 587,
        encryption: newItem.encryption || "tls",
        email: newItem.email || "",
        name: newItem.name || "",
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

    // TODO: Replace with actual API call
    // await emailApi.updateSettings(formData.value)

    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    // TODO: Replace with actual API call
    // await emailApi.testConnection(formData.value)

    // Mock test
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
            <NSelect
              v-model:value="formData.type"
              :options="typeOptions"
              placeholder="Select email service type"
            />
          </NFormItem>
        </NGi>

        <NGi>
          <FormInput
            v-model="formData.host"
            label="SMTP Host"
            path="host"
            placeholder="Enter host"
            required
          />
        </NGi>

        <NGi>
          <FormInput
            type="number"
            v-model="formData.port"
            label="SMTP Port"
            path="port"
            placeholder="587"
            required
          />
        </NGi>

        <NGi>
          <NFormItem label="Encryption" path="encryption">
            <NSelect
              v-model:value="formData.encryption"
              :options="encryptionOptions"
              placeholder="Select encryption type"
            />
          </NFormItem>
        </NGi>

        <NGi>
          <NFormItem label="Username" path="username">
            <NInput
              v-model:value="formData.username"
              placeholder="SMTP username"
            />
          </NFormItem>
        </NGi>

        <NGi>
          <NFormItem label="Password" path="password">
            <NInput
              v-model:value="formData.password"
              type="password"
              show-password-on="click"
              placeholder="SMTP password"
            />
          </NFormItem>
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
