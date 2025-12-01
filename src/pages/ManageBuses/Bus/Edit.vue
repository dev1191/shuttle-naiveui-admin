<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage, NLayout, NLayoutContent, NPageHeader, NSpin } from "naive-ui";
import { bussApi } from "@/services/buses/bus.service";
import BusForm from "./components/BusForm.vue";
import { toFormData } from "axios";
import type { Bus } from "@/types/buses/index";

const route = useRoute();
const router = useRouter();
const message = useMessage();
const loading = ref(false);
const initialLoading = ref(true);
const busData = ref<Bus | undefined>(undefined);
const busId = route.params.id as string;

const handleBack = () => {
  router.push("/manage-buses/bus");
};

const fetchBus = async () => {
  try {
    const response = await bussApi.getById(busId);
    busData.value = response.data;
  } catch (error: any) {
    console.error("Fetch bus error:", error);
    message.error("Failed to load bus details");
    handleBack();
  } finally {
    initialLoading.value = false;
  }
};

const handleSubmit = async (data: any) => {
  loading.value = true;
  try {
    const formData = toFormData(data);
    await bussApi.update(busId, formData);
    message.success("Bus updated successfully");
    handleBack();
  } catch (error: any) {
    console.error("Update bus error:", error);
    message.error(error.message || "Failed to update bus");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (busId) {
    fetchBus();
  } else {
    message.error("Invalid Bus ID");
    handleBack();
  }
});
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-4 py-4">
        <NPageHeader @back="handleBack">
          <template #title> Edit Bus </template>
        </NPageHeader>
        <div class="mt-6">
          <NSpin :show="initialLoading">
            <BusForm
              v-if="!initialLoading && busData"
              :model-value="busData"
              :is-edit="true"
              :loading="loading"
              @submit="handleSubmit"
              @cancel="handleBack"
            />
          </NSpin>
        </div>
      </div>
    </NLayoutContent>
  </NLayout>
</template>