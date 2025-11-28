<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import { helpersApi } from "@/services/helper.service";
import { useRender } from "@/composables/useRender";
import { ReplyIcon as EditIcon, EyeIcon as EyeIcon } from "lucide-vue-next";
import type { Helper } from "~/src/types/helper";

const {
  renderDate,
  renderUserAvatar,
  renderActionButton,
  renderDeleteActionButton,
} = useRender();
const message = useMessage();
const { t } = useI18n();
const viewingHelper = ref();
const showViewModal = ref(false);
const columns = [
  {
    title: "Ticket No",
    key: "ticket_no",
  },
  {
    title: "Customer Name",
    key: "firstname",
    render: (row: any) =>
      renderUserAvatar(
        row.picture,
        `${row.firstname} ${row.lastname}`,
        `${row.phone || ""}`
      ),
  },
  {
    title: "Description",
    key: "description_short",
  },
  {
    title: "Created Date",
    key: "createdAt",
    sorter: true, // Enable sorting
    render: (row: any) => renderDate(row.createdAt),
  },
  {
    title: "Actions",
    key: "actions",
    render: (row: any) => [
      renderActionButton(EyeIcon, () => handleView(row)),
      renderActionButton(EditIcon, () => handleReply(row)),
      renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ),
    ],
  },
];
async function fetchHelpers(params: Record<string, any>) {
  const response = await helpersApi.getAll(params);
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}

const handleReply = async (row: Helper) => {};

const handleView = async (row: Helper) => {
  viewingHelper.value = row;
  showViewModal.value = true;
};

const handleDelete = async (helper: Helper) => {
  try {
    const response = await helpersApi.delete(helper.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const extraFilters = [
  {
    key: "createdAt",
    label: "Created Date",
    type: "date-range" as const,
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
        <DataTableWrapper
          :fetchData="fetchHelpers"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[3, 5, 7]"
          :scrollX="1200"
        />
      </div>

      <NModal
        v-model:show="showViewModal"
        preset="card"
        title="Help & Supports Details"
        :style="{ width: '600px' }"
      >
        <div v-if="viewingHelper">
          <HelperViewModal
            :viewingHelper="viewingHelper"
            @close="showViewModal = false"
          />
        </div>
      </NModal>
    </NLayoutContent>
  </NLayout>
</template>

<style scoped></style>
