<script setup lang="ts">
import { h, ref } from 'vue'
import { NButton, NSpace, NLayout, NLayoutContent, useMessage, NTag, NIcon, NSwitch } from 'naive-ui'
import { useRouter } from 'vue-router'
import { routesApi } from '@/services/route.service'
import type { Route } from '@/types/route'
import DataTableWrapper from '@/components/common/DataTableWrapper.vue'
import { useRender } from '@/composables/useRender'
import { Plus as PlusIcon, Edit as EditIcon, Trash2 as DeleteIcon, Copy as CopyIcon } from 'lucide-vue-next'

const router = useRouter()
const message = useMessage()
const { renderDate, renderDeleteActionButton, renderActionButton } = useRender()

const refreshKey = ref(0)

const handleDelete = async (id: string) => {
  try {
    await routesApi.delete(id)
    message.success('Route deleted successfully')
    refreshKey.value++
  } catch (error) {
    message.error('Failed to delete route')
  }
}

const columns = [
  {
    title: 'Title',
    key: 'title',
    sorter: true
  },
  {
    title: 'Total Stops',
    key: 'total_stops'
  },
 {
    title: "Status",
    key: "status",
    render: (row) => {
      return h(NSwitch, {
        value: row.status,
        onUpdateValue: async (value: boolean) => {
          try {
            await routesApi.toggleStatus(row.ids, value );
            row.status = value;
            message.success(`Route : ${row.title} status updated successfully`);
          } catch (error) {
            message.error("Failed to update status");
            console.error("Status update error:", error);
          }
        },
      });
    },
  },
  {
    title:'Created At',
    key:'createdAt',
    render:(row:Route) => renderDate(row.createdAt)
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: Route) {
      return h(NSpace, {}, {
        default: () => [
          renderActionButton(EditIcon, () => router.push(`/manage-routes/routes/edit-route/${row.ids}`), 'Edit',null,'primary'),
           renderActionButton(CopyIcon, () => replicateRoute(row.ids), 'Replicate',null,'info'),
          renderDeleteActionButton('Are you sure you want to delete this route?', () => handleDelete(row.ids),'Delete',null,'error')
        ]
      })
    }
  }
]

const replicateRoute = async (item: Route) =>{

}

const fetchRoutes = async (params: any) => {
  const response = await routesApi.getAll(params)
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
          <h2 class="text-xl font-bold">Routes</h2>
          <NButton type="primary" @click="router.push('/manage-routes/routes/create-route')">
            <template #icon>
              <NIcon>
                <PlusIcon />
              </NIcon>
            </template>
            Add Route
          </NButton>
        </NSpace>
        <DataTableWrapper
          :key="refreshKey"
          :fetchData="fetchRoutes"
          :columns="columns"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>