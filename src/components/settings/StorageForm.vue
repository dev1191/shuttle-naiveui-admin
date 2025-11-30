<script setup lang="ts">
import { ref, watch, computed, type PropType } from "vue";
import {
  NForm,
  NFormItem,
  NRadioGroup,
  NRadioButton,
  NButton,
  NSpace,
  NSpin,
  NGrid,
  NGi,
} from "naive-ui";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import type { StorageSettings } from "@/types/settings/storage";
import { settingsApi } from "@/services/setting.service";
import FormInput from "@/components/common/FormInput.vue";

const props = defineProps({
  item: {
    type: Object as PropType<StorageSettings>,
    default: null,
  },
});

const message = useMessage();

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const saving = ref(false);

const formData = ref<StorageSettings>({
  name: "local",
  spaces: {
    access_key: "",
    secret_key: "",
    region: "",
    endpoint: "",
    bucket: ""
  },
  cloudinary: {
    cloud_name: "",
    api_key: "",
    api_secret: ""
  },
});

const typeOptions = [
  { label: "Local", value: "local" },
  { label: "Spaces (Digital Ocean)", value: "spaces" },
  { label: "Cloudinary", value: "cloudinary" }
];

// Watch for props.item changes and populate form
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = {
        name: newItem.name || "local",
        spaces: newItem.spaces || {
          access_key: "",
          secret_key: "",
          region: "",
          endpoint: "",
          bucket: ""
        },
        cloudinary: newItem.cloudinary || {
          cloud_name: "",
          api_key: "",
          api_secret: ""
        },
      };
    }
  },
  { immediate: true }
);

const rules = computed<FormRules>(() => {
  const commonRules = {
    name: {
      required: true,
      message: "Storage type is required",
      trigger: ["blur", "change"],
    },
  };

  if (formData.value.name === 'spaces') {
    return {
      ...commonRules,
      'spaces.access_key': { required: true, message: "Access Key is required", trigger: "blur" },
      'spaces.secret_key': { required: true, message: "Secret Key is required", trigger: "blur" },
      'spaces.region': { required: true, message: "Region is required", trigger: "blur" },
      'spaces.endpoint': { required: true, message: "Endpoint is required", trigger: "blur" },
      'spaces.bucket': { required: true, message: "Bucket is required", trigger: "blur" },
    };
  }

  if (formData.value.name === 'cloudinary') {
    return {
      ...commonRules,
      'cloudinary.cloud_name': { required: true, message: "Cloud Name is required", trigger: "blur" },
      'cloudinary.api_key': { required: true, message: "API Key is required", trigger: "blur" },
      'cloudinary.api_secret': { required: true, message: "API Secret is required", trigger: "blur" },
    };
  }

  return commonRules;
});

// Save storage settings
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    await settingsApi.update("storage", formData.value);

    message.success("Storage settings saved successfully");
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      // Validation errors
      message.error("Please fill in all required fields");
    } else {
      message.error("Failed to save storage settings");
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
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
    >
      <NGrid :cols="1" :x-gap="24" :y-gap="16">
        <NGi>
          <NFormItem label="Storage Type" path="name">
            <NRadioGroup v-model:value="formData.name">
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
      </NGrid>

      <!-- Spaces Fields -->
      <NGrid v-if="formData.name === 'spaces'" :cols="2" :x-gap="24" :y-gap="16">
        <NGi>
          <FormInput
            v-model="formData.spaces.access_key"
            label="Access Key"
            path="spaces.access_key"
            placeholder="Enter Access Key"
            required
          />
        </NGi>
        <NGi>
          <FormInput
            v-model="formData.spaces.secret_key"
            label="Secret Key"
            path="spaces.secret_key"
            placeholder="Enter Secret Key"
            required
         
          />
        </NGi>
        <NGi>
          <FormInput
            v-model="formData.spaces.region"
            label="Region"
            path="spaces.region"
            placeholder="e.g. nyc3"
            required
          />
        </NGi>
        <NGi>
          <FormInput
            v-model="formData.spaces.endpoint"
            label="Endpoint"
            path="spaces.endpoint"
            placeholder="e.g. https://nyc3.digitaloceanspaces.com"
            required
          />
        </NGi>
        <NGi>
          <FormInput
            v-model="formData.spaces.bucket"
            label="Bucket"
            path="spaces.bucket"
            placeholder="Enter Bucket Name"
            required
          />
        </NGi>
      </NGrid>

      <!-- Cloudinary Fields -->
      <NGrid v-if="formData.name === 'cloudinary'" :cols="2" :x-gap="24" :y-gap="16">
        <NGi>
          <FormInput
            v-model="formData.cloudinary.cloud_name"
            label="Cloud Name"
            path="cloudinary.cloud_name"
            placeholder="Enter Cloud Name"
            required
          />
        </NGi>
        <NGi>
          <FormInput
            v-model="formData.cloudinary.api_key"
            label="API Key"
            path="cloudinary.api_key"
            placeholder="Enter API Key"
            required
          />
        </NGi>
        <NGi>
          <FormInput
            v-model="formData.cloudinary.api_secret"
            label="API Secret"
            path="cloudinary.api_secret"
            placeholder="Enter API Secret"
            required
        
          />
        </NGi>
      </NGrid>

      <NSpace class="mt-6" justify="end">
        <NButton type="primary" :loading="saving" @click="handleSubmit">
          Save Settings
        </NButton>
      </NSpace>
    </NForm>
  </NSpin>
</template>
