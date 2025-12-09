<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTag, NImage, NSpace, NText, NDivider } from 'naive-ui'
import { computed } from 'vue'
import type { Operator } from '@/types/operator'
import { OperatorStatus } from '@/types/operator'
import { formatDate } from '@/utils/dateFormat'
import defaultAvatar from '@/assets/images/avatar/default.png'

interface Props {
  operator: Operator
}

const props = defineProps<Props>()

const statusColor = computed(() => {
  switch (props.operator.operator_status) {
    case OperatorStatus.Active:
      return 'success'
    case OperatorStatus.Pending:
      return 'warning'
    case OperatorStatus.Suspended:
      return 'error'
    case OperatorStatus.Rejected:
      return 'error'
    default:
      return 'default'
  }
})


</script>

<template>
  <div class="operator-detail-view">
    <!-- Profile Section -->
    <div class="flex items-center gap-4 mb-6">
      <NImage
        :src="operator.picture || defaultAvatar"
        :fallback-src="defaultAvatar"
        width="80"
        height="80"
        object-fit="cover"
        class="rounded-full"
      />
      <div>
        <h2 class="text-2xl font-bold mb-1">
          {{ operator.firstname }} {{ operator.lastname }}
        </h2>
        <NSpace>
          <NTag :type="statusColor" size="small">
            {{ operator.operator_status }}
          </NTag>

        </NSpace>
      </div>
    </div>

    <NDivider />

    <!-- Basic Information -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Basic Information</h3>
      <NDescriptions :column="2" bordered size="small">
        <NDescriptionsItem label="First Name">
          {{ operator.firstname }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Last Name">
          {{ operator.lastname }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Email">
          {{ operator.email }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Phone">
          +{{ operator.country_code }} {{ operator.phone }}
        </NDescriptionsItem>
      </NDescriptions>
    </div>

    <!-- Business Information -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Business Information</h3>
      <NDescriptions :column="2" bordered size="small">
        <NDescriptionsItem label="Business Name">
          {{ operator.operator_business_name }}
        </NDescriptionsItem>
        <NDescriptionsItem label="License Number">
          {{ operator.operator_license_number }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Commission">
          {{ operator.operator_commission }}%
        </NDescriptionsItem>
        <NDescriptionsItem label="Status">
          <NTag :type="statusColor" size="small">
            {{ operator.operator_status }}
          </NTag>
        </NDescriptionsItem>
      </NDescriptions>
    </div>

    <!-- Approval Information (if applicable) -->
    <div v-if="operator.operator_approved_by || operator.operator_rejection_reason" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Approval Information</h3>
      <NDescriptions :column="1" bordered size="small">
        <NDescriptionsItem v-if="operator.operator_approved_by" label="Approved By">
          {{ operator.operator_approved_by }}
        </NDescriptionsItem>
        <NDescriptionsItem v-if="operator.operator_approved_at" label="Approved At">
          {{ formatDate(operator.operator_approved_at, true) }}
        </NDescriptionsItem>
        <NDescriptionsItem v-if="operator.operator_rejection_reason" label="Rejection Reason">
          <NText type="error">{{ operator.operator_rejection_reason }}</NText>
        </NDescriptionsItem>
      </NDescriptions>
    </div>

    <!-- Documents -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Documents</h3>
      <NDescriptions :column="1" bordered size="small">
        <NDescriptionsItem label="Transport License">
          <a v-if="operator.operator_transport_license" :href="operator.operator_transport_license" target="_blank" class="text-blue-500 hover:underline">
            View Document
          </a>
          <NText v-else depth="3">Not uploaded</NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="Business Registration">
          <a v-if="operator.operator_business_registration" :href="operator.operator_business_registration" target="_blank" class="text-blue-500 hover:underline">
            View Document
          </a>
          <NText v-else depth="3">Not uploaded</NText>
        </NDescriptionsItem>
      </NDescriptions>
    </div>

    <!-- System Information -->
    <div>
      <h3 class="text-lg font-semibold mb-3">System Information</h3>
      <NDescriptions :column="2" bordered size="small">
        <NDescriptionsItem label="Created At">
          
           {{ formatDate(operator.createdAt, true) }} 
        </NDescriptionsItem>
      </NDescriptions>
    </div>
  </div>
</template>

<style scoped>
.operator-detail-view {
  padding: 4px;
}
</style>
