<script setup lang="ts">
import { h, ref } from 'vue';
import { NSwitch, NTag, useMessage, NDrawer, NDrawerContent } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { emailTemplatesApi } from '@/services/emailTemplate.service';
import type { EmailTemplate } from '@/types/settings/emailTemplate';
import { useRender } from '@/composables/useRender';
import { PencilIcon as EditIcon } from 'lucide-vue-next';
import EmailTemplateForm from './components/EmailTemplateForm.vue';

const message = useMessage();
const { t } = useI18n();
const tableRef = ref();
const { renderActionButton } = useRender();

// Drawer state
const showDrawer = ref(false);
const selectedTemplate = ref<EmailTemplate | null>(null);

const handleEdit = (template: EmailTemplate) => {
  selectedTemplate.value = template;
  showDrawer.value = true;
};

const handleFormSuccess = () => {
  loadData();
  handleCloseDrawer();
};

const handleCloseDrawer = () => {
  showDrawer.value = false;
  selectedTemplate.value = null;
};

const getRecipientTypeTag = (type: string) => {
  const typeMap: Record<string, { type: any; label: string }> = {
    admin: { type: 'error', label: 'Admin' },
    operator: { type: 'warning', label: 'Operator' },
    driver: { type: 'info', label: 'Driver' },
    customer: { type: 'success', label: 'Customer' },
  };
  return typeMap[type] || { type: 'default', label: type };
};

const columns: DataTableColumns<EmailTemplate> = [
  { title: 'Name', key: 'name', width: 200, ellipsis: { tooltip: true } },
  {
    title: 'Recipient',
    key: 'recipient_type',
    width: 120,
    render: (row) => {
      const tagInfo = getRecipientTypeTag(row.recipient_type);
      return h(NTag, { type: tagInfo.type, size: 'small' }, { default: () => tagInfo.label });
    },
  },
  {
    title: 'Active',
    key: 'is_active',
    width: 80,
    render: (row) => {
      return h(NSwitch, {
        value: row.is_active,
        size: 'small',
        onUpdateValue: async (value: boolean) => {
          try {
            await emailTemplatesApi.update(row.ids, { is_active: value });
            row.is_active = value;
            message.success('Status updated');
          } catch (error) {
            message.error('Failed to update status');
            console.error('Status update error:', error);
          }
        },
      });
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (row) => [
      renderActionButton(EditIcon, () => handleEdit(row), 'Edit'),
    ],
  },
];

// Fetch function for DataTableWrapper
async function fetchEmailTemplates(params: Record<string, any>) {
  const response = await emailTemplatesApi.getAll(params);
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}

// Reload data function
function loadData() {
  if (tableRef.value?.loadData) {
    tableRef.value.loadData();
  }
}
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <h2 class="text-2xl font-semibold mb-4">Email Templates</h2>
        
        <DataTableWrapper
          ref="tableRef"
          :fetchData="fetchEmailTemplates"
          :columns="columns"
          :extraFilters="[]"
          :defaultPageSize="10"
          :pageSizeOptions="[10, 20, 30]"
          :scrollX="600"
        />

        <!-- Edit Drawer -->
        <NDrawer v-model:show="showDrawer" :width="800" placement="right">
          <NDrawerContent title="Edit Email Template" closable>
            <EmailTemplateForm
              :template="selectedTemplate"
              @success="handleFormSuccess"
              @cancel="handleCloseDrawer"
            />
          </NDrawerContent>
        </NDrawer>
      </div>
    </NLayoutContent>
  </NLayout>
</template>
