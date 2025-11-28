<script setup lang="ts">
import { helpersApi } from "@/services/helper.service";
import { useRender } from "@/composables/useRender";

const { renderDate, renderUserAvatar } = useRender();

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
    title:"Actions",
    key:"actions"
  }
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

const extraFilters = [
  {
    key: "createdAt",
    label: "Created Date",
    type: "date-range" as const,
  },
];
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
    </NLayoutContent>
  </NLayout>
</template>

<style scoped></style>
