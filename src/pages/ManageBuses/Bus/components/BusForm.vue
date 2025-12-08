<script setup lang="ts">
import { ref, onMounted } from "vue";
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
const pictureUpload = useImageUpload({ folder: 'buses/pictures',autoUpload:true });
const registrationUpload = useImageUpload({ folder: 'buses/certificates',autoUpload:true  });
const pollutionUpload = useImageUpload({ folder: 'buses/certificates',autoUpload:true });
const insuranceUpload = useImageUpload({ folder: 'buses/certificates',autoUpload:true });
const fitnessUpload = useImageUpload({ folder: 'buses/certificates',autoUpload:true });
const permitUpload = useImageUpload({ folder: 'buses/certificates',autoUpload:true });

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
watch(() => pictureUpload.fileList.value, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.picture = uploadedUrls;
  }
}, { deep: true });

watch(() => registrationUpload.fileList.value, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_registration = uploadedUrls[0];
  }
}, { deep: true });

watch(() => pollutionUpload.fileList.value, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_pollution = uploadedUrls[0];
  }
}, { deep: true });

watch(() => insuranceUpload.fileList.value, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_insurance = uploadedUrls[0];
  }
}, { deep: true });

watch(() => fitnessUpload.fileList.value, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_fitness = uploadedUrls[0];
  }
}, { deep: true });

watch(() => permitUpload.fileList.value, (newList) => {
  const uploadedUrls = newList
    .filter(f => f.status === 'finished' && f.url)
    .map(f => f.url!);
  if (uploadedUrls.length > 0) {
    formModel.value.certificate_permit = uploadedUrls[0];
  }
}, { deep: true });

onMounted(() => {
  fetchBusTypes();
  fetchBusLayouts();
  if (props.modelValue) {
    // Populate form with existing data
    const {
      picture,
      certificate_registration,
      certificate_pollution,
      certificate_insurance,
      certificate_fitness,
      certificate_permit,
      ...rest
    } = props.modelValue;

    formModel.value = { ...rest };

    // Load existing files into composables
    pictureUpload.loadExistingFiles(picture);
    
    if (certificate_registration) {
      registrationUpload.loadExistingFiles([certificate_registration]);
    }
    if (certificate_pollution) {
      pollutionUpload.loadExistingFiles([certificate_pollution]);
    }
    if (certificate_insurance) {
      insuranceUpload.loadExistingFiles([certificate_insurance]);
    }
    if (certificate_fitness) {
      fitnessUpload.loadExistingFiles([certificate_fitness]);
    }
    if (certificate_permit) {
      permitUpload.loadExistingFiles([certificate_permit]);
    }
  }
});

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
          <NGrid :x-gap="24" :y-gap="24" cols="2 s:1 m:2 l:2">
            <NGridItem span="2">
              <NFormItem label="Bus Pictures" path="pictureFiles">
                <NUpload
                  v-model:file-list="pictureUpload.fileList.value"
                  list-type="image-card"
                  multiple
                  :max="5"
                  :default-upload="false"
                  @change="pictureUpload.handleUploadChange"
                >
                  Click to Upload
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem
                label="Registration Certificate"
                path="certRegistrationFiles"
              >
                <NUpload
                  v-model:file-list="registrationUpload.fileList.value"
                  :max="1"
                  :default-upload="false"
                  @change="registrationUpload.handleUploadChange"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem
                label="Pollution Certificate"
                path="certPollutionFiles"
              >
                <NUpload
                  v-model:file-list="pollutionUpload.fileList.value"
                  :max="1"
                  :default-upload="false"
                  @change="pollutionUpload.handleUploadChange"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem
                label="Insurance Certificate"
                path="certInsuranceFiles"
              >
                <NUpload
                  v-model:file-list="insuranceUpload.fileList.value"
                  :max="1"
                  :default-upload="false"
                  @change="insuranceUpload.handleUploadChange"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Fitness Certificate" path="certFitnessFiles">
                <NUpload
                  v-model:file-list="fitnessUpload.fileList.value"
                  :max="1"
                  :default-upload="false"
                  @change="fitnessUpload.handleUploadChange"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Permit Certificate" path="certPermitFiles">
                <NUpload
                  v-model:file-list="permitUpload.fileList.value"
                  :max="1"
                  :default-upload="false"
                  @change="permitUpload.handleUploadChange"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
          </NGrid>
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
