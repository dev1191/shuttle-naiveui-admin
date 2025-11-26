<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { NSelect, NSpace, NDataTable, NDatePicker } from "naive-ui";

/** Props */
interface FilterOption {
  label: string;
  value: any;
}
interface FilterDefinition {
  key: string;
  label: string;
  type?: "select" | "date" | "date-range";
  options?: FilterOption[];
}

const props = defineProps<{
  fetchData: (params: Record<string, any>) => Promise<{
    items: any[];
    totalRecords: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  columns: any[];
  extraFilters?: FilterDefinition[];
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  scrollX?: number;
}>();

const emit = defineEmits(["update:items"]);

/** State */
const loading = ref(false);
const items = ref<any[]>([]);
const search = ref("");
const filters = reactive<Record<string, any>>({});

const pagination = reactive({
  page: 1,
  pageSize: props.defaultPageSize ?? 10,
  pageCount: 1,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: props.pageSizeOptions ?? [10, 20, 30, 50],
});

const scrollX = props.scrollX ?? 1000;

/* ===========================================
   DATE FORMATTER
   Converts timestamp -> YYYY-MM-DD
=========================================== */
function formatDate(ts: number) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ===========================================
   BUILD PARAMS
=========================================== */
function buildParams() {
  return {
    page: pagination.page,
    limit: pagination.pageSize,
    search: search.value,
    ...filters,
  };
}

/* ===========================================
   LOAD DATA
=========================================== */
async function loadData() {
  loading.value = true;
  try {
    const response = await props.fetchData(buildParams());
    items.value = response.items;
    pagination.page = response.page;
    pagination.pageSize = response.limit;
    pagination.itemCount = response.totalRecords;
    pagination.pageCount = response.totalPages;
    emit("update:items", items.value);
  } catch (e) {
    console.error("DataTableWrapper load error:", e);
  } finally {
    loading.value = false;
  }
}

/* ===========================================
   FILTER HANDLERS
=========================================== */
function onSearch() {
  pagination.page = 1;
  loadData();
}

function onFilterChange(filterKey?: string) {
  if (filterKey && Array.isArray(filters[filterKey])) {
    const [start, end] = filters[filterKey];

    if (start && end) {
      filters[filterKey] = [formatDate(start), formatDate(end)];
    }
  }

  if (
    filterKey &&
    typeof filters[filterKey] === "number" &&
    filterKey !== "page"
  ) {
    filters[filterKey] = formatDate(filters[filterKey]);
  }

  pagination.page = 1;
  loadData();
}

function onPageChange(page: number) {
  pagination.page = page;
  loadData();
}

function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  loadData();
}

/** Watch for column changes */
watch(
  () => props.columns,
  () => loadData()
);

/** Initial fetch */
loadData();
</script>

<template>
  <div>
    <n-space vertical size="large">
      <!-- Search & Filters Row -->
      <n-space align="center" justify="space-between" :size="12" wrap>
        <!-- Search -->
        <SearchInput v-model="search" @search="onSearch" />

        <!-- Dynamic Filters -->
        <n-space align="center" justify="space-between" :size="12" wrap>
          <template v-if="extraFilters && extraFilters.length">
            <template v-for="filter in extraFilters" :key="filter.key">
              <!-- Select Filter -->

              <n-select
                v-if="!filter.type || filter.type === 'select'"
                v-model:value="filters[filter.key]"
                :placeholder="filter.label"
                :options="filter.options || []"
                clearable
                style="min-width: 150px"
                @update:value="() => onFilterChange(filter.key)"
              />

              <!-- Single Date -->
              <n-date-picker
                v-else-if="filter.type === 'date'"
                v-model:value="filters[filter.key]"
                type="date"
                :placeholder="filter.label"
                clearable
                style="min-width: 150px"
                @update:value="() => onFilterChange(filter.key)"
              />

              <!-- Date Range -->
              <n-date-picker
                v-else-if="filter.type === 'date-range'"
                v-model:value="filters[filter.key]"
                type="daterange"
                :placeholder="filter.label"
                clearable
                style="min-width: 250px"
                @update:value="() => onFilterChange(filter.key)"
              />
            </template>
          </template>
        </n-space>
      </n-space>

      <SkeletonTable v-if="loading" :columns="columns" />
      <!-- Data Table -->
      <n-data-table
        v-else
        :columns="columns"
        :data="items"
        :loading="loading"
        :pagination="pagination"
        :remote="true"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
        :scroll-x="scrollX"
      />
    </n-space>
  </div>
</template>
