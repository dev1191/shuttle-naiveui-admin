<script setup lang="ts">
import { NCard } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import OperatorForm from './components/OperatorForm.vue'
import { operatorsApi } from '@/services/operator.service'
import type { CreateOperatorDTO, UpdateOperatorDTO } from '@/types/operator'

const router = useRouter()
const message = useMessage()
const loading = ref(false)

async function handleSubmit(data: CreateOperatorDTO | UpdateOperatorDTO) {
  loading.value = true
  try {
    await operatorsApi.create(data as CreateOperatorDTO)
    message.success('Operator created successfully!')
    router.push({ name: 'operatorsList' })
  } catch (error: any) {
    console.error('Error creating operator:', error)
    message.error(error.response?.data?.message || 'Failed to create operator')
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
    <NCard title="Create New Operator">
      <OperatorForm 
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </NCard>
  </div>
</template>
