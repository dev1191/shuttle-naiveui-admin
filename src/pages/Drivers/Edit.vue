<script setup lang="ts">
import { NCard, NSpin } from 'naive-ui'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import DriverForm from './components/DriverForm.vue'
import { driversApi } from '@/services/driver.service'
import type { Driver, UpdateDriverDTO } from '@/types/driver'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const loading = ref(false)
const fetchLoading = ref(false)
const driverData = ref<Driver | undefined>(undefined)

onMounted(async () => {
  await fetchDriver()
})

async function fetchDriver() {
  const driverId = route.params.id as string
  if (!driverId) {
    message.error('Driver ID is required')
    router.back()
    return
  }

  fetchLoading.value = true
  try {
    const response = await driversApi.getById(driverId)
    driverData.value = response.data
  } catch (error: any) {
    console.error('Error fetching driver:', error)
    message.error(error.response?.data?.message || 'Failed to fetch driver')
    router.back()
  } finally {
    fetchLoading.value = false
  }
}

async function handleSubmit(data: UpdateDriverDTO) {
  const driverId = route.params.id as string
  loading.value = true
  try {
    await driversApi.update(driverId, data)
    message.success('Driver updated successfully!')
    router.push({ name: 'driversList' })
  } catch (error: any) {
    console.error('Error updating driver:', error)
    message.error(error.response?.data?.message || 'Failed to update driver')
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
    <NCard title="Edit Driver">
      <NSpin :show="fetchLoading">
        <DriverForm 
          v-if="driverData"
          :is-edit="true"
          :initial-data="driverData"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </NSpin>
    </NCard>
  </div>
</template>
