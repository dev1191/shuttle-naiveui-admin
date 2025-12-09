<script setup lang="ts">
import { NCard, NSpin } from 'naive-ui'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import OperatorForm from './components/OperatorForm.vue'
import { operatorsApi } from '@/services/operator.service'
import type { Operator, UpdateOperatorDTO } from '@/types/operator'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const loading = ref(false)
const fetchLoading = ref(false)
const operatorData = ref<Operator | undefined>(undefined)

onMounted(async () => {
  await fetchOperator()
})

async function fetchOperator() {
  const operatorId = route.params.id as string
  if (!operatorId) {
    message.error('Operator ID is required')
    router.back()
    return
  }

  fetchLoading.value = true
  try {
    const response = await operatorsApi.getById(operatorId)
    operatorData.value = response.data
  } catch (error: any) {
    console.error('Error fetching operator:', error)
    message.error(error.response?.data?.message || 'Failed to fetch operator')
    router.back()
  } finally {
    fetchLoading.value = false
  }
}

async function handleSubmit(data: UpdateOperatorDTO) {
  const operatorId = route.params.id as string
  loading.value = true
  try {
    await operatorsApi.update(operatorId, data)
    message.success('Operator updated successfully!')
    router.push({ name: 'operatorsList' })
  } catch (error: any) {
    console.error('Error updating operator:', error)
    message.error(error.response?.data?.message || 'Failed to update operator')
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
    <NCard title="Edit Operator">
      <NSpin :show="fetchLoading">
        <OperatorForm 
          v-if="operatorData"
          :is-edit="true"
          :initial-data="operatorData"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </NSpin>
    </NCard>
  </div>
</template>
