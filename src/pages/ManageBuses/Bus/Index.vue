<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useRouter } from "vue-router";
import { bussApi } from "@/services/buses/bus.service";
import type { Bus } from "@/types/buses/index";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";

const message = useMessage();
const router = useRouter();
const { t } = useI18n();
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton } = useRender();

const handleAdd = () => {
  router.push({ name: "createBus" });
};

const handleEdit = (bus: Bus) => {
  router.push({ name: "editBus", params: { id: bus.ids } });
};

const handleDelete = async (bus: Bus) => {
  try {
    const response = await bussApi.delete(bus.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error: any) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const columns: DataTableColumns<Bus> = [
  { title: "Name", key: "name" },
    { title: "Code", key: "code" },
  { title: "Max Seats", key: "max_seats" },
  {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await bussApi.update(row.ids, { status: value });
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

// Fetch function for DataTableWrapper
async function fetchBuss(params: Record<string, any>) {
  const response = await bussApi.getAll(params);
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
              Add Bus
            </NButton>
          </NSpace>

          <DataTableWrapper
            ref="tableRef"
            :fetchData="fetchBuss"
            :columns="columns"
            :extraFilters="[]"
            :defaultPageSize="10"
            :pageSizeOptions="[10, 20, 30]"
            :scrollX="100"
          />
        </NSpace>


      </div>
    </NLayoutContent>
  </NLayout>
</template>
