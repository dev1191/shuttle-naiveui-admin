<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage, NLayout, NLayoutContent, NPageHeader } from "naive-ui";
import { bussApi } from "@/services/buses/bus.service";
import BusForm from "./components/BusForm.vue";
import { toFormData } from "axios";

const router = useRouter();
const message = useMessage();
const loading = ref(false);

const handleBack = () => {
  router.push({ name: "busesList" });
};

const handleSubmit = async (data: any) => {
  loading.value = true;
  try {
    const formData = toFormData(data);
    await bussApi.create(formData);
    message.success("Bus created successfully");
    handleBack();
  } catch (error: any) {
    console.error("Create bus error:", error);
    message.error(error.message || "Failed to create bus");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-10 py-10">
        <NPageHeader @back="handleBack">
          <template #title> Create New Bus </template>
        </NPageHeader>
        <div class="mt-6">
          <BusForm :loading="loading" @submit="handleSubmit" @cancel="handleBack" />
        </div>
      </div>
    </NLayoutContent>
  </NLayout>
</template>