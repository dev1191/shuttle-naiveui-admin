<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  useMessage,
  type FormInst,
  type FormRules,
} from "naive-ui";
import { stopsApi } from "@/services/stop.service";
import type { CreateStopDTO } from "@/types/stop";
import FormInput from "@/components/common/FormInput.vue";
import OpenLayersMap from "./OpenLayersMap.vue";
import { useRouter } from "vue-router";
import { useImageUpload } from "@/composables/useImageUpload";

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);

// Use image upload composable with folder configuration
const {
  fileList,
  handleUploadChange,
  loadExistingFiles,
  getFilesForSubmit,
  uploading
} = useImageUpload({
  folder: 'stops',
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 85,
  autoUpload: true  // Enable auto-upload when files are selected
});

const formData = reactive<CreateStopDTO>({
  title: "",
  landmark: "",
  lat: 0,
  lng: 0,
  type: '',
  status: true,
  files: [] as any,
});

const rules: FormRules = {
  title: [{ required: true, message: "Please enter title", trigger: "blur" }],
  lat: [
    {
      required: true,
      type: "number",
      message: "Please enter latitude",
      trigger: "blur",
    },
  ],
  lng: [
    {
      required: true,
      type: "number",
      message: "Please enter longitude",
      trigger: "blur",
    },
  ],
};

const fetchData = async () => {
  if (!props.id) return;

  loading.value = true;
  try {
    const response = await stopsApi.getById(props.id);
    const data = response.data;
    Object.assign(formData, {
      title: data.title,
      landmark: data.landmark ?? data.address,
      lat: data.lat,
      lng: data.lng,
      status: data.status,
      type: data.type,
    });

    // Load existing files using composable
    loadExistingFiles(data.files);
  } catch (error) {
    console.error("Failed to fetch stop:", error);
    message.error("Failed to load stop details");
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    const submitData: any = { ...formData };

    // Get files for submission using composable
    const files = getFilesForSubmit(!!props.id);
    if (files.length > 0) {
      submitData.files = files;
    } else {
      submitData.files = [];
    }

    if (props.id) {
      await stopsApi.update(props.id, submitData);
      message.success("Stop updated successfully");
    } else {
      await stopsApi.create(submitData);
      message.success("Stop created successfully");
    }

    router.push("/manage-routes/stops/stop-list");
  } catch (error: any) {
    console.error("Submit error:", error);
    message.error(error.response?.data?.message || "Operation failed");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <n-card :title="id ? 'Edit Stop' : 'Create Stop'">
    <template #header-extra>
      <n-space>
        <n-button @click="router.back()">Cancel</n-button>
        <n-button type="primary" :loading="loading" @click="onSubmit">
          {{ id ? "Update" : "Create" }}
        </n-button>
      </n-space>
    </template>
    
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen">
        <!-- Left Column: Form Fields -->
        <n-gi>
          <n-grid :cols="1" :y-gap="16">
            <n-gi>
              <FormInput
                v-model="formData.title"
                label="Title"
                path="title"
                placeholder="Enter stop title"
              />
            </n-gi>
            
            <n-gi>
              <FormInput
                v-model="formData.landmark"
                label="Landmark"
                path="landmark"
                placeholder="Enter landmark"
              />
            </n-gi>
            
            <n-gi>
              <n-grid :cols="2" :x-gap="12">
                <n-gi>
                  <n-form-item label="Latitude" path="lat">
                    <n-input-number
                      v-model:value="formData.lat"
                      placeholder="Enter latitude"
                      :step="0.000001"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="Longitude" path="lng">
                    <n-input-number
                      v-model:value="formData.lng"
                      placeholder="Enter longitude"
                      :step="0.000001"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-gi>
              </n-grid>
            </n-gi>
            
            <n-gi>
              <n-form-item label="Status" path="status">
                <n-switch v-model:value="formData.status" />
              </n-form-item>
            </n-gi>
            
            <n-gi>
              <n-form-item label="Images" path="files">
                <n-upload
                  v-model:file-list="fileList"
                  list-type="image-card"
                  @change="handleUploadChange"
                  accept="image/*"
                  :max="8"
                >
                  Click to Upload
                </n-upload>
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-gi>

        <!-- Right Column: Map -->
        <n-gi>
          <OpenLayersMap
            v-model:lat="formData.lat"
            v-model:lng="formData.lng"
            :auto-detect-location="!id"
          />
        </n-gi>
      </n-grid>
    </n-form>
  </n-card>
</template>
