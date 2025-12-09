<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTag, NImage, NSpace, NDivider } from 'naive-ui'
import { computed } from 'vue'
import type { Driver } from '@/types/driver'
import { DriverStatus } from '@/types/driver'
import { formatDate } from '@/utils/dateFormat'
import defaultAvatar from '@/assets/images/avatar/default.png'

interface Props {
  driver: Driver
}

const props = defineProps<Props>()

const statusColor = computed(() => {
  return props.driver.status === DriverStatus.Active ? 'success' : 'error'
})

const getDocumentUrl = (doc: string | string[]): string => {
  if (Array.isArray(doc)) return doc[0] || '';
  return doc || '';
}

const hasDocument = (doc: string | string[]): boolean => {
  if (!doc) return false;
  if (Array.isArray(doc) && doc.length === 0) return false;
  return true;
}
</script>

<template>
  <div class="driver-detail-view">
    <!-- Profile Section -->
    <div class="flex items-center gap-4 mb-6">
      <NImage
        :src="getDocumentUrl(driver.picture) || defaultAvatar"
        :fallback-src="defaultAvatar"
        width="80"
        height="80"
        object-fit="cover"
        class="rounded-full"
      />
      <div>
        <h2 class="text-2xl font-bold mb-1">
          {{ driver.firstname }} {{ driver.lastname }}
        </h2>
        <NSpace>
          <NTag :type="statusColor" size="small">
            {{ driver.status ? 'Active' : 'Inactive' }}
          </NTag>
          <NTag type="info" size="small" bordered>
            {{ driver.type }}
          </NTag>
        </NSpace>
      </div>
    </div>

    <NDivider />

    <!-- Basic Information -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Basic Information</h3>
      <NDescriptions :column="2" bordered size="small">
        <NDescriptionsItem label="Short Name">
          {{ driver.short_name }}
        </NDescriptionsItem>
        <NDescriptionsItem label="National ID">
          {{ driver.national_id }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Email">
          {{ driver.email }}
        </NDescriptionsItem>
        <NDescriptionsItem label="Phone">
          +{{ driver.country_code }} {{ driver.phone }}
        </NDescriptionsItem>
         <NDescriptionsItem label="Duty Status">
          {{ driver.duty_status }}
        </NDescriptionsItem>
      </NDescriptions>
    </div>

    <!-- Documents -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Documents</h3>
      <NDescriptions :column="1" bordered size="small">
        <NDescriptionsItem label="Driving License">
          <div v-if="hasDocument(driver.document_licence)">
             <a :href="getDocumentUrl(driver.document_licence)" target="_blank" class="text-primary hover:underline">
               View License
             </a>
          </div>
          <span v-else class="text-gray-400">Not Uploaded</span>
        </NDescriptionsItem>
        <NDescriptionsItem label="National ID Card">
           <div v-if="hasDocument(driver.document_national_icard)">
             <a :href="getDocumentUrl(driver.document_national_icard)" target="_blank" class="text-primary hover:underline">
               View ID Card
             </a>
          </div>
          <span v-else class="text-gray-400">Not Uploaded</span>
        </NDescriptionsItem>
        <NDescriptionsItem label="Police Verification">
           <div v-if="hasDocument(driver.document_police_vertification)">
             <a :href="getDocumentUrl(driver.document_police_vertification)" target="_blank" class="text-primary hover:underline">
               View Verification
             </a>
          </div>
          <span v-else class="text-gray-400">Not Uploaded</span>
        </NDescriptionsItem>
      </NDescriptions>
    </div>

    <!-- System Information -->
    <div>
      <h3 class="text-lg font-semibold mb-3">System Information</h3>
      <NDescriptions :column="2" bordered size="small">
        <NDescriptionsItem label="Created At">
           {{ driver.createdAt ? formatDate(driver.createdAt, true) : '-' }}
        </NDescriptionsItem>

      </NDescriptions>
    </div>
  </div>
</template>

<style scoped>
.driver-detail-view {
  padding: 4px;
}
</style>
