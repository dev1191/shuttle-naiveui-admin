<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NCard, NTabs, NTabPane, NSpace, NTag, useMessage, NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'
import DataTableWrapper from '@/components/common/DataTableWrapper.vue'
import { bookingsApi } from '@/services/booking.service'
import type { Booking } from '@/types/booking'
import { useRender } from '@/composables/useRender'
import { 
  Calendar, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-vue-next'

const router = useRouter()
const message = useMessage()
const { renderDate } = useRender()

const currentStatus = ref('Scheduled')
const refreshKey = ref(0)

const tabs = [
  { name: 'Scheduled', icon: Calendar },
  { name: 'OnBoarded', icon: UserCheck },
  { name: 'Completed', icon: CheckCircle },
  { name: 'Cancelled', icon: XCircle },
  { name: 'Expired', icon: Clock }
]

const columns = [
  {
    title: 'PNR NO',
    key: 'pnr_no'
  },
  {
    title: 'Customer',
    key: 'customer_name'
  },
  {
    title: 'Route',
    key: 'route_name'
  },
  {
    title: 'Travel Date',
    key: 'travel_date',
    render: (row: Booking) => renderDate(row.travel_date)
  },
  {
    title: 'Price',
    key: 'final_total_fare',
    render: (row: Booking) => `${row.price}`
  },
  {
    title: 'Status',
    key: 'status',
    render: (row: Booking) => {
      let type: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
      switch (row.status) {
        case 'Scheduled': type = 'info'; break;
        case 'OnBoarded': type = 'warning'; break;
        case 'Completed': type = 'success'; break;
        case 'Cancelled': type = 'error'; break;
        case 'Expired': type = 'default'; break;
      }
      return h(NTag, { type, bordered: false, round: true }, { default: () => row.status })
    }
  }
]

const fetchData = async (params: any) => {
  const response = await bookingsApi.getAll({ 
    ...params, 
    travel_status: currentStatus.value 
  })
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages
  }
}

const handleTabChange = (value: string) => {
  currentStatus.value = value
  refreshKey.value++
}
</script>

<template>
  <div class="page-container p-4">
    <NCard title="Bookings">
      <NTabs size="large" type="segment" animated :value="currentStatus" @update:value="handleTabChange">
        <NTabPane v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <template #tab>
            <div class="flex items-center gap-2">
              <NIcon>
                <component :is="tab.icon" />
              </NIcon>
              {{ tab.name }}
            </div>
          </template>
        </NTabPane>
      </NTabs>
      
      <div class="mt-4">
        <DataTableWrapper
          :key="refreshKey"
          :fetchData="fetchData"
          :columns="columns"
        />
      </div>
    </NCard>
  </div>
</template>
