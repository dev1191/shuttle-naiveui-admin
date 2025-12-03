<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { notificationsApi } from "@/services/notification.service";
import type { Notification } from "@/types/notification";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const selectedNotification = ref<Notification | null>(null);
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton } = useRender();

const formFields = [
  { key: "name", label: "Notification Name", required: true },

  { key: "code", label: "Notification Code", required: true },
  { key: "discount", label: "Discount", type: "number", required: true },
  {
    key: "status",
    label: "Status",
    type: "switch",
    defaultValue: true,
  },
];

const columns: DataTableColumns<Notification> = [
  { title: "To", key: "to" },
  { title: "Type", key: "user_type" },
  {
    title: "Send Total",
    key: "send_total",
    render: (row: Notification) => {
      return h("div", {}, [
        `Failed Count : ${row.send_total.failed_count}`,
        " | ",
        `Success Count : ${row.send_total.success_count}`,
      ]);
    },
  },
  {
    title: "Status",
    key: "status",
    render: (row: Notification) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await notificationsApi.update(row.ids, { status: value });
            row.status = value;
            message.success(`status updated successfully`);
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
      renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ),
    ],
  },
];



const handleDelete = async (notification: Notification) => {
  try {
    const response = await notificationsApi.delete(notification.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Notification) => {
  loading.value = true;

  try {
    if (selectedNotification.value?.ids) {
      // Update existing
      await notificationsApi.update(selectedNotification.value.ids, {
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Notification updated successfully");
    } else {
      // Add new
      await notificationsApi.create({
        name: data.name,
        short_name: data.short_name,
        phone_code: data.phone_code,
        status: data.status,
      });
      message.success("Notification added successfully");
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
        "This notification already exists. Please use a different name or code."
      );
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save notification. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedNotification.value = null;
};

// Fetch function for DataTableWrapper
async function fetchNotifications(params: Record<string, any>) {
  const response = await notificationsApi.getAll(params);
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
            <NButton type="primary"  @click="$router.push({ name: 'sendMessageCreate' })">
              <template #icon>
                <span class="iconify ph--plus size-5"></span>
              </template>
              Add Notification
            </NButton>
          </NSpace>

          <DataTableWrapper
            ref="tableRef"
            :fetchData="fetchNotifications"
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
