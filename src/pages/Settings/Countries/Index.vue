<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { countriesApi } from "@/services/country.service";
import type { Country } from "@/types/settings/country";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const selectedCountry = ref<Country | null>(null);
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton } = useRender();

const formFields = [
  { key: "name", label: "Country Name", required: true },
  {
    key: "short_name",
    label: "Short Name",
    required: true,
    type: "text",
    placeholder: "e.g., US, GB, SA",
  },
  {
    key: "phone_code",
    label: "Phone Code",
    required: true,
    type: "text",
    placeholder: "e.g., +1, +44, +966",
  },
  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Country> = [
  { title: "Name", key: "name" },
  { title: "Short Name", key: "short_name" },
  { title: "Phone Code", key: "phone_code" },
  {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await countriesApi.update(row.ids, { status: value });
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
  selectedCountry.value = null;
  showDrawer.value = true;
};

const handleEdit = (country: Country) => {
  selectedCountry.value = { ...country };
  showDrawer.value = true;
};

const handleDelete = async (country: Country) => {
  try {
    const response = await countriesApi.delete(country.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Country) => {
  loading.value = true;

  try {
    if (selectedCountry.value?.ids) {
      // Update existing
      await countriesApi.update(selectedCountry.value.ids, {
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Country updated successfully");
    } else {
      // Add new
      await countriesApi.create({
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Country added successfully");
    }

    showDrawer.value = false;
    loadData();
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
      message.error("This country already exists. Please use a different name or code.");
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save country. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedCountry.value = null;
};

// Fetch function for DataTableWrapper
async function fetchCountries(params: Record<string, any>) {
  const response = await countriesApi.getAll(params);
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
  <AppSetting title="Countries" description="Manage countries">
    <NSpace vertical :size="16">
      <NSpace justify="end">
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <span class="iconify ph--plus size-5"></span>
          </template>
          Add Country
        </NButton>
      </NSpace>

      <DataTableWrapper
        ref="tableRef"
        :fetchData="fetchCountries"
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
      :title="selectedCountry ? 'Edit Country' : 'Add Country'"
      :fields="formFields"
      :model-value="selectedCountry"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </AppSetting>
</template>
