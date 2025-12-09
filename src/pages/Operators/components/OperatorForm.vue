<script setup lang="ts">
import {
  NForm,
  NSteps,
  NStep,
  NButton,
  NSpace,
  NUpload,
  NFormItem,
  NInputNumber,
  type UploadFileInfo,
} from "naive-ui";
import { ref, watch } from "vue";
import FormInput from "@/components/common/FormInput.vue";
import FormSelect from "@/components/common/FormSelect.vue";
import PhoneInput from "@/components/common/PhoneInput.vue";
import type {
  Operator,
  CreateOperatorDTO,
  UpdateOperatorDTO,
} from "@/types/operator";
import { OperatorStatus } from "@/types/operator";

interface Props {
  isEdit?: boolean;
  initialData?: Operator;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  initialData: undefined,
});

const emit = defineEmits<{
  submit: [data: CreateOperatorDTO | UpdateOperatorDTO];
  cancel: [];
}>();

const currentStep = ref(1);

// Step 1: Basic Information (Personal Details)
const basicInfo = ref({
  firstname: "",
  lastname: "",
  email: "",
  country_code: "91",
  phone: "",
});

// Step 2: Business Information
const businessInfo = ref({
  operator_business_name: "",
  operator_license_number: "",
  operator_commission: 0,
  password: "",
  confirmPassword: "",
});

// Step 3: Documents & Status
const documents = ref({
  operator_status: OperatorStatus.Pending,
  is_active: true,
});

const transportLicenseFiles = ref<UploadFileInfo[]>([]);
const businessRegistrationFiles = ref<UploadFileInfo[]>([]);
const pictureFiles = ref<UploadFileInfo[]>([]);

const statusOptions = [
  { label: "Pending", value: OperatorStatus.Pending },
  { label: "Active", value: OperatorStatus.Active },
  { label: "Suspended", value: OperatorStatus.Suspended },
  { label: "Rejected", value: OperatorStatus.Rejected },
];

const activeStatusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

// Watch for initial data changes (for edit mode)
watch(
  () => props.initialData,
  (data) => {
    if (data && props.isEdit) {
      basicInfo.value = {
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        country_code: data.country_code || "+977",
        phone: data.phone || "",
      };

      businessInfo.value = {
        operator_business_name: data.operator_business_name || "",
        operator_license_number: data.operator_license_number || "",
        operator_commission: data.operator_commission || 0,
        password: "",
        confirmPassword: "",
      };

      documents.value = {
        operator_status: data.operator_status || OperatorStatus.Pending,
        is_active: data.is_active ?? true,
      };
    }
  },
  { immediate: true }
);

function handleNext() {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

function handlePrevious() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function handleSubmit() {
  // Validate passwords match if provided
  if (businessInfo.value.password || businessInfo.value.confirmPassword) {
    if (businessInfo.value.password !== businessInfo.value.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  }

  // Validate password is required for create mode
  if (!props.isEdit && !businessInfo.value.password) {
    alert("Password is required for creating a new operator");
    return;
  }

  const formData: any = {
    ...basicInfo.value,
    ...businessInfo.value,
    ...documents.value,
    picture: "",
    operator_transport_license: "",
    operator_business_registration: "",
  };

  // Remove confirmPassword from payload
  delete formData.confirmPassword;

  // Only include password if it's provided (for edit mode, empty means no change)
  if (!businessInfo.value.password) {
    delete formData.password;
  }

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
      <NStep
        title="Business Information"
        description="Business & credentials"
      />
      <NStep title="Documents" description="Files & status" />
    </NSteps>

    <!-- Step 1: Basic Information (Personal Details) -->
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
            placeholder="operator@example.com"
            required
          />

          <NFormItem label="Phone Number" path="phone" required>
            <PhoneInput
              v-model:value="basicInfo.phone"
              v-model:country-code="basicInfo.country_code"
              placeholder="Enter phone number"
            />
          </NFormItem>
        </div>
      </NForm>
    </div>

    <!-- Step 2: Business Information -->
    <div v-show="currentStep === 2">
      <NForm :model="businessInfo" label-placement="top" label-width="auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            v-model="businessInfo.operator_business_name"
            label="Business Name"
            path="operator_business_name"
            placeholder="Enter business name"
            required
          />

          <FormInput
            v-model="businessInfo.operator_license_number"
            label="License Number"
            path="operator_license_number"
            placeholder="Enter license number"
            required
          />

          <NFormItem
            label="Commission Percentage (%)"
            path="operator_commission"
            required
          >
            <NInputNumber
              v-model:value="businessInfo.operator_commission"
              :min="0"
              :max="100"
              :step="0.1"
              placeholder="Enter commission percentage"
              class="w-full"
            />
          </NFormItem>

          <div></div>

          <FormInput
            v-model="businessInfo.password"
            label="Password"
            path="password"
            type="password"
            placeholder="Enter password"
            :required="!isEdit"
          />

          <FormInput
            v-model="businessInfo.confirmPassword"
            label="Confirm Password"
            path="confirmPassword"
            type="password"
            placeholder="Confirm password"
            :required="!isEdit"
          />
          <FormSelect
            v-model="documents.operator_status"
            label="Status"
            path="operator_status"
            :options="statusOptions"
            placeholder="Select status"
            required
          />
        </div>
      </NForm>
    </div>

    <!-- Step 3: Documents  -->
    <div v-show="currentStep === 3">
      <NForm :model="documents" label-placement="top" label-width="auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Profile Picture Card -->
          <div class="upload-card">
            <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div class="header-text">
                <h4 class="font-medium text-gray-800">Logo Picture</h4>
                <p class="text-xs text-gray-500">Upload operator's logo photo</p>
              </div>
            </div>
            <div class="upload-area">
              <NUpload
                v-model:file-list="pictureFiles"
                :max="1"
                list-type="image-card"
                accept="image/*"
              >
                <div class="flex flex-col items-center justify-center p-2">
                   <span class="text-xs text-primary font-medium">Click to Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">JPG, PNG • Max 5MB</p>
            </div>
          </div>

          <!-- Transport License Card -->
          <div class="upload-card">
            <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
               <div class="header-text">
                <h4 class="font-medium text-gray-800">Transport License</h4>
                <p class="text-xs text-gray-500">Valid transport license</p>
              </div>
            </div>
             <div class="upload-area">
              <NUpload
                v-model:file-list="transportLicenseFiles"
                :max="2"
                list-type="image-card"
                accept="image/*,application/pdf"
              >
                 <div class="flex flex-col items-center justify-center p-2">
                   <span class="text-xs text-primary font-medium">Click to Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">PDF, JPG • Max 2 files</p>
            </div>
          </div>

          <!-- Business Registration Card -->
          <div class="upload-card">
             <div class="upload-card-header">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div class="header-text">
                <h4 class="font-medium text-gray-800">Registration</h4>
                <p class="text-xs text-gray-500">Business docs</p>
              </div>
            </div>
             <div class="upload-area">
              <NUpload
                v-model:file-list="businessRegistrationFiles"
                :max="2"
                list-type="image-card"
                accept="image/*,application/pdf"
              >
                 <div class="flex flex-col items-center justify-center p-2">
                   <span class="text-xs text-primary font-medium">Click to Upload</span>
                </div>
              </NUpload>
              <p class="text-[10px] text-gray-400 mt-2 text-center">PDF, JPG • Max 2 files</p>
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

        <NButton v-if="currentStep < 3" type="primary" @click="handleNext">
          Next
        </NButton>

        <NButton v-if="currentStep === 3" type="primary" @click="handleSubmit">
          {{ isEdit ? "Update Operator" : "Create Operator" }}
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
