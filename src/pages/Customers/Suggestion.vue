<script setup lang="ts">
import { suggestionsApi } from "@/services/suggestion.service";
import { useRender } from "@/composables/useRender";



const { renderDate ,renderUserAvatar } = useRender()


const columns = [
  {
    title: "Customer Name",
    key: 'userId_firstname',
    render: (row: any) =>
      renderUserAvatar(row.picture, `${row.fullname || row.userId_firstname}`, `${row.phone || ''}`),
  },
  {
    title: "Pickup Address",
    key: "pickup_address",
  },
  {
    title: "Drop Address",
    key: "drop_address",
  },
  {
    title: 'Created Date',
    key: 'createdAt',
    sorter: true, // Enable sorting
    render: (row: any) => renderDate(row.createdAt),
  },
];
async function fetchSuggestions(params: Record<string, any>) {

  const response = await suggestionsApi.getAll(params);
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
          :fetchData="fetchSuggestions"
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
