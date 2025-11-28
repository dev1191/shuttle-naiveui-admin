<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NAvatar, NButton } from "naive-ui";
import type { Customer } from "@/types/customer";


const props = defineProps<{
  viewingCustomer: Customer;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', customer: Customer): void;
}>();


</script>


<template>
      <!-- Customer Avatar and Basic Info -->
      <div class="flex items-center gap-4 mb-6">
        <NAvatar :src="viewingCustomer.picture" :size="80" round />
        <div>
          <h3 class="text-xl font-semibold">{{ viewingCustomer.fullname }}</h3>
          <p class="text-gray-500">{{ viewingCustomer.email }}</p>
        </div>
      </div>

      <!-- Customer Details -->
      <NDescriptions bordered :column="2">
        <NDescriptionsItem label="Phone">
          +{{ viewingCustomer.country_code }} {{ viewingCustomer.phone }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Gender">
          {{ viewingCustomer.gender || "N/A" }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Wallet Balance">
          {{ viewingCustomer.wallet_balance || 0 }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Gender">
          {{ viewingCustomer.gender || "Other" }}
        </NDescriptionsItem>

        <NDescriptionsItem label="Status">
          <span
            :class="viewingCustomer.status ? 'text-green-600' : 'text-red-600'"
          >
            {{ viewingCustomer.status ? "Active" : "Inactive" }}
          </span>
        </NDescriptionsItem>
        <NDescriptionsItem label="Created At">
            {{ viewingCustomer.createdAt }}
        </NDescriptionsItem>
      </NDescriptions>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-2">
        <NButton @click="emit('close')"> Close </NButton>
        <NButton
          type="primary"
          @click="emit('edit', viewingCustomer)"
        >
          Edit Customer
        </NButton>
      </div>
</template>