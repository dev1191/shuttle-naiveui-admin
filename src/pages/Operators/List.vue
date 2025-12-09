<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace, NTag, NDrawer, NDrawerContent, useMessage, useDialog } from 'naive-ui';
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, Edit, Trash2 } from 'lucide-vue-next';
import DataTableWrapper from '@/components/common/DataTableWrapper.vue';
import Icon from '@/components/common/Icon.vue';
import OperatorDetailView from './components/OperatorDetailView.vue';
import { operatorsApi } from '@/services/operator.service';
import { OperatorStatus, type Operator } from '@/types/operator';
import { useRender } from '@/composables/useRender';


const router = useRouter();
const message = useMessage();
const dialog = useDialog();
const { renderUserAvatar, renderDate, renderTag, renderActionButton, renderDeleteActionButton } = useRender();
const tableRef = ref();

// Drawer state
const showDrawer = ref(false);
const selectedOperator = ref<Operator | null>(null);

async function handleView(operator: Operator) {
  try {

    selectedOperator.value = operator;
    showDrawer.value = true;
  } catch (error: any) {
    console.error('Error fetching operator:', error);
    message.error(error.response?.data?.message || 'Failed to fetch operator details');
  }
}

function closeDrawer() {
  showDrawer.value = false;
  selectedOperator.value = null;
}

async function handleDelete(operator: Operator) {
  dialog.warning({
    title: 'Confirm Delete',
    content: `Are you sure you want to delete operator "${operator.firstname} ${operator.lastname}"? This action cannot be undone.`,
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await operatorsApi.delete(operator.ids);
        message.success('Operator deleted successfully');
        // Refresh the table
        if (tableRef.value?.refresh) {
          tableRef.value.refresh();
        } else {
          window.location.reload();
        }
      } catch (error: any) {
        console.error('Error deleting operator:', error);
        message.error(error.response?.data?.message || 'Failed to delete operator');
      }
    }
  });
}


const columns = [
  {
    title: 'Full Name',
    key: 'fullname',
    render: (row: Operator) => renderUserAvatar(row.picture || '', `${row.firstname} ${row.lastname}`, `${row.email}`),
  },
  {
    title: 'Phone',
    key: 'phone',
    render: (row: Operator) => `+${row.country_code} ${row.phone}`,
  },
  { 
    title: 'Business Name', 
    key: 'operator_business_name',
    sorter: true
  },
  {
    title: 'Commission %',
    key: 'operator_commission',
    render: (row: Operator) => `${row.operator_commission}%`,
  },
  {
    title: 'Status',
    key: 'operator_status',
    render: (row: Operator) => {
      const statusColors = {
        [OperatorStatus.Pending]: 'warning',
        [OperatorStatus.Active]: 'success',
        [OperatorStatus.Suspended]: 'error',
        [OperatorStatus.Rejected]: 'error'
      };
      return h(NTag, { 
        type: statusColors[row.operator_status as OperatorStatus] || 'default'
      }, { 
        default: () => row.operator_status 
      });
    },
  },
  {
    title: 'Created At',
    key: 'createdAt',
    sorter: true,
    render(row: Operator) {
      return row.createdAt ? renderDate(row.createdAt, true) : '-';
    }
  },
  {
    title: 'Action',
    key: 'actions',
    width: 180,
    render(row: Operator) {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          // View Button
          renderActionButton(
            Eye,
            () => handleView(row),
            'View',
            undefined,
            '#0ea5e9'
          ),
          
          // Edit Button
          renderActionButton(
            Edit,
            () => router.push({ name: 'editOperator', params: { id: row.ids } }),
            'Edit',
            undefined,
            '#10b981'
          ),
          
          // Delete Button
          renderDeleteActionButton(
            `Are you sure you want to delete operator "${row.firstname} ${row.lastname}"?`,
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

// fetch function for DataTableWrapper
async function fetchOperators(params: Record<string, any>) {
  const response = await operatorsApi.getAll(params);
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
    key: 'operator_status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Pending', value: OperatorStatus.Pending },
      { label: 'Active', value: OperatorStatus.Active },
      { label: 'Suspended', value: OperatorStatus.Suspended },
      { label: 'Rejected', value: OperatorStatus.Rejected }
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
          <NButton type="primary" @click="$router.push({ name: 'createOperator' })">
            <template #icon>
              <Icon name="Plus" />
            </template>
            Add Operator
          </NButton>
        </NSpace>
        <DataTableWrapper
          ref="tableRef"
          :fetchData="fetchOperators"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[10, 20, 50]"
          :scrollX="1200"
        />
      </div>
    </NLayoutContent>

    <!-- Operator Detail Drawer -->
    <NDrawer v-model:show="showDrawer" :width="700" placement="right">
      <NDrawerContent title="Operator Details" closable>
        <OperatorDetailView v-if="selectedOperator" :operator="selectedOperator" />
      </NDrawerContent>
    </NDrawer>
  </NLayout>
</template>
