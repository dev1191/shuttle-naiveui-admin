<script setup lang="ts">
import {
  NForm,
  NSteps,
  NStep,
  NButton,
  NSpace,
  NUpload,
  NFormItem,
  NRadioGroup,
  NRadio,
  type UploadFileInfo,
} from "naive-ui";
import { ref, watch, reactive } from "vue";
import FormInput from "@/components/common/FormInput.vue";
import FormSelect from "@/components/common/FormSelect.vue";
import PhoneInput from "@/components/common/PhoneInput.vue";
import type { Driver, CreateDriverDTO, UpdateDriverDTO } from "@/types/driver";
import { DriverStatus } from "@/types/driver";
import { useImageUpload } from "@/composables/useImageUpload";

interface Props {
  isEdit?: boolean;
  initialData?: Driver;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  initialData: undefined,
});

const emit = defineEmits<{
  submit: [data: CreateDriverDTO | UpdateDriverDTO];
  cancel: [];
}>();

const currentStep = ref(1);

// Step 1: Basic Information
const basicInfo = ref({
  firstname: "",
  lastname: "",
  short_name: "",
  email: "",
  country_code: "91",
  phone: "",
  national_id: "",
  type: "driver",
});

// Step 2: Documents & Status
const documents = ref({
  status: DriverStatus.Active,
  picture: "",
  document_licence: "",
  document_national_icard: "",
  document_police_vertification: ""
});

// File Upload Composables
const pictureUpload = reactive(useImageUpload({
  folder: "drivers/profile",
  maxWidth: 80,
  maxHeight: 80,
  autoUpload: true,
}));
const licenseUpload = reactive(useImageUpload({
  folder: "drivers/license",
  autoUpload: true,
}));
const nationalIdUpload = reactive(useImageUpload({
  folder: "drivers/national-id",
  autoUpload: true,
}));
const policeVerificationUpload = reactive(useImageUpload({
  folder: "drivers/verification",
  autoUpload: true,
}));

const driverTypeOptions = [
  { label: "Driver", value: "driver" },
  { label: "Assistant", value: "assistant" },
];

const statusOptions = [
  { label: "Active", value: DriverStatus.Active },
  { label: "Inactive", value: DriverStatus.Inactive },
  { label: "OnRoute", value: DriverStatus.OnRoute },
  { label: "Breakdown", value: DriverStatus.Breakdown },
  { label: "Idle", value: DriverStatus.Idle },
  { label: "Maintenance", value: DriverStatus.Maintenance },
];

// Watch for initial data changes (for edit mode)
watch(
  () => props.initialData,
  (data) => {
    if (data && props.isEdit) {
      basicInfo.value = {
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        short_name: data.short_name || "",
        email: data.email || "",
        country_code: data.country_code || "91",
        phone: data.phone || "",
        national_id: data.national_id || "",
        type: data.type || "driver",
      };

      documents.value = {
        status: data.status,
        picture: data.picture || "",
        document_licence: data.document_licence || "",
        document_national_icard: data.document_national_icard || "",
        document_police_vertification: data.document_police_vertification || ""
      };    

 
    }
  },
  { immediate: true }
);

function handleNext() {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
}

function handlePrevious() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

// Watch for upload completion and sync URLs to formModel
watch(() => pictureUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  documents.value.picture = uploadedUrls[0] || "";
}, { deep: true });

watch(() => licenseUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    documents.value.document_licence = uploadedUrls;
  }
}, { deep: true });

watch(() => nationalIdUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    documents.value.document_national_icard = uploadedUrls;
  }
}, { deep: true });

watch(() => policeVerificationUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  documents.value.document_police_vertification = uploadedUrls[0] || "";
}, { deep: true });


function handleSubmit() {

  const formData: any = {
    ...basicInfo.value,
    ...documents.value
  };

  emit("submit", formData);
}

function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <div>
    <NSteps :current="currentStep" class="mb-6">
      <NStep title="Basic Information" description="Personal details" />
      <NStep title="Documents" description="Files & status" />
    </NSteps>

    <!-- Step 1: Basic Information -->
    <div v-show="currentStep === 1">
      <NForm :model="basicInfo" label-placement="top" label-width="auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            v-model="basicInfo.firstname"
            label="First Name"
            path="firstname"
            placeholder="Enter first name"
            required
          />

          <FormInput
            v-model="basicInfo.lastname"
            label="Last Name"
            path="lastname"
            placeholder="Enter last name"
            required
          />

          <FormInput
            v-model="basicInfo.email"
            label="Email"
            path="email"
            placeholder="driver@example.com"
            required
          />

          <NFormItem label="Phone Number" path="phone" required>
            <PhoneInput
              v-model:value="basicInfo.phone"
              v-model:country-code="basicInfo.country_code"
              placeholder="Enter phone number"
            />
          </NFormItem>

          <FormInput
            v-model="basicInfo.national_id"
            label="National ID"
            path="national_id"
            placeholder="Enter national ID number"
            required
          />

          <NFormItem label="Driver Type" path="type" required>
            <NRadioGroup v-model:value="basicInfo.type">
              <NRadio
                v-for="option in driverTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </NRadio>
            </NRadioGroup>
          </NFormItem>
        </div>
      </NForm>
    </div>

    <!-- Step 2: Documents  -->
    <div v-show="currentStep === 2">
      <NForm :model="documents" label-placement="top" label-width="auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormSelect
            v-model="documents.status"
            label="Status"
            path="status"
            :options="statusOptions"
            placeholder="Select status"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Profile Picture Card -->
          <div class="upload-card">
            <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div class="header-text">
                <h4 class="font-medium text-gray-800">Photo</h4>
                <p class="text-xs text-gray-500">Profile picture</p>
              </div>
            </div>
            <div class="upload-area">
              <NUpload
                v-model:file-list="pictureUpload.fileList"
                :max="1"
                list-type="image-card"
                accept="image/*"
                @change="pictureUpload.handleUploadChange"
                @remove="pictureUpload.deleteFile(documents.picture)"
              >
                <div class="flex flex-col items-center justify-center p-2">
                  <span class="text-xs text-primary font-medium">Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">JPG, PNG</p>
            </div>
          </div>

          <!-- Driver License Card -->
          <div class="upload-card">
            <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div class="header-text">
                <h4 class="font-medium text-gray-800">License</h4>
                <p class="text-xs text-gray-500">Driving license</p>
              </div>
            </div>
            <div class="upload-area">
              <NUpload
                v-model:file-list="licenseUpload.fileList"
                :max="2"
                list-type="image-card"
                accept="image/*,application/pdf"
                @change="licenseUpload.handleUploadChange"
                @remove="licenseUpload.deleteFile(documents.document_licence)"
              >
                <div class="flex flex-col items-center justify-center p-2">
                  <span class="text-xs text-primary font-medium">Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">
                Front & Back
              </p>
            </div>
          </div>

          <!-- National ID Card -->
          <div class="upload-card">
            <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <path d="M7 8h10" />
                  <path d="M7 12h10" />
                  <path d="M7 16h10" />
                </svg>
              </div>
              <div class="header-text">
                <h4 class="font-medium text-gray-800">National ID</h4>
                <p class="text-xs text-gray-500">Identity card</p>
              </div>
            </div>
            <div class="upload-area">
              <NUpload
                v-model:file-list="nationalIdUpload.fileList"
                :max="2"
                list-type="image-card"
                accept="image/*,application/pdf"
                @change="nationalIdUpload.handleUploadChange"
                @remove="nationalIdUpload.deleteFile(documents.document_national_icard)"
              >
                <div class="flex flex-col items-center justify-center p-2">
                  <span class="text-xs text-primary font-medium">Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">
                Front & Back
              </p>
            </div>
          </div>

          <!-- Police Verification Card -->
          <div class="upload-card">
            <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div class="header-text">
                <h4 class="font-medium text-gray-800">Verification</h4>
                <p class="text-xs text-gray-500">Police clearance</p>
              </div>
            </div>
            <div class="upload-area">
              <NUpload
                v-model:file-list="policeVerificationUpload.fileList"
                :max="1"
                list-type="image-card"
                accept="image/*,application/pdf"
                @change="policeVerificationUpload.handleUploadChange"
                @remove="policeVerificationUpload.deleteFile(documents.document_police_vertification)"
              >
                <div class="flex flex-col items-center justify-center p-2">
                  <span class="text-xs text-primary font-medium">Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">
                Certificate
              </p>
            </div>
          </div>
        </div>
      </NForm>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <NButton @click="handleCancel"> Cancel </NButton>

      <NSpace>
        <NButton v-if="currentStep > 1" @click="handlePrevious">
          Previous
        </NButton>

        <NButton v-if="currentStep < 2" type="primary" @click="handleNext">
          Next
        </NButton>

        <NButton v-if="currentStep === 2" type="primary" @click="handleSubmit">
          {{ isEdit ? "Update Driver" : "Create Driver" }}
        </NButton>
      </NSpace>
    </div>
  </div>
</template>

<style scoped>
.n-upload {
  width: 100%;
}

.upload-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease;
}

.upload-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.upload-card-header {
  padding: 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.header-text h4 {
  margin: 0;
  line-height: 1.2;
}

.upload-area {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.n-upload-trigger) {
  width: 100%;
}

:deep(.n-upload-file-list) {
  margin-top: 12px;
}
</style>
