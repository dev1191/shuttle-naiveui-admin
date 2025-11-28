<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { NSelect, NSpace, NDataTable, NDatePicker, NButton } from "naive-ui";
import type { DataTableSortState } from "naive-ui";
import { useMessage } from "naive-ui";

/**
 * DataTableWrapper Component
 * 
 * A reusable data table wrapper with built-in features:
 * - Pagination
 * - Search
 * - Filters (select, date, date-range)
 * - Column Sorting (opt-in per column)
 * - Export to CSV
 * - Refresh
 * 
 * COLUMN SORTING:
 * - Columns are NOT sortable by default
 * - Add `sorter: true` to any column to enable sorting
 * - The 'actions' column is never sortable
 * - Example:
 *   {
 *     title: "Name",
 *     key: "name",
 *     sorter: true  // ← Must explicitly enable sorting
 *   }
 */

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
    sortBy:string
    sortDesc:string
  }>;
  columns: any[];
  extraFilters?: FilterDefinition[];
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  scrollX?: number;
  exportFileName?: string;
}>();

const emit = defineEmits(["update:items"]);

const message = useMessage();

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

// Sort state
const sortBy = ref<string>('createdAt');
const sortOrder = ref<'ascend' | 'descend' | false>('descend');

const scrollX = props.scrollX ?? 1000;

/* ===========================================
   COMPUTED COLUMNS WITH SORT
   Dynamically adds sorting based on column configuration
=========================================== */
const columnsWithSort = computed(() => {
  return props.columns.map(col => {
    // Skip if no key or if it's the actions column
    if (!col.key || col.key === 'actions') {
      return col;
    }
    
    // Check if column explicitly defines sorter property
    // Only enable sorting if explicitly set to true or a function
    const isSortable = col.sorter === true || typeof col.sorter === 'function';
    
    // Only add sorting if the column is sortable
    if (isSortable) {
      return {
        ...col,
        sorter: col.sorter, // Keep the original sorter value (true or function)
        sortOrder: sortBy.value === col.key ? sortOrder.value : false
      };
    }
    
    return col;
  });
});

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
  // Convert Naive UI sortOrder to backend format
  const sortDesc = sortOrder.value === 'descend' ? 'desc' : 'asc';
  
  return {
    page: pagination.page,
    limit: pagination.pageSize,
    search: search.value,
    sortBy: sortBy.value,
    sortDesc: sortDesc,
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

/* ===========================================
   SORT HANDLER
=========================================== */
function handleSorterChange(sorter: DataTableSortState) {
  if (!sorter || typeof sorter === 'boolean') {
    // Reset to default sort
    sortBy.value = 'createdAt';
    sortOrder.value = 'descend';
  } else if ('columnKey' in sorter) {
    // Single column sort
    sortBy.value = sorter.columnKey as string;
    sortOrder.value = sorter.order || false;
  } else if (Array.isArray(sorter) && sorter.length > 0) {
    // Multiple column sort - use the first one
    const firstSorter = sorter[0];
    if (firstSorter && 'columnKey' in firstSorter) {
      sortBy.value = firstSorter.columnKey as string;
      sortOrder.value = firstSorter.order || false;
    }
  }
  
  // Reset to first page when sorting changes
  pagination.page = 1;
  loadData();
}

/* ===========================================
   REFRESH HANDLER
=========================================== */
function handleRefresh() {
  message.info("Refreshing data...");
  loadData();
}

/* ===========================================
   EXPORT HANDLER
=========================================== */
function handleExport() {
  if (!items.value.length) {
    message.warning("No data to export");
    return;
  }

  try {
    // Get column keys (excluding actions)
    const exportColumns = props.columns.filter(col => col.key !== 'actions');
    
    // Create CSV header
    const headers = exportColumns.map(col => col.title).join(',');
    
    // Create CSV rows
    const rows = items.value.map(item => {
      return exportColumns.map(col => {
        const value = item[col.key];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',');
    });
    
    // Combine header and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', props.exportFileName || `export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success("Data exported successfully");
  } catch (error) {
    console.error("Export error:", error);
    message.error("Failed to export data");
  }
}

/** Watch for column changes */
watch(
  () => props.columns,
  () => loadData()
);

/** Initial fetch */
loadData();

/** Expose methods for parent components */
defineExpose({
  loadData,
  handleRefresh
});
</script>

<template>
  <div>
    <n-space vertical size="large">
      <!-- Search & Filters Row -->
      <n-space align="center" justify="space-between" :size="12" wrap>
        <!-- Search -->
        <SearchInput v-model="search" @search="onSearch" />

        <!-- Dynamic Filters & Action Buttons -->
        <n-space align="center" :size="12" wrap>
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

          <!-- Action Buttons -->
          <NButton size="small" @click="handleRefresh" :loading="loading">
            <template #icon>
              <span class="iconify ph--arrows-clockwise size-5"></span>
            </template>
            Refresh
          </NButton>

          <NButton size="small" @click="handleExport">
            <template #icon>
              <span class="iconify ph--download size-5"></span>
            </template>
            Export
          </NButton>
        </n-space>
      </n-space>

      <SkeletonTable v-if="loading" :columns="columns" />
      <!-- Data Table -->
      <n-data-table
        v-else
        :columns="columnsWithSort"
        :data="items"
        :loading="loading"
        :pagination="pagination"
        :remote="true"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
        @update:sorter="handleSorterChange"
        :scroll-x="scrollX"
      />
    </n-space>
  </div>
</template>
