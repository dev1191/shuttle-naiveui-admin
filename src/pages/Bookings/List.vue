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
  Clock ,
  Eye as EyeIcon
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores'

const router = useRouter()
const message = useMessage()
const { renderDate,renderUserAvatar,renderActionButton } = useRender()
const { generalSettings } = useAuthStore()
const currentStatus = ref('Scheduled')
const refreshKey = ref(0)

const tabs = [
  { name: 'Scheduled', icon: Calendar, color: '#2080f0' },
  { name: 'OnBoarded', icon: UserCheck, color: '#f0a020' },
  { name: 'Completed', icon: CheckCircle, color: '#18a058' },
  { name: 'Cancelled', icon: XCircle, color: '#d03050' },
  { name: 'Expired', icon: Clock, color: '#909090' }
]

const columns = [
  {
    title: 'PNR NO',
    key: 'pnr_no'
  },
  {
    title: 'Customer',
    key: 'customer_name',
    render: (row) => renderUserAvatar(row.customer_avatar, `${row.customer_name}`, `${row.customer_phone}`),
  
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
    render: (row: Booking) => `${generalSettings.currency_symbol}${row.final_total_fare}`
  },
  {
    title: 'Payment Status',
    key: 'payment_status',
    render: (row: Booking) => {
      let type: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
      switch (row.payment_status) {
        case 'Pending': type = 'info'; break;
        case 'Processing': type = 'warning'; break;
        case 'Completed': type = 'success'; break;
        case 'Cancelled': type = 'error'; break;
        case 'Failed': type = 'default'; break;
      }
      return h(NTag, { type, bordered: false, round: true }, { default: () => row.payment_status })
    }
  },
  {
    title: 'Action',
    key: 'actions',
    render(row: Booking) {
      return h(NSpace, {}, {
        default: () => [
          renderActionButton(EyeIcon, () => viewDetail(row), 'View',null,'primary'),
        ]
      })
    }
  },
]

const viewDetail = async () =>{

}

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

const extraFilters = [
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date-range'
  }
];
</script>

<template>
  <div class="page-container p-4">
    <NCard title="Bookings">
      <NTabs size="large" type="segment" animated :value="currentStatus" @update:value="handleTabChange">
        <NTabPane v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <template #tab>
            <div class="flex items-center gap-2">
              <NIcon :color="tab.color">
                <component :is="tab.icon" />
              </NIcon>
              <NText :color="tab.color">{{ tab.name }}</NText>     
            </div>
          </template>
        </NTabPane>
      </NTabs>
      
      <div class="mt-4">
        <DataTableWrapper
          :key="refreshKey"
          :fetchData="fetchData"
          :columns="columns"
            :extraFilters="extraFilters"
        />
      </div>
    </NCard>
  </div>
</template>
