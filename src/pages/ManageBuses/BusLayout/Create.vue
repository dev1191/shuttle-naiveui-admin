<template>
  <n-layout>
    <n-layout-content>
      <div class="px-3 py-3">
        <n-card title="Create Bus Layout" :bordered="false" size="huge">
          <template #header-extra>
             <n-space>
                <n-button secondary type="info" @click="handleTriggerPreview">
                    <template #icon><span class="iconify ph--eye"></span></template>
                    Preview
                </n-button>
                <n-button type="error" secondary @click="goBack">Cancel</n-button>
                <n-button type="primary" :loading="loading" @click="handleTriggerSubmit">
                   Create Layout
                </n-button>
             </n-space>
          </template>
          <BusLayoutForm 
            ref="formRef"
            :loading="loading" 
            @submit="handleCreate" 
            @cancel="goBack" 
          />
        </n-card>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import BusLayoutForm from './components/BusLayoutForm.vue';
import { busLayoutsApi } from '@/services/buses/busLayout.service';
import type { CreateBusLayoutDTO } from '@/types/buses/busLayout';

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const formRef = ref<InstanceType<typeof BusLayoutForm> | null>(null);

const handleTriggerSubmit = () => {
    formRef.value?.handleSubmit();
};

const handleTriggerPreview = () => {
    formRef.value?.handlePreview();
};

const handleCreate = async (data: CreateBusLayoutDTO) => {
  loading.value = true;
  try {
    await busLayoutsApi.create(data);
    message.success('Bus layout created successfully');
    goBack();
  } catch (error: any) {
    message.error(error.message || 'Failed to create bus layout');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
    // Assuming standard list route name or back
    router.go(-1);
};
</script>