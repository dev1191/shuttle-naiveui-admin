<script setup lang="ts">
import { NLayout, NLayoutContent, NButton, NSpace, NTag, NUploadFileList } from 'naive-ui';
import { h, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import type { FormRules } from 'naive-ui';
import DataTableWrapper from '@/components/common/DataTableWrapper.vue';
import FormDrawer from '@/components/common/FormDrawer.vue';
import Icon from '@/components/common/Icon.vue';
import { adminsApi } from '@/services/admin.service';
import { AdminStatus, type Admin, type CreateAdminDTO, type UpdateAdminDTO } from '@/types/admin';
import { useRender } from '@/composables/useRender';
import { useAuthStore } from '@/stores/auth';
import UserForm from './components/UserForm.vue';

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const { t } = useI18n();
const { renderUserAvatar, renderDate, renderTag, renderDropdownMenu } = useRender();
const tableRef = ref(null);
const { user } = useAuthStore()

// FormDrawer state
const showDrawer = ref(false);
const drawerMode = ref<'create' | 'edit'>('create');
const selectedAdmin = ref<Admin | null>(null);
const formLoading = ref(false);

// Map roles from authStore to select options format
const roleOptions = computed(() => 
  authStore.roles.map(role => ({
    label: role.text,
    value: role.value
  }))
);

const columns = [
  {
    title: 'Full Name',
    key: 'fullname',
    render: (row: Admin) => renderUserAvatar(row.picture, `${row.fullname}`, `${row.email}`),
  },
  {
    title: 'Phone',
    key: 'phone',
    render: (row: Admin) => row.country_code ? `+${row.country_code} ${row.phone}` : row.phone,
  },
  { title: 'Role', key: 'role',sorter:true},
  {
    title: 'Status',
    key: 'is_active',
     render: (row: Admin) =>
      renderTag(
        row.is_active,
        getStatusColor( row.is_active),
        AdminStatus,
        'AdminStatus',
      ),
  },
  {
    title:'Created Date',
    key:'createdAt',
    sorter:true,
    render(row: Admin){
      return row.createdAt ? renderDate(row.createdAt,true) : 'N/A'
    }
  },
  {
    title: 'Action',
    key: 'actions',
    width: 80,
    align: 'center',
    render(row: Admin) {
      return    row.ids !== user.id ?  renderDropdownMenu(
        [
  
          {
            label: 'Edit',
            key: 'edit',
            icon: () => h(Icon, { name: 'Pencil', size: 16 }),
          },
          {
            type: 'divider',
            key: 'd1',
          },
        {
            label: 'Delete',
            key: 'delete',
            icon: () => h(Icon, { name: 'Trash2', size: 16 }),
            props: {
              style: 'color: #d03050;'
            }
          } ,
        ],
        (key: string | number) => handleAction(key as string, row)
      ) :renderDropdownMenu(
        [
  
          {
            label: 'Edit',
            key: 'edit',
            icon: () => h(Icon, { name: 'Pencil', size: 16 }),
          },
        ],
        (key: string | number) => handleAction(key as string, row)
      );
    },
  },
];


function getStatusColor(status: string | boolean) {
  if (status) return 'success';
  if (!status) return 'error';
  return 'default';
}

// Handle dropdown actions
async function handleAction(action: string, row: Admin) {
  switch (action) {
    case 'view':
      handleView(row);
      break;
    case 'edit':
      handleEdit(row);
      break;
    case 'delete':
      await handleDelete(row);
      break;
  }
}

// View admin details
function handleView(admin: Admin) {
  selectedAdmin.value = admin;
  drawerMode.value = 'edit';
  showDrawer.value = true;
}

// Edit admin
function handleEdit(admin: Admin) {
  selectedAdmin.value = admin;
  drawerMode.value = 'edit';
  showDrawer.value = true;
}

// Create new admin
function handleCreate() {
  selectedAdmin.value = null;
  drawerMode.value = 'create';
  showDrawer.value = true;
}

// Delete admin
async function handleDelete(admin: Admin) {
  try {
    await adminsApi.delete(admin.ids);
    message.success(`Admin "${admin.fullname}" deleted successfully`);
    // Refresh the table
    if (tableRef.value) {
      tableRef.value.handleRefresh();
    }
  } catch (error: any) {
    message.error(error.message || 'Failed to delete admin');
  }
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

// Form validation rules
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    firstname: { required: true, message: 'First Name is required', trigger: 'blur' },
    lastname: { required: true, message: 'Last Name is required', trigger: 'blur' },
    email: [
      { required: true, message: 'Email is required', trigger: ['blur', 'input'] },
      { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'input'] }
    ],
    phone: [
      { required: true, message: 'Phone number is required', trigger: ['blur', 'input'] },
      { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number', trigger: ['blur', 'input'] }
    ],
    role: { required: true, message: 'Role is required', trigger: ['blur', 'change'] }
  };



  return rules;
});


// Handle form submission
async function handleFormSubmit(formData: Admin) {
  // Validate passwords match
  if (formData.password || formData.confirmPassword) {
    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
  }

  formLoading.value = true;
  try {
    if (drawerMode.value === 'create') {
      await adminsApi.create(formData as CreateAdminDTO);
      message.success('Admin created successfully');
    } else {
      // Remove password fields if empty to avoid updating them
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      if (!updateData.confirmPassword) delete updateData.confirmPassword;
      
      await adminsApi.update(selectedAdmin.value!.ids, updateData as UpdateAdminDTO);
      message.success('Admin updated successfully');
    }
    showDrawer.value = false;
    // Refresh table
    if (tableRef.value) {
      tableRef.value.handleRefresh();
    }
  } catch (error: any) {
    message.error(error.message || `Failed to ${drawerMode.value} admin`);
  } finally {
    formLoading.value = false;
  }
}

// Computed drawer title
const drawerTitle = computed(() => 
  drawerMode.value === 'create' ? 'Create New Admin' : 'Edit Admin'
);
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <NSpace justify="space-between" class="mb-3">
          <NButton type="primary" @click="handleCreate">
            <template #icon>
              <Icon name="Plus" />
            </template>
            Add Admin
          </NButton>
        </NSpace>
        <DataTableWrapper
          ref="tableRef"
          :fetchData="fetchAdmins"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[5,7,10,100,1000]"
          :scrollX="100"
        />
      </div>
    </NLayoutContent>

    <!-- FormDrawer for Create/Edit -->
    <FormDrawer
      v-model:show="showDrawer"
      :title="drawerTitle"
      :rules="formRules"
      :modelValue="selectedAdmin"
      :loading="formLoading"
      :width="600"
      @submit="handleFormSubmit"
      @cancel="showDrawer = false"
    >
      <template #default="{ model }">
        <UserForm :model="model" :mode="drawerMode" :role-options="roleOptions" />
      </template>
    </FormDrawer>
  </NLayout>
</template>
