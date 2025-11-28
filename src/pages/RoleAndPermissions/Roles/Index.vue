<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { rolesApi } from "@/services/role.service";
import type { Role } from "@/types/role";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const selectedRole = ref<Role | null>(null);
const tableRef = ref();
const { renderActionButton } = useRender();

const router = useRouter()

const formFields = [
  { key: "name", label: "Role Name", required: true },
  {
    key: "slug",
    label: "Slug",
    required: true,
    type: "text",
    placeholder: "e.g., admin, user",
  },
  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Role> = [
  { title: "Name", key: "name" },
  { title: "Slug", key: "slug" },
  {
    title: "Permisions",
    key: "permissions",
    render: (row) =>  h('span', { style: { color: 'blue' } }, row.permissions.length)
  },
  {
    title: "Actions",
    key: "actions",
     render: (row) =>
      [
        renderActionButton(EditIcon, () => { 
          router.push(`roles/${row.ids}`)
        
        }),
      ],
  },
];

const handleAdd = () => {
  selectedRole.value = null;
  showDrawer.value = true;
};

const handleEdit = (role: Role) => {
  selectedRole.value = { ...role };
  showDrawer.value = true;
};

const handleDelete = async (role: Role) => {
  try {
    const response = await rolesApi.delete(role.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Role) => {
  loading.value = true;

  try {
    if (selectedRole.value?.ids) {
      // Update existing
      await rolesApi.update(selectedRole.value.ids, {
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Role updated successfully");
    } else {
      // Add new
      await rolesApi.create({
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Role added successfully");
    }

    showDrawer.value = false;
    loadData();
  } catch (error: any) {
    // Handle specific error cases
    if (
      error.response?.status === 409 ||
      error.response?.data?.message?.includes("already exists")
    ) {
      message.error(
        "This role already exists. Please use a different name or code."
      );
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save role. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedRole.value = null;
};

// Fetch function for DataTableWrapper
async function fetchRoles(params: Record<string, any>) {
  const response = await rolesApi.getAll(params);
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
      <NSpace vertical :size="16">
        <NSpace justify="end">
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <span class="iconify ph--plus size-5"></span>
            </template>
            Add Role
          </NButton>
        </NSpace>

        <DataTableWrapper
          ref="tableRef"
          :fetchData="fetchRoles"
          :columns="columns"
          :extraFilters="[]"
          :defaultPageSize="10"
          :pageSizeOptions="[10, 20, 30]"
          :scrollX="100"
        />
      </NSpace>

      <FormDrawer
        ref="formDrawerRef"
        v-model:show="showDrawer"
        :title="selectedRole ? 'Edit Role' : 'Add Role'"
        :fields="formFields"
        :model-value="selectedRole"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </NLayoutContent>
  </NLayout>
</template>
