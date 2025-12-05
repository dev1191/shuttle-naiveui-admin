<script setup lang="ts">
import { h, ref } from 'vue'
import { NButton, NSpace, NLayout, NLayoutContent, useMessage, NTag, NIcon, NSwitch } from 'naive-ui'
import { useRouter } from 'vue-router'
import { stopsApi } from '@/services/stop.service'
import type { Stop } from '@/types/stop'
import DataTableWrapper from '@/components/common/DataTableWrapper.vue'
import { useRender } from '@/composables/useRender'
import { Plus as PlusIcon, Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-vue-next'

const router = useRouter()
const message = useMessage()
const { renderDate, renderDeleteActionButton, renderActionButton } = useRender()

const refreshKey = ref(0)

const handleDelete = async (id: string) => {
  try {
    await stopsApi.delete(id)
    message.success('Stop deleted successfully')
    refreshKey.value++
  } catch (error) {
    message.error('Failed to delete stop')
  }
}

const columns = [
  {
    title: 'Title',
    key: 'title',
    sorter: true
  },
  {
    title: 'Landmark',
    key: 'landmark'
  },
 {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await stopsApi.toggleStatus(row.ids, value );
            row.status = value;
            message.success(`Stop : ${row.title} status updated successfully`);
          } catch (error) {
            message.error("Failed to update status");
            console.error("Status update error:", error);
          }
        },
      });
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: Stop) {
      return h(NSpace, {}, {
        default: () => [
          renderActionButton(EditIcon, () => router.push(`/manage-routes/stops/edit-stop/${row.ids}`),'Edit'),
          renderDeleteActionButton('Are you sure you want to delete this stop?', () => handleDelete(row.ids),'Delete','error')
        ]
      })
    }
  }
]

const fetchStops = async (params: any) => {
  const response = await stopsApi.getAll(params)
  return {
    items: response.items,
    totalRecords: response.totalRecords,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages
  }
}
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3 py-3">
        <NSpace justify="space-between" class="mb-3">
          <h2 class="text-xl font-bold">Stops</h2>
          <NButton type="primary" @click="router.push('/manage-routes/create-stop')">
            <template #icon>
              <NIcon>
                <PlusIcon />
              </NIcon>
            </template>
            Add Stop
          </NButton>
        </NSpace>
        <DataTableWrapper
          :key="refreshKey"
          :fetchData="fetchStops"
          :columns="columns"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>