<script setup lang="ts">
import { useRoute } from "vue-router";
import { customersApi } from "@/services/customer.service";
import type { Customer } from "@/types/customer";
import { usePayments } from "@/composables/usePayment";
import { useRender } from "@/composables/useRender";
import { PaymentStatus } from "@/types";

const route = useRoute();
const {getStatusColor} = usePayments()
const {renderTag} = useRender()

const columns = [
  {
    title: "Title",
    key: "title",
  },
  {
    title: "Amount",
    key: "amount",
    render: (row: any) => row.amount,
  },
  {
    title: "Status",
    key: "status",
    render: (row: any) => row.status,
  },
  {
    title: "Method",
    key: "method",
    render: (row: any) => row.method,
  },
  {
    title: "Payment Status",
    key: "payment_status",
    render: (row: any) =>
      renderTag(
        row.payment_status,
        getStatusColor(row.payment_status),
        PaymentStatus,
        'PaymentStatus',
      ),
  },
  {
    title: "Date",
    key: "createdAt",
    render: (row: any) => row.createdAt,
  },
];

const customer = ref<Customer | null>(null);
const loading = ref(true);
async function fetchWalletHistories(params: Record<string, any>) {
  const response = await customersApi.walletHistory(route.params.id, params);
  customer.value = response.customer;
  loading.value = false;
  return {
    items: response.items ?? [],
    totalRecords: response.totalRecords ?? 0,
    page: response.page ?? params.page ?? 1,
    limit: response.limit ?? params.limit ?? 10,
    totalPages: response.totalPages ?? 0,
  };
}
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <!-- Customer Card -->
        <!-- Row of Two Cards -->
        <div class="flex gap-4 mb-4">
          <!-- Left: Wallet Balance Card -->
          <NCard class="flex-1" :bordered="true" title="Wallet Balance">
            <template v-if="loading">
              <NSkeleton height="32px" width="120px" />
            </template>
            <template v-else>
              <div class="text-3xl font-semibold">
                {{ customer.wallet_balance }}
              </div>
            </template>
          </NCard>

          <!-- Right: Customer Details Card -->
          <NCard class="flex-1" :bordered="true" title="Customer Details">
            <template v-if="loading">
              <div class="flex items-center gap-4">
                <NSkeleton circle width="64px" height="64px" />
                <div class="flex flex-col gap-2 w-full">
                  <NSkeleton height="16px" width="180px" />
                  <NSkeleton height="16px" width="140px" />
                  <NSkeleton height="16px" width="200px" />
                </div>
              </div>
            </template>

            <template v-else>
              <div class="flex items-center gap-4">
                <NAvatar :src="customer.picture" size="64" />
                <div>
                  <div class="font-semibold">{{ customer.fullname }}</div>
                  <div>Phone: {{ customer.phone }}</div>
                  <div>Email: {{ customer.email }}</div>
                </div>
              </div>
            </template>
          </NCard>
        </div>

        <DataTableWrapper
          :fetchData="fetchWalletHistories"
          :columns="columns"
          :extraFilters="[]"
          :defaultPageSize="10"
          :pageSizeOptions="[3, 5, 7]"
          :scrollX="1000"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>
