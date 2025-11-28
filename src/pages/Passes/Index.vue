<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { passsApi } from "@/services/pass.service";
import type { Pass } from "@/types/pass";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const selectedPass = ref<Pass | null>(null);
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton } = useRender();

const formFields = [
  { key: "no_of_rides", label: "No of Rides", type: "number", required: true },
  {
    key: "no_of_valid_days",
    label: "No of Valid Days",
    type: "number",
    required: true,
  },
  {
    key: "price_per_km",
    label: "Price Per Km",
    type: "number",
    required: true,
  },
  { key: "discount", label: "Discount", type: "number", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "terms", label: "Terms And Conditions", type: "textarea" },

  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Pass> = [
  { title: "No Of Rides", key: "no_of_rides" },
  { title: "Valid Days", key: "no_of_valid_days" },
  { title: "Price Per Km", key: "price_per_km" },
  { title: "Discount", key: "discount" },
  {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await passsApi.update(row.ids, { status: value });
            row.status = value;
            message.success(`${row.name} status updated successfully`);
          } catch (error) {
            message.error("Failed to update status");
            console.error("Status update error:", error);
          }
        },
      });
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (row) => [
      renderActionButton(EditIcon, () => handleEdit(row)),
      renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ),
    ],
  },
];

const handleAdd = () => {
  selectedPass.value = null;
  showDrawer.value = true;
};

const handleEdit = (pass: Pass) => {
  selectedPass.value = { ...pass };
  showDrawer.value = true;
};

const handleDelete = async (pass: Pass) => {
  try {
    const response = await passsApi.delete(pass.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Pass) => {
  loading.value = true;

  try {
    if (selectedPass.value?.ids) {
      // Update existing
      await passsApi.update(selectedPass.value.ids, {
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Pass updated successfully");
    } else {
      // Add new
      await passsApi.create({
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Pass added successfully");
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
        "This pass already exists. Please use a different name or code."
      );
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save pass. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedPass.value = null;
};

// Fetch function for DataTableWrapper
async function fetchPasss(params: Record<string, any>) {
  const response = await passsApi.getAll(params);
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
        <NSpace vertical :size="16">
          <NSpace justify="end">
            <NButton type="primary" @click="handleAdd">
              <template #icon>
                <span class="iconify ph--plus size-5"></span>
              </template>
              Add Pass
            </NButton>
          </NSpace>

          <DataTableWrapper
            ref="tableRef"
            :fetchData="fetchPasss"
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
          :title="selectedPass ? 'Edit Pass' : 'Add Pass'"
          :fields="formFields"
          :model-value="selectedPass"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>
