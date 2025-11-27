<script setup lang="ts">
import { referralsApi } from "@/services/referral.service";
import { useRender } from "@/composables/useRender";



const { renderDate } = useRender()

const columns = [
  {
    title: "Customer Name",
    key: "user",
    render: (row: any) => `${row.user.firstname} ${row.user.lastname}`,
  },
  {
    title: "Referral Name",
    key: "referral",
    render: (row: any) => `${row.referral.firstname} ${row.referral.lastname}`,
  },
    {
    title: "Income Earned",
    key: "amount",
    render: (row: any) => row.amount,
  },

  {
    title: "Payment Status",
    key: "payment_status",
    render: (row: any) => row.payment_status,
  },
      {
    title: 'Created Date',
    key: 'createdAt',
    render: (row: any) => renderDate(row.createdAt),
  },
];
async function fetchReferrals(params: Record<string, any>) {
  const response = await referralsApi.getAll(params);
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
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ],
  },
  {
    key: "createdAt",
    label: "Created Date",
    type: "date-range",
  },
];
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <DataTableWrapper
          :fetchData="fetchReferrals"
          :columns="columns"
          :extraFilters="extraFilters"
          :defaultPageSize="10"
          :pageSizeOptions="[3, 5, 7]"
          :scrollX="100"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>

<style scoped></style>
