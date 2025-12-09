<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSwitch,
  NUpload,
  NButton,
  NGrid,
  NGridItem,
  NCard,
  NSpace,
  NSteps,
  NStep,
  useMessage,
} from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import type { Bus } from "@/types/buses/index";
import { bustypesApi } from "@/services/buses/busType.service";
import { busLayoutsApi } from "@/services/buses/busLayout.service";
import type { BusType } from "@/types/buses/busType";
import type { BusLayout } from "@/types/buses/busLayout";
import FormInput from "@/components/common/FormInput.vue";
import { useImageUpload } from "@/composables/useImageUpload";

const props = defineProps<{
  modelValue?: Bus;
  isEdit?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", data: any): void;
  (e: "cancel"): void;
}>();

const formRef = ref<FormInst | null>(null);
const message = useMessage();
const currentStep = ref<number>(1);

// Use image upload composables for each document type
const pictureUpload = reactive(useImageUpload({ folder: 'buses/pictures', autoUpload: true }));
const registrationUpload = reactive(useImageUpload({ folder: 'buses/certificates', autoUpload: true }));
const pollutionUpload = reactive(useImageUpload({ folder: 'buses/certificates', autoUpload: true }));
const insuranceUpload = reactive(useImageUpload({ folder: 'buses/certificates', autoUpload: true }));
const fitnessUpload = reactive(useImageUpload({ folder: 'buses/certificates', autoUpload: true }));
const permitUpload = reactive(useImageUpload({ folder: 'buses/certificates', autoUpload: true }));

const formModel = ref<Partial<Bus>>({
  name: "",
  reg_no: "",
  brand: "",
  model_no: "",
  chassis_no: "",
  bustypeId: "",
  buslayoutId: undefined, 
  amenities: [],
  status: 'Active',
});

const busTypes = ref<{ label: string; value: string }[]>([]);
const busLayoutOptions = ref<{ label: string; value: string }[]>([]);
const searchLayoutLoading = ref(false);
const searchTypeLoading = ref(false);

const rules: FormRules = {
  name: [{ required: true, message: "Please enter bus name", trigger: "blur" }],
  reg_no: [
    {
      required: true,
      message: "Please enter registration number",
      trigger: "blur",
    },
  ],
  brand: [
    { required: true, message: "Please enter brand", trigger: "blur" },
  ],
  model_no: [
    { required: true, message: "Please enter model number", trigger: "blur" },
  ],
  chassis_no: [
    { required: true, message: "Please enter chassis number", trigger: "blur" },
  ],
  bustypeId: [
    { required: true, message: "Please select bus type", trigger: "blur" },
  ],
   buslayoutId: [
    { required: true, message: "Please select bus layout", trigger: "blur" },
  ],
};

const fetchBusTypes = async (query = "") => {
  searchTypeLoading.value = true;
  try {
    const response = await bustypesApi.busTypeLists(query);
    busTypes.value = response.items.map((type: any) => ({
      label: type.name ?? type.label,
      value: type.ids ?? type.value,
    }));
  } catch (error) {
    console.error("Failed to fetch bus types", error);
  } finally {
    searchTypeLoading.value = false;
  }
};

const handleTypeSearch = (query: string) => {
    fetchBusTypes(query);
};

const fetchBusLayouts = async (query = "") => {
    searchLayoutLoading.value = true;
    try {
        const response = await busLayoutsApi.busLayoutLists(query);
        busLayoutOptions.value = response.items.map((layout: any) => ({
            label: layout.name ?? layout.label, 
            value: layout.ids ?? layout.value
        }));
    } catch (error) {
        console.error("Failed to fetch bus layouts", error);
    } finally {
        searchLayoutLoading.value = false;
    }
};

const handleLayoutSearch = (query: string) => {
    fetchBusLayouts(query);
};

// Watch for upload completion and sync URLs to formModel
watch(() => pictureUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.picture = uploadedUrls;
  }
}, { deep: true });

watch(() => registrationUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_registration = uploadedUrls[0];
  }
}, { deep: true });

watch(() => pollutionUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_pollution = uploadedUrls[0];
  }
}, { deep: true });

watch(() => insuranceUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_insurance = uploadedUrls[0];
  }
}, { deep: true });

watch(() => fitnessUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_fitness = uploadedUrls[0];
  }
}, { deep: true });

watch(() => permitUpload.fileList, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_permit = uploadedUrls[0];
  }
}, { deep: true });

watch(() => props.modelValue, (val) => {
  if (val) {
    const {
      picture,
      certificate_registration,
      certificate_pollution,
      certificate_insurance,
      certificate_fitness,
      certificate_permit,
      ...rest
    } = val;

    formModel.value = { ...rest };

    // Load existing files into composables
    pictureUpload.loadExistingFiles(picture);
    
    if (certificate_registration) registrationUpload.loadExistingFiles([certificate_registration]);
    if (certificate_pollution) pollutionUpload.loadExistingFiles([certificate_pollution]);
    if (certificate_insurance) insuranceUpload.loadExistingFiles([certificate_insurance]);
    if (certificate_fitness) fitnessUpload.loadExistingFiles([certificate_fitness]);
    if (certificate_permit) permitUpload.loadExistingFiles([certificate_permit]);
  }
}, { immediate: true });

const handleStepChange = (step: number) => {
  currentStep.value = step;
};

const nextStep = () => {
  if (currentStep.value === 1) {
    formRef.value?.validate((errors) => {
      if (!errors) {
        currentStep.value = 2;
      } else {
        message.error("Please fill in the required fields");
      }
    });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      // formModel already has all the URLs synced by watchers
      emit("submit", formModel.value);
    } else {
      message.error("Please fill in the required fields");
    }
  });
};
</script>

<template>
  <NCard :bordered="false">
    <NSpace vertical size="large">
      <NSteps :current="currentStep" :on-update:current="handleStepChange">
        <NStep title="Basic Information" description="Enter bus details" />
        <NStep
          title="Documents & Images"
          description="Upload certificates and photos"
        />
      </NSteps>

      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <div v-show="currentStep === 1">
          <NGrid :x-gap="24" :y-gap="24" cols="3 s:1 m:3 l:3">
            <NGridItem>
              <FormInput
                v-model="formModel.name"
                label="Bus Name"
                path="name"
                placeholder="Enter Bus Name"
                required
              />
            </NGridItem>
            <NGridItem>
              <FormInput
                v-model="formModel.reg_no"
                label="Registration Number"
                path="reg_no"
                placeholder="Enter Registration Number"
                required
              />
            </NGridItem>
            <NGridItem>
              <FormInput
                v-model="formModel.brand"
                label="Brand"
                path="brand"
                placeholder="Enter Brand"
                required
              />
            </NGridItem>
            <NGridItem>
              <FormInput
                v-model="formModel.model_no"
                label="Model Number"
                path="model_no"
                placeholder="Enter Model Number"
                required
              />
            </NGridItem>
            <NGridItem>
              <FormInput
                v-model="formModel.chassis_no"
                label="Chassis Number"
                path="chassis_no"
                placeholder="Enter Chassis Number"
                required
              />
            </NGridItem>
            <NGridItem>
              <NFormItem label="Bus Type" path="bustypeId">
                <NSelect
                size="large"
                  v-model:value="formModel.bustypeId"
                  :options="busTypes"
                  placeholder="Select Bus Type"
                />
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Bus Layout" path="buslayoutId">
                <NSelect
                    size="large"
                  v-model:value="formModel.buslayoutId"
                  :options="busLayoutOptions"
                  placeholder="Select Bus Layout"
                  filterable
                  remote
                  :loading="searchLayoutLoading"
                  @search="handleLayoutSearch"
                />
              </NFormItem>
            </NGridItem>

            <NGridItem span="2">
              <NFormItem label="Amenities" path="amenities">
                <NSelect
                    size="large"
                  v-model:value="formModel.amenities"
                  multiple
                  filterable
                  tag
                  placeholder="Add Amenities (Type and press enter)"
                />
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="Status" path="status">
                <NSelect
                    size="large"
                  v-model:value="formModel.status"
                  :options="[
                    { label: 'Active', value: 'Active' },
                    { label: 'OnRoute', value: 'OnRoute' },
                    { label: 'Idle', value: 'Idle' },
                    { label: 'Maintenance', value: 'Maintance' },
                    { label: 'Breakdown', value: 'Breakdown' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]"
                />
              </NFormItem>
            </NGridItem>
          </NGrid>
        </div>

        <div v-show="currentStep === 2">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Bus Pictures -->
            <div class="upload-card">
              <div class="upload-card-header">
                <div class="icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </div>
                <div class="header-text">
                  <h4 class="font-medium text-gray-800">Pictures</h4>
                  <p class="text-xs text-gray-500">Bus images</p>
                </div>
              </div>
              <div class="upload-area">
                <NUpload
                  v-model:file-list="pictureUpload.fileList"
                  list-type="image-card"
                  multiple
                  :max="5"
                  accept="image/*"
                  :default-upload="false"
                  @change="pictureUpload.handleUploadChange"
                >
                  <div class="flex flex-col items-center justify-center p-2">
                    <span class="text-xs text-primary font-medium">Upload</span>
                  </div>
                </NUpload>
                <p class="text-[10px] text-gray-400 mt-2 text-center">Max 5 Images</p>
              </div>
            </div>

            <!-- Registration -->
            <div class="upload-card">
              <div class="upload-card-header">
                <div class="icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div class="header-text">
                  <h4 class="font-medium text-gray-800">Registration</h4>
                  <p class="text-xs text-gray-500">Certificate</p>
                </div>
              </div>
              <div class="upload-area">
                <NUpload
                   v-model:file-list="registrationUpload.fileList"
                   :max="1"
                   accept="image/*,application/pdf"
                   :default-upload="false"
                   @change="registrationUpload.handleUploadChange"
                   @remove="registrationUpload.deleteFile(formModel.certificate_registration || '')"
                >
                   <NButton size="small" secondary type="primary" class="w-full">Upload File</NButton>
                </NUpload>
                 <p class="text-[10px] text-gray-400 mt-2 text-center">PDF or Image</p>
              </div>
            </div>

            <!-- Pollution -->
             <div class="upload-card">
              <div class="upload-card-header">
                <div class="icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                </div>
                <div class="header-text">
                  <h4 class="font-medium text-gray-800">Pollution</h4>
                  <p class="text-xs text-gray-500">Certificate</p>
                </div>
              </div>
              <div class="upload-area">
                <NUpload
                   v-model:file-list="pollutionUpload.fileList"
                   :max="1"
                   accept="image/*,application/pdf"
                   :default-upload="false"
                   @change="pollutionUpload.handleUploadChange"
                   @remove="pollutionUpload.deleteFile(formModel.certificate_pollution || '')"
                >
                   <NButton size="small" secondary type="primary" class="w-full">Upload File</NButton>
                </NUpload>
                 <p class="text-[10px] text-gray-400 mt-2 text-center">PDF or Image</p>
              </div>
            </div>

            <!-- Insurance -->
             <div class="upload-card">
              <div class="upload-card-header">
                <div class="icon-wrapper">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div class="header-text">
                  <h4 class="font-medium text-gray-800">Insurance</h4>
                  <p class="text-xs text-gray-500">Certificate</p>
                </div>
              </div>
              <div class="upload-area">
                <NUpload
                   v-model:file-list="insuranceUpload.fileList"
                   :max="1"
                   accept="image/*,application/pdf"
                   :default-upload="false"
                   @change="insuranceUpload.handleUploadChange"
                   @remove="insuranceUpload.deleteFile(formModel.certificate_insurance || '')"
                >
                   <NButton size="small" secondary type="primary" class="w-full">Upload File</NButton>
                </NUpload>
                 <p class="text-[10px] text-gray-400 mt-2 text-center">PDF or Image</p>
              </div>
            </div>

            <!-- Fitness -->
             <div class="upload-card">
              <div class="upload-card-header">
                <div class="icon-wrapper">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div class="header-text">
                  <h4 class="font-medium text-gray-800">Fitness</h4>
                  <p class="text-xs text-gray-500">Certificate</p>
                </div>
              </div>
              <div class="upload-area">
                <NUpload
                   v-model:file-list="fitnessUpload.fileList"
                   :max="1"
                   accept="image/*,application/pdf"
                   :default-upload="false"
                   @change="fitnessUpload.handleUploadChange"
                   @remove="fitnessUpload.deleteFile(formModel.certificate_fitness || '')"
                >
                   <NButton size="small" secondary type="primary" class="w-full">Upload File</NButton>
                </NUpload>
                 <p class="text-[10px] text-gray-400 mt-2 text-center">PDF or Image</p>
              </div>
            </div>

            <!-- Permit -->
             <div class="upload-card">
              <div class="upload-card-header">
                <div class="icon-wrapper">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
                </div>
                <div class="header-text">
                  <h4 class="font-medium text-gray-800">Permit</h4>
                  <p class="text-xs text-gray-500">Certificate</p>
                </div>
              </div>
              <div class="upload-area">
                <NUpload
                   v-model:file-list="permitUpload.fileList"
                   :max="1"
                   accept="image/*,application/pdf"
                   :default-upload="false"
                   @change="permitUpload.handleUploadChange"
                   @remove="permitUpload.deleteFile(formModel.certificate_permit || '')"
                >
                   <NButton size="small" secondary type="primary" class="w-full">Upload File</NButton>
                </NUpload>
                 <p class="text-[10px] text-gray-400 mt-2 text-center">PDF or Image</p>
              </div>
            </div>

          </div>
        </div>

        <NSpace justify="end" class="mt-6">
          <NButton type="error" secondary size="large" @click="emit('cancel')">Cancel</NButton>
          <NButton size="large" v-if="currentStep > 1" @click="prevStep">Previous</NButton>
          <NButton  size="large" v-if="currentStep < 2" type="primary" @click="nextStep"
            >Next</NButton
          >
          <NButton
          size="large"
            v-if="currentStep === 2"
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ isEdit ? "Update Bus" : "Create Bus" }}
          </NButton>
        </NSpace>
      </NForm>
    </NSpace>
  </NCard>
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
