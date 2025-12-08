<template>
  <n-layout>
    <n-layout-content>
      <div class="px-3 py-3">
        <n-card title="Edit Bus Layout" :bordered="false" size="huge">
          <template #header-extra>
             <n-space>
                <n-button secondary type="info" @click="handleTriggerPreview">
                    <template #icon><span class="iconify ph--eye"></span></template>
                    Preview
                </n-button>
                <n-button type="error" secondary @click="goBack">Cancel</n-button>
                <n-button type="primary" :loading="saving" @click="handleTriggerSubmit">
                   Update Layout
                </n-button>
             </n-space>
          </template>
          <div v-if="loading && !initialData" class="flex justify-center p-8">
             <n-spin size="large" />
          </div>
          <BusLayoutForm 
            v-else
            ref="formRef"
            :initial-data="initialData"
            :loading="saving" 
            :is-edit="true"
            @submit="handleUpdate" 
            @cancel="goBack" 
          />
        </n-card>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessage, NSpin } from 'naive-ui';
import BusLayoutForm from './components/BusLayoutForm.vue';
import { busLayoutsApi } from '@/services/buses/busLayout.service';
import type { BusLayout, UpdateBusLayoutDTO } from '@/types/buses/busLayout';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const loading = ref(false);
const saving = ref(false);
const initialData = ref<BusLayout | null>(null);
const formRef = ref<InstanceType<typeof BusLayoutForm> | null>(null);

const id = route.params.id as string;

const handleTriggerSubmit = () => {
    formRef.value?.handleSubmit();
};

const handleTriggerPreview = () => {
    formRef.value?.handlePreview();
};

const fetchData = async () => {
  if (!id) return;
  loading.value = true;
  try {
    const response = await busLayoutsApi.getById(id);
    initialData.value = response.data; // Assuming response is the BusLayout object
  } catch (error: any) {
    message.error('Failed to load bus layout');
    console.error(error);
    goBack();
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async (data: UpdateBusLayoutDTO) => {
  saving.value = true;
  try {
    await busLayoutsApi.update(id, data);
    message.success('Bus layout updated successfully');
    goBack();
  } catch (error: any) {
    message.error(error.message || 'Failed to update bus layout');
    console.error(error);
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchData();
});
</script>