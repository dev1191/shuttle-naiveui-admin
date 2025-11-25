<script setup lang="ts">
import {
  NLayout,
  NLayoutContent,
  NButton,
  NDataTable,
  NSpace,
  NTag,
} from "naive-ui";
import { h, ref, onMounted, reactive } from "vue";
import SearchInput from "@/components/common/SearchInput.vue";
import { driversApi } from "@/services/driver.service";
import type { Driver } from "@/types/driver";

const loading = ref(false);
const drivers = ref<Driver[]>([]);

const options = reactive({
  page: 1,
  limit: 10,
  search: "",
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageCount: 1,
  pageSizes: [3, 5, 7],
});

const columns = [
  {
    title: "Full Name",
    key: "fullname",
  },
  { title: "Email", key: "email" },
  { title: "Phone", key: "phone" },
  { title: "License Number", key: "licenseNumber" },
  {
    title: "Status",
    key: "status",
    render(row: Driver) {
      return h(
        NTag,
        { type: "success", size: "small" },
        { default: () => row.status }
      );
    },
  },
  {
    title: "Action",
    key: "actions",
    render(row: Driver) {
      return h(NButton, { size: "small" }, { default: () => "Edit" });
    },
  },
];

async function getItems() {
  loading.value = true;
  try {
    const response = await driversApi.getAll(options);

    drivers.value = response.items;

    pagination.page = response.page;
    pagination.pageSize = response.limit;
    pagination.itemCount = response.totalRecords;
    pagination.pageCount = response.totalPages;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number) {
  pagination.page = page;
  options.page = page;
  getItems();
}

onMounted(() => getItems());
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <NSpace justify="space-between" class="mb-3">
          <SearchInput v-model="options.search" @search="getItems" />

          <NButton
            type="primary"
            @click="$router.push({ name: 'createDriver' })"
          >
            <template #icon>
              <Icon name="Plus" />
            </template>
            Add Driver
          </NButton>
        </NSpace>
        <SkeletonTable v-if="loading" :columns="columns" />
        <NDataTable
          v-else
          remote 
          :columns="columns"
          :data="drivers"
          :loading="loading"
          :scroll-x="1000"
          :pagination="pagination"
          @update:page="handlePageChange"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>
