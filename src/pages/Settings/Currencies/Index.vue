<script setup lang="ts">
import { NButton, NSpace, NSwitch } from "naive-ui";
import { currenciesApi } from "@/services/currency.service";
import { useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { PencilIcon as EditIcon } from "lucide-vue-next";
import { useRender } from "@/composables/useRender";
import type { Currency } from "@/types/settings/currency";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const tableRef = ref();
const selectedCurrency = ref<Currency | null>(null);
const { renderActionButton, renderDeleteActionButton } = useRender();

const formFields = [
  {
    key: "name",
    label: "Currency Name",
    required: true,
    placeholder: "e.g., US Dollar",
  },
  {
    key: "code",
    label: "Currency Code",
    required: true,
    placeholder: "e.g., USD, SAR, EUR",
  },
  {
    key: "symbol",
    label: "Currency Symbol",
    required: true,
    placeholder: "e.g., $, ر.س, €",
  },
  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Currency> = [
  { title: "Name", key: "name" },
  { title: "Code", key: "code" },
  { title: "Symbol", key: "symbol" },
  {
    title: "Status",
    key: "status",
    render: (row: Currency) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await currenciesApi.update(row.ids, { status: value });
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
    width: 150,
    render: (row) => [
      renderActionButton(EditIcon, () => handleEdit(row)),
      renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ),
    ],
  },
];

const handleAdd = () => {
  selectedCurrency.value = null;
  showDrawer.value = true;
};

const handleEdit = (currency: Currency) => {
  selectedCurrency.value = { ...currency };
  showDrawer.value = true;
};

const handleDelete = async (currency: Currency) => {
  try {
    const response = await currenciesApi.delete(currency.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error: any) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Currency) => {
  loading.value = true;

  try {
    if (selectedCurrency.value?.ids) {
      // Update existing
      await currenciesApi.update(selectedCurrency.value.ids, {
        name: data.name,
        code: data.code,
        symbol: data.symbol,
        status: data.status,
      });
      message.success("Currency updated successfully");
    } else {
      // Add new
      await currenciesApi.create({
        name: data.name,
        code: data.code,
        symbol: data.symbol,
        status: data.status,
      });
      message.success("Currency added successfully");
    }

    showDrawer.value = false;
    loadData();
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
      message.error("This currency already exists. Please use a different code or name.");
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save currency. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedCurrency.value = null;
};

// Fetch function for DataTableWrapper
async function fetchCurrencies(params: Record<string, any>) {
  const response = await currenciesApi.getAll(params);
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
  <AppSetting title="Currencies" description="Manage application currencies">
    <NSpace vertical :size="16">
      <NSpace justify="end">
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <span class="iconify ph--plus size-5"></span>
          </template>
          Add Currency
        </NButton>
      </NSpace>

      <DataTableWrapper
        ref="tableRef"
        :fetchData="fetchCurrencies"
        :columns="columns"
        :extraFilters="[]"
        :defaultPageSize="10"
        :pageSizeOptions="[10, 20, 30]"
        :scrollX="100"
      />
    </NSpace>

    <FormDrawer
      v-model:show="showDrawer"
      :title="selectedCurrency ? 'Edit Currency' : 'Add Currency'"
      :fields="formFields"
      :model-value="selectedCurrency"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </AppSetting>
</template>
