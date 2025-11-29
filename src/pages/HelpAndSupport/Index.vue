<script setup lang="ts">
import { NSwitch, useMessage } from "naive-ui";
import { helpersApi } from "@/services/helper.service";
import { useRender } from "@/composables/useRender";
import { ReplyIcon as EditIcon, EyeIcon as EyeIcon } from "lucide-vue-next";
import type { Helper } from "~/src/types/helper";
import { PaymentStatus } from "@/types";
import { usePayments } from "@/composables/usePayment";

const { getStatusColor } = usePayments();

const {
  renderDate,
  renderUserAvatar,
  renderActionButton,
  renderDeleteActionButton,
  renderTag,
} = useRender();
const message = useMessage();
const { t } = useI18n();
const viewingHelper = ref();
const showViewModal = ref(false);
const showReplyModal = ref(false);
const editingHelper = ref();
const tableRef = ref(null);
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
    title: "Status",
    key: "status",
    render: (row: any) =>
      renderTag(
        row.status,
        getStatusColor(row.status),
        PaymentStatus,
        "PaymentStatus"
      ),
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
      row.status === "Pending"
        ? renderActionButton(EditIcon, () => handleReply(row))
        : null,
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

const handleReply = async (row: Helper) => {
  showReplyModal.value = true;
  editingHelper.value = row;
};

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
          ref="tableRef"
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

      <NModal
        v-model:show="showReplyModal"
        preset="card"
     :mask-closable="false"
        :title="`Reply : Ticket no(${editingHelper?.ticket_no})`"
        :style="{ width: '600px' }"
      >
        <div v-if="editingHelper">
   
          <ReplyHelpAndSupport
            :editingHelper="editingHelper"
            @close="showReplyModal = false"
          />
        </div>
      </NModal>
    </NLayoutContent>
  </NLayout>
</template>

<style scoped></style>
