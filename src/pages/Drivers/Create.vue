<script setup lang="ts">
import { NCard } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import DriverForm from './components/DriverForm.vue'
import { driversApi } from '@/services/driver.service'
import type { CreateDriverDTO } from '@/types/driver'

const router = useRouter()
const message = useMessage()
const loading = ref(false)

async function handleSubmit(data: CreateDriverDTO) {
  loading.value = true
  try {
    await driversApi.create(data)
    message.success('Driver created successfully!')
    router.push({ name: 'driversList' })
  } catch (error: any) {
    console.error('Error creating driver:', error)
    message.error(error.response?.data?.message || 'Failed to create driver')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="p-1">
    <NCard title="Create New Driver">
      <DriverForm 
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </NCard>
  </div>
</template>
