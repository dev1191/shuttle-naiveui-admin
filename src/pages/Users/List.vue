<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace, NTag } from 'naive-ui';
import { h, ref, onMounted } from 'vue';
import DataTableWrapper from '@/components/common/DataTableWrapper.vue';
import { adminsApi } from '@/services/admin.service';
import { AdminStatus, type Admin } from '@/types/admin';
import { useRender } from '@/composables/useRender';


const { renderUserAvatar,renderDate,renderTag } = useRender();

const columns = [
  {
    title: 'Full Name',
    key: 'fullname',
    render: (row: Admin) => renderUserAvatar(row.picture, `${row.fullname}`, `${row.email}`),
  },
  {
    title: 'Phone',
    key: 'phone',
    render: (row: Admin) => `+${row.country_code} ${row.phone}`,
  },
  { title: 'Role', key: 'role',sorter:true},
  {
    title: 'Status',
    key: 'is_active',
     render: (row) =>
      renderTag(
        row.is_active,
        getStatusColor(row.is_active),
        AdminStatus,
        'AdminStatus',
      ),
  },
  {
    title:'Created Date',
    key:'createdAt',
    sorter:true,
    render(row: Admin){
      return renderDate(row.createdAt)
    }
  },
  {
    title: 'Action',
    key: 'actions',
    render(row: Admin) {
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
async function fetchAdmins(params: Record<string, any>) {
  const response = await adminsApi.getAll(params);
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
          <NButton type="primary" @click="$router.push({ name: 'createAdmin' })">
            <template #icon>
              <Icon name="Plus" />
            </template>
            Add Admin
          </NButton>
        </NSpace>
        <DataTableWrapper
          :fetchData="fetchAdmins"
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
