<script setup lang="ts">
import { NSelect } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import type { Bus } from "@/types/buses/index";
import { useRender } from "@/composables/useRender";
import { useBus } from "@/composables/useBus";
import { PencilIcon as EditIcon, EyeIcon } from "lucide-vue-next";
import BusDetailsDrawer from "./components/BusDetailsDrawer.vue";

const { t } = useI18n();
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton } = useRender();
const { navigateToCreate, navigateToEdit, updateStatus, deleteBus, fetchBuses } = useBus();

// Drawer state
const showDrawer = ref(false);
const selectedBus = ref<Bus | null>(null);

const handleAdd = () => {
  navigateToCreate();
};

const handleView = (bus: Bus) => {
  selectedBus.value = bus;
  showDrawer.value = true;
};

const handleEdit = (bus: Bus) => {
  navigateToEdit(bus.ids);
};

const handleDelete = async (bus: Bus) => {
  await deleteBus(bus.ids, () => {
    loadData();
  });
};

const columns: DataTableColumns<Bus> = [
  { title: "Name", key: "name" },
  { title: "Registration No", key: "reg_no" },
  { title: "Layout", key: "layout" },
  { title: "Max Seats", key: "max_seats" },
  {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSelect, {
        value: row.status,
        options: [
            { label: 'Active', value: 'Active' },
            { label: 'OnRoute', value: 'OnRoute' },
            { label: 'Idle', value: 'Idle' },
            { label: 'Maintenance', value: 'Maintance' },
            { label: 'Breakdown', value: 'Breakdown' },
            { label: 'Inactive', value: 'Inactive' },
        ],
        style: { width: '150px' },
        onUpdateValue: async (value: any) => {
          await updateStatus(row.ids, value, () => {
            row.status = value;
          });
        },
      });
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (row) => [
      renderActionButton(EyeIcon, () => handleView(row), 'View'),
      renderActionButton(EditIcon, () => handleEdit(row), 'Edit'),
      renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ),
    ],
  },
];

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
            :fetchData="fetchBuses"
            :columns="columns"
            :extraFilters="[]"
            :defaultPageSize="10"
            :pageSizeOptions="[10, 20, 30]"
            :scrollX="100"
          />
        </NSpace>

        <!-- Bus Details Drawer -->
        <BusDetailsDrawer v-model:show="showDrawer" :bus="selectedBus" />


      </div>
    </NLayoutContent>
  </NLayout>
</template>
