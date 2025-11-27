<script setup lang="ts">
import { NButton, NSpace, NSwitch } from "naive-ui";
import { languagesApi } from "@/services/language.service";
import { useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { PencilIcon as EditIcon } from "lucide-vue-next";
import { useRender } from "@/composables/useRender";
import type { Language } from "@/types/settings/language";
import { useThemeStore } from "@/stores";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const tableRef = ref();
const selectedLanguage = ref<Language | null>(null);
const { renderActionButton, renderDeleteActionButton } = useRender();
const themeStore = useThemeStore()
const formFields = [
  {
    key: "label",
    label: "Language Name",
    required: true,
    placeholder: "e.g., English",
  },
  {
    key: "code",
    label: "Language Code",
    required: true,
    placeholder: "e.g., en,ar,es",
  },
  {
    key: "country_name",
    label: "Country Name",
    required: true,
    placeholder: "e.g., United States, Saudi Arabia, Spain",
  },
  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Language> = [
  { title: "Label", key: "label" },
  { title: "Code", key: "code" },
  { title: "Country Name", key: "country_name" },
  {
    title: "Status",
    key: "status",
    render: (row: Language) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await languagesApi.update(row.ids, { status: value });
            row.status = value;
            message.success(`${row.label} status updated successfully`);
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
      themeStore.language != row.code ? renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ) : null,
    ]
  },
];

const handleAdd = () => {
  selectedLanguage.value = null;
  showDrawer.value = true;
};

const handleEdit = (language: Language) => {
  selectedLanguage.value = { ...language };
  showDrawer.value = true;
};

const handleDelete = async (language: Language) => {
  try {
    const response = await languagesApi.delete(language.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error: any) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Language) => {
  loading.value = true;

  try {
    if (selectedLanguage.value?.ids) {
      // Update existing
      await languagesApi.update(selectedLanguage.value.ids, {
        label: data.label,
        code: data.code,
        countryId: data.countryId,
        country_name: data.country_name,
        status: data.status,
      });
      message.success("Language updated successfully");
    } else {
      // Add new
      await languagesApi.create({
        label: data.label,
        code: data.code,
        countryId: data.countryId,
        country_name: data.country_name,
        status: data.status,
      });
      message.success("Language added successfully");
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
        "This language already exists. Please use a different code or name."
      );
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save language. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedLanguage.value = null;
};

// Fetch function for DataTableWrapper
async function fetchLanguages(params: Record<string, any>) {
  const response = await languagesApi.getAll(params);
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
  <AppSetting title="Languages" description="Manage application languages">
    <NSpace vertical :size="16">
      <NSpace justify="end">
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <span class="iconify ph--plus size-5"></span>
          </template>
          Add Language
        </NButton>
      </NSpace>

      <DataTableWrapper
        ref="tableRef"
        :fetchData="fetchLanguages"
        :columns="columns"
        :extraFilters="[]"
        :defaultPageSize="10"
        :pageSizeOptions="[10, 20, 30]"
        :scrollX="100"
      />
    </NSpace>

    <FormDrawer
      v-model:show="showDrawer"
      :title="selectedLanguage ? 'Edit Language' : 'Add Language'"
      :fields="formFields"
      :model-value="selectedLanguage"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </AppSetting>
</template>
