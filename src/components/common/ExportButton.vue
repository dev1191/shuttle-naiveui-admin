<script setup lang="ts">
import { ref } from "vue";
import { NButton, useMessage } from "naive-ui";
import * as XLSX from "xlsx";

interface Props {
  data: any[];
  columns: any[];
  fileName?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: "export",
  loading: false,
});

const message = useMessage();
const isExporting = ref(false);

const handleExport = () => {
  if (!props.data.length) {
    message.warning("No data to export");
    return;
  }

  isExporting.value = true;
  try {
    // Filter out action columns and get headers
    const exportColumns = props.columns.filter(
      (col) => col.key !== "actions" && col.key !== "action"
    );

    // Map data to export format
    const exportData = props.data.map((item) => {
      const row: Record<string, any> = {};
      exportColumns.forEach((col) => {
        // Handle nested properties or custom renderers if needed
        // For simplicity, we'll take the direct value or empty string
        // We could potentially use the render function if it returns a string, but that's complex
        // So we'll stick to the key
        let value = item[col.key];
        
        // Basic handling for arrays or objects if needed, but usually simple values
        if (typeof value === 'object' && value !== null) {
            // Try to stringify or just leave as is (XLSX handles some)
             value = JSON.stringify(value);
        }
        
        row[col.title || col.key] = value ?? "";
      });
      return row;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate file
    XLSX.writeFile(wb, `${props.fileName}.xlsx`);

    message.success("Data exported successfully");
  } catch (error) {
    console.error("Export error:", error);
    message.error("Failed to export data");
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <NButton
    size="small"
    @click="handleExport"
    :loading="loading || isExporting"
    v-bind="$attrs"
  >
    <template #icon>
      <slot name="icon">
        <span class="iconify ph--download size-5"></span>
      </slot>
    </template>
    <slot>Export to Excel</slot>
  </NButton>
</template>
