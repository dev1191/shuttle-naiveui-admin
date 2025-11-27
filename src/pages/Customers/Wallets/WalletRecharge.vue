<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NSpace, NInputNumber, NButton, useMessage, NGrid, NGi } from 'naive-ui'
import CustomerAutocomplete from '@/components/customers/CustomerAutocomplete.vue'
import type { Customer } from '@/types/customer'
import { customersApi } from '@/services/customer.service'
import { useAuthStore } from '@/stores'

const message = useMessage()
const selectedCustomer = ref<Customer | null>(null)
const customerId = ref<string | null>(null)
const amount = ref<number | null>(50)
const loading = ref(false)
const { user } = useAuthStore()

const handleSelectCustomer = (customer: Customer | null) => {
  selectedCustomer.value = customer
  customerId.value = customer?.ids
}

const handleRecharge = async () => {
  if (!customerId.value || !amount.value) return
  
  loading.value = true
  try {
     await customersApi.rechargeWallet({
        userId: customerId.value,
        amount: amount.value,
        adminId: user?.id
     })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success(`Successfully recharged ${amount.value} to ${selectedCustomer.value?.fullname}`)
    amount.value = null
    customerId.value = null
    selectedCustomer.value = null
  } catch (error) {
    message.error('Failed to recharge wallet')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <NGrid x-gap="12" :cols="1">
      <NGi>
        <NCard title="Customer Wallet Recharge" :bordered="false" class="shadow-sm">
          <NSpace vertical size="large" class="max-w-md mx-auto">
            <div class="text-center mb-4">
              <h2 class="text-xl font-semibold">Recharge Wallet</h2>
              <p class="text-gray-500">Search for a customer to add funds to their wallet</p>
            </div>

            <CustomerAutocomplete
              v-model:value="customerId"
              @select="handleSelectCustomer"
              placeholder="Search customer by name or phone..."
            />
            
            <div v-if="selectedCustomer" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all">
              <div class="font-medium mb-2 text-gray-700 dark:text-gray-300">Customer Details</div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Name:</span>
                  <span class="font-medium">{{ selectedCustomer.fullname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Phone:</span>
                  <span>+{{ selectedCustomer.country_code }} {{ selectedCustomer.phone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Email:</span>
                  <span>{{ selectedCustomer.email }}</span>
                </div>
              </div>
            </div>

            <NInputNumber
              v-model:value="amount"
              placeholder="Enter Amount"
              :min="1"
              class="w-full"
              size="large"
            >
              <template #prefix>
                $
              </template>
            </NInputNumber>

            <NButton
              type="primary"
              block
              size="large"
              :disabled="!selectedCustomer || !amount"
              :loading="loading"
              @click="handleRecharge"
            >
              Recharge Wallet
            </NButton>
          </NSpace>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>