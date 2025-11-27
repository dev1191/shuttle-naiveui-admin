<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace } from 'naive-ui';
import DataTableWrapper from '@/components/common/DataTableWrapper.vue';
import { customersApi } from '@/services/customer.service';
import { CustomerStatus, type Customer } from '@/types/customer';
import { useRender } from '@/composables/useRender';
import { useRouter } from 'vue-router';
import { Eye, Edit2, Wallet, List, Trash2 } from 'lucide-vue-next';

const { renderUserAvatar, renderDate, renderTag, renderDropdownMenu, renderIcon } = useRender();

const router = useRouter();

function getActionOptions(row: Customer) {
  return [
    { key: 'view', label: 'View', icon: renderIcon(Eye) },
    { key: 'edit', label: 'Edit', icon: renderIcon(Edit2) },
    { key: 'wallet', label: 'Wallet Histories', icon: renderIcon(Wallet) },
    { key: 'bookings', label: 'Booking Histories', icon: renderIcon(List) },
    { key: 'delete', label: 'Delete', icon: renderIcon(Trash2) },
  ];
}

function handleAction(key: string, row: Customer) {
  switch (key) {
    case 'view':
      router.push({ name: 'viewCustomer', params: { id: row.ids } });
      break;
    case 'edit':
      router.push({ name: 'editCustomer', params: { id: row.ids } });
      break;
    case 'wallet':
      router.push({ name: 'walletHistory', params: { id: row.ids } });
      break;
    case 'bookings':
      router.push({ name: 'bookingHistory', params: { id: row.ids } });
      break;
    case 'delete':
      customersApi.delete(row.ids).then(() => {
        // TODO: emit refresh event if needed
      });
      break;
  }
}

function getStatusColor(status: boolean) {
  return status ? 'success' : 'error';
}

const columns = [
  {
    title: 'Full Name',
    key: 'fullname',
    render: (row: Customer) =>
      renderUserAvatar(row.picture, `${row.fullname}`, `${row.email}`),
  },
  { title: 'Gender', key: 'gender' },
  {
    title: 'Phone',
    key: 'phone',
    render: (row: Customer) => `+${row.country_code} ${row.phone}`,
  },
  { title: 'Wallet Balance', key: 'wallet_balance' },
  {
    title: 'Status',
    key: 'status',
    render: (row: Customer) =>
      renderTag(row.status, getStatusColor(row.status), CustomerStatus, 'CustomerStatus'),
  },
  {
    title: 'Created Date',
    key: 'createdAt',
    render: (row: Customer) => renderDate(row.createdAt),
  },
  {
    title: 'Action',
    key: 'actions',
    render: (row: Customer) =>
      renderDropdownMenu(getActionOptions(row), (key) => handleAction(key, row)),
  },
];

async function fetchCustomers(params: Record<string, any>) {
  const response = await customersApi.getAll(params);
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
    ],
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date-range',
  },
];
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <!-- Add Customer button (uncomment if needed) -->
        <!--
        <NSpace justify="space-between" class="mb-3">
          <NButton type="primary" @click="$router.push({ name: 'createCustomer' })">
            <template #icon><Icon name="Plus" /></template>
            Add Customer
          </NButton>
        </NSpace>
        -->
        <DataTableWrapper
          :fetchData="fetchCustomers"
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
