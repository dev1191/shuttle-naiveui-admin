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
import type { FormInst, FormRules, UploadFileInfo } from "naive-ui";
import type { Bus } from "@/types/buses/index";
import { bustypesApi } from "@/services/buses/busType.service";
import type { BusType } from "@/types/buses/busType";

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

const formModel = ref<
  Partial<Bus> & {
    pictureFiles?: UploadFileInfo[];
    certRegistrationFiles?: UploadFileInfo[];
    certPollutionFiles?: UploadFileInfo[];
    certInsuranceFiles?: UploadFileInfo[];
    certFitnessFiles?: UploadFileInfo[];
    certPermitFiles?: UploadFileInfo[];
  }
>({
  name: "",
  reg_no: "",
  brand: "",
  model_no: "",
  chassis_no: "",
  bustypeId: "",
  buslayoutId: "", // Optional or text for now
  amenities: [],
  status: true,
  pictureFiles: [],
  certRegistrationFiles: [],
  certPollutionFiles: [],
  certInsuranceFiles: [],
  certFitnessFiles: [],
  certPermitFiles: [],
});

const busTypes = ref<{ label: string; value: string }[]>([]);

const rules: FormRules = {
  name: [{ required: true, message: "Please enter bus name", trigger: "blur" }],
  reg_no: [
    {
      required: true,
      message: "Please enter registration number",
      trigger: "blur",
    },
  ],
  bustypeId: [
    { required: true, message: "Please select bus type", trigger: "blur" },
  ],
  // Add other rules as needed
};

const fetchBusTypes = async () => {
  try {
    const response = await bustypesApi.getAll({ page: 1, limit: 100 });
    busTypes.value = response.items.map((type: BusType) => ({
      label: type.name,
      value: type.ids,
    }));
  } catch (error) {
    console.error("Failed to fetch bus types", error);
  }
};

onMounted(() => {
  fetchBusTypes();
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

    formModel.value = {
      ...rest,
      pictureFiles: Array.isArray(picture)
        ? picture.map((url, index) => ({
            id: `prev-${index}`,
            name: `Image ${index + 1}`,
            status: "finished",
            url: url,
          }))
        : [],
      // Handle single file strings by wrapping in array for Upload component if they exist
      certRegistrationFiles: certificate_registration
        ? [
            {
              id: "reg",
              name: "Registration Cert",
              status: "finished",
              url: certificate_registration,
            },
          ]
        : [],
      certPollutionFiles: certificate_pollution
        ? [
            {
              id: "pol",
              name: "Pollution Cert",
              status: "finished",
              url: certificate_pollution,
            },
          ]
        : [],
      certInsuranceFiles: certificate_insurance
        ? [
            {
              id: "ins",
              name: "Insurance Cert",
              status: "finished",
              url: certificate_insurance,
            },
          ]
        : [],
      certFitnessFiles: certificate_fitness
        ? [
            {
              id: "fit",
              name: "Fitness Cert",
              status: "finished",
              url: certificate_fitness,
            },
          ]
        : [],
      certPermitFiles: certificate_permit
        ? [
            {
              id: "per",
              name: "Permit Cert",
              status: "finished",
              url: certificate_permit,
            },
          ]
        : [],
    };
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
      // Prepare data for submission
      const submitData = {
        ...formModel.value,
        // Extract files from UploadFileInfo objects
        picture:
          formModel.value.pictureFiles?.map((f) => f.file).filter((f) => f) ||
          [],
        certificate_registration:
          formModel.value.certRegistrationFiles?.[0]?.file || null,
        certificate_pollution:
          formModel.value.certPollutionFiles?.[0]?.file || null,
        certificate_insurance:
          formModel.value.certInsuranceFiles?.[0]?.file || null,
        certificate_fitness:
          formModel.value.certFitnessFiles?.[0]?.file || null,
        certificate_permit: formModel.value.certPermitFiles?.[0]?.file || null,
      };

      // Remove the temporary file arrays from the submit object
      delete submitData.pictureFiles;
      delete submitData.certRegistrationFiles;
      delete submitData.certPollutionFiles;
      delete submitData.certInsuranceFiles;
      delete submitData.certFitnessFiles;
      delete submitData.certPermitFiles;

      emit("submit", submitData);
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
                  v-model:value="formModel.bustypeId"
                  :options="busTypes"
                  placeholder="Select Bus Type"
                />
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Bus Layout ID" path="buslayoutId">
                <NInput
                  v-model:value="formModel.buslayoutId"
                  placeholder="Enter Bus Layout ID"
                />
              </NFormItem>
            </NGridItem>

            <NGridItem span="2">
              <NFormItem label="Amenities" path="amenities">
                <NSelect
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
                <NSwitch v-model:value="formModel.status" />
              </NFormItem>
            </NGridItem>
          </NGrid>
        </div>

        <div v-show="currentStep === 2">
          <NGrid :x-gap="24" :y-gap="24" cols="2 s:1 m:2 l:2">
            <NGridItem span="2">
              <NFormItem label="Bus Pictures" path="pictureFiles">
                <NUpload
                  v-model:file-list="formModel.pictureFiles"
                  list-type="image-card"
                  multiple
                  :max="5"
                  :default-upload="false"
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
                  v-model:file-list="formModel.certRegistrationFiles"
                  :max="1"
                  :default-upload="false"
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
                  v-model:file-list="formModel.certPollutionFiles"
                  :max="1"
                  :default-upload="false"
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
                  v-model:file-list="formModel.certInsuranceFiles"
                  :max="1"
                  :default-upload="false"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Fitness Certificate" path="certFitnessFiles">
                <NUpload
                  v-model:file-list="formModel.certFitnessFiles"
                  :max="1"
                  :default-upload="false"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
            <NGridItem>
              <NFormItem label="Permit Certificate" path="certPermitFiles">
                <NUpload
                  v-model:file-list="formModel.certPermitFiles"
                  :max="1"
                  :default-upload="false"
                >
                  <NButton>Upload File</NButton>
                </NUpload>
              </NFormItem>
            </NGridItem>
          </NGrid>
        </div>

        <NSpace justify="end" class="mt-6">
          <NButton @click="emit('cancel')">Cancel</NButton>
          <NButton v-if="currentStep > 1" @click="prevStep">Previous</NButton>
          <NButton v-if="currentStep < 2" type="primary" @click="nextStep"
            >Next</NButton
          >
          <NButton
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
