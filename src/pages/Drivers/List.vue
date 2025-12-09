<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace, NDrawer, NDrawerContent, useMessage, useDialog } from 'naive-ui';
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, Edit, Trash2 } from 'lucide-vue-next';
import DataTableWrapper from '@/components/common/DataTableWrapper.vue';
import Icon from '@/components/common/Icon.vue';
import DriverDetailView from './components/DriverDetailView.vue';
import { driversApi } from '@/services/driver.service';
import { DriverStatus, type Driver } from '@/types/driver';
import { useRender } from '@/composables/useRender';

const router = useRouter();
const message = useMessage();
const dialog = useDialog();
const { renderUserAvatar, renderDate, renderTag, renderActionButton, renderDeleteActionButton } = useRender();
const tableRef = ref();

// Drawer state
const showDrawer = ref(false);
const selectedDriver = ref<Driver | null>(null);

async function handleView(driver: Driver) {
  selectedDriver.value = driver;
  showDrawer.value = true;
}

async function handleDelete(driver: Driver) {
  dialog.warning({
    title: 'Confirm Delete',
    content: `Are you sure you want to delete driver "${driver.firstname} ${driver.lastname}"? This action cannot be undone.`,
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await driversApi.delete(driver._id);
        message.success('Driver deleted successfully');
        if (tableRef.value?.refresh) {
          tableRef.value.refresh();
        } else {
           window.location.reload();
        }
      } catch (error: any) {
        console.error('Error deleting driver:', error);
        message.error(error.response?.data?.message || 'Failed to delete driver');
      }
    }
  });
}

const columns = [
  {
    title: 'Full Name',
    key: 'fullname',
    render: (row: Driver) => renderUserAvatar(row.picture, `${row.firstname} ${row.lastname}`, `${row.email}`),
  },
  {
    title: 'Phone',
    key: 'phone',
    render: (row: Driver) => `+${row.country_code} ${row.phone}`,
  },
  { title: 'Type', key: 'type',sorter:true},
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
    sorter:true,
    render(row: Driver){
      return row.createdAt ? renderDate(row.createdAt, true) : '-'
    }
  },
  {
    title: 'Action',
    key: 'actions',
    width: 140,
    render(row: Driver) {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          renderActionButton(
            Eye,
            () => handleView(row),
            'View',
            undefined,
            '#0ea5e9'
          ),
          renderActionButton(
            Edit,
            () => router.push({ name: 'editDriver', params: { id: row.ids } }),
            'Edit',
            undefined,
            '#10b981'
          ),
          renderDeleteActionButton(
            `Are you sure you want to delete driver?`,
            () => handleDelete(row),
             'Delete',
             null,
             'error'
          )
        ]
      });
    },
  },
];

function getStatusColor(status: boolean) {
  if (status) return 'success';
  return 'error';
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
    sortBy: params.sortBy || '',
    sortDesc: params.sortDesc || ''
  };
}
const extraFilters = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
       { label: "Active", value: DriverStatus.Active },
  { label: "Inactive", value: DriverStatus.Inactive },
  { label: "OnRoute", value: DriverStatus.OnRoute },
  { label: "Breakdown", value: DriverStatus.Breakdown },
  { label: "Idle", value: DriverStatus.Idle },
  { label: "Maintenance", value: DriverStatus.Maintenance },
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
          ref="tableRef"
          :fetchData="fetchDrivers"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[3,5,7]"
          :scrollX="1000"
        />
      </div>
    </NLayoutContent>

    <!-- Driver Detail Drawer -->
    <NDrawer v-model:show="showDrawer" :width="700" placement="right">
      <NDrawerContent title="Driver Details" closable>
        <DriverDetailView v-if="selectedDriver" :driver="selectedDriver" />
      </NDrawerContent>
    </NDrawer>
  </NLayout>
</template>
