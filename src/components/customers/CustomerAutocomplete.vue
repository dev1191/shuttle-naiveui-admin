<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue'
import { NSelect, NAvatar, NText, NSpace, NSpin } from 'naive-ui'
import { customersApi } from '@/services/customer.service'
import type { Customer } from '@/types/customer'
import { debounce } from 'lodash-es'
import type { SelectOption } from 'naive-ui'
import defaultAvatar from '@/assets/images/avatar/default.png'
import { getImageUrl } from '@/utils'

const props = defineProps<{
  value?: string | null
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string | null): void
  (e: 'select', customer: Customer | null): void
}>()

const loading = ref(false)
const options = ref<SelectOption[]>([])
const internalValue = ref<string | null>(props.value || null)

watch(() => props.value, (newValue) => {
  internalValue.value = newValue
  if (newValue && !options.value.find(o => o.value === newValue)) {
    fetchInitialCustomer(newValue)
  }
})

const fetchInitialCustomer = async (id: string) => {
  loading.value = true
  try {
    const response = await customersApi.getById(id)
    const customer = response.data
    if (customer) {
      options.value = [{
        label: customer.fullname,
        value: customer._id,
        customer: customer
      }]
    }
  } catch (error) {
    console.error('Fetch initial customer error:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce(async (query: string) => {
  if (!query) {
    return
  }
  
  loading.value = true
  try {
    const response = await customersApi.getAll({ 
      search: query,
      page: 1,
      pageSize: 20 
    })
    options.value = response.items.map(customer => ({
      label: customer.fullname,
      value: customer.ids,
      customer: customer
    }))
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}, 500)

const renderLabel = (option: SelectOption) => {
  const customer = option.customer as Customer
  if (!customer) return h(NText, {}, { default: () => option.label as string })
  return h(
    'div',
    { class: 'flex items-center gap-3 py-1' },
    [
      h(NAvatar, {
        src: customer.picture ? getImageUrl(customer.picture) : defaultAvatar,
        round: true,
        size: 'small',
        fallbackSrc: defaultAvatar,
        style: { backgroundColor: 'transparent', flexShrink: 0 }
      }),
      h('div', { class: 'flex flex-col' }, [
        h(NText, { depth: 1, strong: true }, { default: () => customer.fullname }),
        h(NText, { depth: 3, size: 'small', class: 'text-xs' }, { default: () => `+${customer.country_code ?? '91'} ${customer.phone}` })
      ])
    ]
  )
}

const handleUpdateValue = (value: string | null, option: SelectOption | null) => {
  internalValue.value = value
  emit('update:value', value)
  emit('select', option?.customer as Customer || null)
}

onMounted(() => {
  if (props.value) {
    fetchInitialCustomer(props.value)
  }
})
</script>

<template>
  <NSelect
  size="large"
    v-model:value="internalValue"
    remote
    filterable
    clearable
    :loading="loading"
    :options="options"
    :placeholder="placeholder || 'Search customer by name or phone...'"
    :render-label="renderLabel"
    @search="handleSearch"
    @update:value="handleUpdateValue"
  />
</template>
