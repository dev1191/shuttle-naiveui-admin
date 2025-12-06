<script setup lang="ts">
import { h, ref } from "vue";
import {
  NButton,
  NSpace,
  NLayout,
  NLayoutContent,
  useMessage,
  NTag,
  NIcon,
  NSwitch,
} from "naive-ui";
import { useRouter } from "vue-router";
import { busSchedulesApi } from "@/services/busSchedule.service";
import type { BusSchedule } from "@/types/busSchedule";
import DataTableWrapper from "@/components/common/DataTableWrapper.vue";
import { useRender } from "@/composables/useRender";
import { useBusSchedule } from "@/composables/useBusSchedule";
import {
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
} from "lucide-vue-next";

const router = useRouter();
const message = useMessage();
const { renderDate, renderDeleteActionButton, renderActionButton } =
  useRender();
const { updateBusScheduleStatus } = useBusSchedule();

const refreshKey = ref(0);

const handleDelete = async (id: string) => {
  try {
    await busSchedulesApi.delete(id);
    message.success("busSchedule deleted successfully");
    refreshKey.value++;
  } catch (error) {
    message.error("Failed to delete busSchedule");
  }
};

const columns = [
  {
    title: "Route Name",
    key: "route_name",
    sorter: true,
  },
  {
    title: "Bus Name",
    key: "bus_name",
  },
  {
    title: "Operates From - To (dates)",
    key: "start_date",
    render: (row: BusSchedule) => {
      return h("span", [
        renderDate(row.start_date, false),
        " - ",
        renderDate(row.end_date, false),
      ]);
    },
  },
  {
    title: "Status",
    key: "status",
    render: (row: BusSchedule) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: (value: boolean) => updateBusScheduleStatus(row, value),
      });
    },
  },
  {
    title: "Created At",
    key: "createdAt",
    render: (row: BusSchedule) => renderDate(row.createdAt,true),
  },
  {
    title: "Actions",
    key: "actions",
    render(row: BusSchedule) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            renderActionButton(
              EditIcon,
              () =>
                router.push(
                  `/manage-routes/bus-schedules/edit/${row.ids}`
                ),
              "Edit",
              null,
              "primary"
            ),
            renderDeleteActionButton(
              "Are you sure you want to delete this busSchedule?",
              () => handleDelete(row.ids),
              "Delete",
              null,
              "error"
            ),
          ],
        }
      );
    },
  },
];

const fetchbusSchedules = async (params: any) => {
  const response = await busSchedulesApi.getAll(params);
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
};
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <NSpace justify="space-between" class="mb-3">
          <h2 class="text-xl font-bold">Bus Schedule</h2>
          <NButton
            type="primary"
            @click="
              router.push(
                '/manage-routes/bus-schedules/create'
              )
            "
          >
            <template #icon>
              <NIcon>
                <PlusIcon />
              </NIcon>
            </template>
            Add Bus Schedule
          </NButton>
        </NSpace>
        <DataTableWrapper
          :key="refreshKey"
          :fetchData="fetchbusSchedules"
          :columns="columns"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>
