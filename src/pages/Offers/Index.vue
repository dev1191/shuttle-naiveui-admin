<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { offersApi } from "@/services/offer.service";
import type { Offer } from "@/types/offer";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const selectedOffer = ref<Offer | null>(null);
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton, renderDate } =
  useRender();

const formFields = [
  { key: "name", label: "Offer Name", required: true },
  {
    key: "start_date",
    label: "Start Date",
    type: "datepicker",
    dateType: "date",
    required: true,
  },
  {
    key: "end_date",
    label: "End Date",
    type: "datepicker",
    dateType: "date",
    required: true,
  },
  { key: "code", label: "Offer Code", required: true },
  { key: "discount", label: "Discount", type: "number", required: true },
  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Offer> = [
  { title: "Name", key: "name" },
  { title: "Code", key: "code" },
  {
    title: "Start Date",
    key: "start_date",
    render: (row: Offer) => {
      return renderDate(row.start_date, false);
    },
  },
  {
    title: "End Date",
    key: "end_date",
    render: (row: Offer) => {
      return renderDate(row.end_date, false);
    },
  },
  { title: "Type", key: "type" },
  { title: "Route Name", key: "route_name" },
  {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await offersApi.update(row.ids, { status: value });
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
  selectedOffer.value = null;
  showDrawer.value = true;
};

const handleEdit = (offer: Offer) => {
  selectedOffer.value = { ...offer };
  showDrawer.value = true;
};

const handleDelete = async (offer: Offer) => {
  try {
    const response = await offersApi.delete(offer.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Offer) => {
  loading.value = true;

  try {
    if (selectedOffer.value?.ids) {
      // Update existing
      await offersApi.update(selectedOffer.value.ids, {
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Offer updated successfully");
    } else {
      // Add new
      await offersApi.create({
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Offer added successfully");
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
        "This offer already exists. Please use a different name or code."
      );
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save offer. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedOffer.value = null;
};

// Fetch function for DataTableWrapper
async function fetchOffers(params: Record<string, any>) {
  const response = await offersApi.getAll(params);
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
              Add Offer
            </NButton>
          </NSpace>

          <DataTableWrapper
            ref="tableRef"
            :fetchData="fetchOffers"
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
          :title="selectedOffer ? 'Edit Offer' : 'Add Offer'"
          :fields="formFields"
          :model-value="selectedOffer"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>
