<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace, NTag } from 'naive-ui';
import { h, ref, onMounted } from 'vue';
import DataTableWrapper from '@/components/common/DataTableWrapper.vue';
import { driversApi } from '@/services/driver.service';
import { DriverStatus, type Driver } from '@/types/driver';
import { useRender } from '@/composables/useRender';


const { renderUserAvatar,renderDate,renderTag } = useRender();

const columns = [
  {
    title: 'Full Name',
    key: 'fullname',
    render: (row: Driver) => renderUserAvatar(row.picture, `${row.fullname}`),
  },
  { title: 'Email', key: 'email' },
  {
    title: 'Phone',
    key: 'phone',
    render: (row: Driver) => `+${row.country_code} ${row.phone}`,
  },
  { title: 'License Number', key: 'licenseNumber' },
  {
    title: 'Status',
    key: 'status',
     render: (row) =>
      renderTag(
        row.status,
        getStatusColor(row.status),
        DriverStatus,
        'DriverStatus',
      ),
  },
  {
    title:'Created Date',
    key:'createdAt',
    render(row: Driver){
      return renderDate(row.createdAt)
    }
  },
  {
    title: 'Action',
    key: 'actions',
    render(row: Driver) {
      return h(NButton, { size: 'small' }, { default: () => 'Edit' });
    },
  },
];


function getStatusColor(status: string) {
  if (status) return 'success';
  if (!status) return 'error';
  return 'default';
}
// fetch function for DataTableWrapper
async function fetchDrivers(params: Record<string, any>) {
  const response = await driversApi.getAll(params);
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}
const extraFilters = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: true },
      { label: 'Inactive', value: false },
    ]
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date-range'
  }
];
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <NSpace justify="space-between" class="mb-3">
          <NButton type="primary" @click="$router.push({ name: 'createDriver' })">
            <template #icon>
              <Icon name="Plus" />
            </template>
            Add Driver
          </NButton>
        </NSpace>
        <DataTableWrapper
          :fetchData="fetchDrivers"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[3,5,7]"
          :scrollX="1000"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>
