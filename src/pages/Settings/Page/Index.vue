<script setup lang="ts">
import { NSwitch, useMessage, NFormItem, NInput, NDivider } from "naive-ui";
import type { DataTableColumns, FormRules } from "naive-ui";
import { pagesApi } from "@/services/page.service";
import type { Page } from "@/types/settings/page";
import { useRender } from "@/composables/useRender";
import { PencilIcon as EditIcon } from "lucide-vue-next";
import RichTextEditor from "@/components/common/RichTextEditor.vue";
import { kebabCase } from "lodash-es";

const message = useMessage();
const { t } = useI18n();
const showDrawer = ref(false);
const loading = ref(false);
const selectedPage = ref<Page | null>(null);
const tableRef = ref();
const { renderActionButton, renderDeleteActionButton } = useRender();

const rules: FormRules = {
  title: { required: true, message: "Title is required", trigger: "blur" },
  slug: { required: true, message: "Slug is required", trigger: "blur" },
};

const columns: DataTableColumns<Page> = [
  { title: "Title", key: "title" },
  { title: "Slug", key: "slug" },
  {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await pagesApi.update(row.ids, { status: value });
            row.status = value;
            message.success(`${row.title} status updated successfully`);
          } catch (error) {
            message.error("Failed to update status");
            console.error("Status update error:", error);
          }
        },
      });
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (row) => [
      renderActionButton(EditIcon, () => handleEdit(row)),
      renderDeleteActionButton(t("common.deleteConfirm"), () =>
        handleDelete(row)
      ),
    ],
  },
];

const handleAdd = () => {
  selectedPage.value = null;
  showDrawer.value = true;
};

const handleEdit = (page: Page) => {
  selectedPage.value = { ...page };
  showDrawer.value = true;
};

const handleDelete = async (page: Page) => {
  try {
    const response = await pagesApi.delete(page.ids);
    message.success(response.message);
    if (response.status) {
      loadData();
    }
  } catch (error) {
    message.error(error.message);
    console.error("Delete error:", error);
  }
};

const handleSubmit = async (data: Page) => {
  loading.value = true;

  try {
    if (selectedPage.value?.ids) {
      // Update existing
      await pagesApi.update(selectedPage.value.ids, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
      });
      message.success("Page updated successfully");
    } else {
      // Add new
      await pagesApi.create({
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
      });
      message.success("Page added successfully");
    }

    showDrawer.value = false;
    loadData();
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
      message.error("This page already exists. Please use a different name or code.");
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error("Failed to save page. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedPage.value = null;
};

const handleTitleUpdate = (value: string, model: Page) => {
  model.title = value;
  // For simplicity, we'll just update it if it's not being manually edited
  if (!selectedPage.value) {
     model.slug = kebabCase(value);
  }
};

// Fetch function for DataTableWrapper
async function fetchPages(params: Record<string, any>) {
  const response = await pagesApi.getAll(params);
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}

// Reload data function
function loadData() {
  if (tableRef.value?.loadData) {
    tableRef.value.loadData();
  }
}
</script>

<template>
  <AppSetting title="Pages" description="Manage pages">
    <NSpace vertical :size="16">
      <NSpace justify="end">
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <span class="iconify ph--plus size-5"></span>
          </template>
          Add Page
        </NButton>
      </NSpace>

      <DataTableWrapper
        ref="tableRef"
        :fetchData="fetchPages"
        :columns="columns"
        :extraFilters="[]"
        :defaultPageSize="10"
        :pageSizeOptions="[10, 20, 30]"
        :scrollX="100"
      />
    </NSpace>

    <FormDrawer
      ref="formDrawerRef"
      v-model:show="showDrawer"
      :title="selectedPage ? 'Edit Page' : 'Add Page'"
      :model-value="selectedPage"
      :loading="loading"
      :rules="rules"
      :width="800"
      @submit="handleSubmit"
      @cancel="handleCancel"
    >
      <template #default="{ model }">
        <NFormItem label="Title" path="title">
          <NInput 
            :value="model.title" 
            @update:value="(val) => handleTitleUpdate(val, model)"
            placeholder="Page Title" 
          />
        </NFormItem>
        
        <NFormItem label="Slug" path="slug">
          <NInput v-model:value="model.slug" placeholder="page-slug" />
        </NFormItem>
        
        <NFormItem label="Content" path="content">
          <RichTextEditor
            v-model="model.content"
            placeholder="Page Content"
          />
        </NFormItem>

        <NDivider title-placement="left">SEO Settings</NDivider>

        <NFormItem label="Meta Title" path="meta_title">
          <NInput v-model:value="model.meta_title" placeholder="Meta Title" />
        </NFormItem>
        
        <NFormItem label="Meta Description" path="meta_description">
          <NInput
            v-model:value="model.meta_description"
            type="textarea"
            placeholder="Meta Description"
            :rows="3"
          />
        </NFormItem>
        
        <NFormItem label="Meta Keywords" path="meta_keywords">
          <NInput v-model:value="model.meta_keywords" placeholder="keyword1, keyword2" />
        </NFormItem>

        <NFormItem label="Status" path="status">
          <NSwitch v-model:value="model.status" />
        </NFormItem>
      </template>
    </FormDrawer>
  </AppSetting>
</template>
