<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NInput, NSelect, NInputGroup } from 'naive-ui'
import { countriesApi } from '@/services/country.service'
import type { CountryOption } from '@/types/settings/country'

interface Props {
  value: string
  countryCode: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:value', value: string): void
  (e: 'update:countryCode', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  countryCode: '',
  placeholder: 'Enter phone number',
  disabled: false
})

const emit = defineEmits<Emits>()

const countries = ref<CountryOption[]>([])
const loading = ref(false)

const countryOptions = computed(() => {
  return countries.value.map(country => ({
    label: country.label,
    value: country.value
  }))
})

const fetchCountries = async (search: string = '') => {
  loading.value = true
  try {
    // Fetch countries with search
    const response = await countriesApi.countryLists(search)
    countries.value = response.items
  } catch (error) {
    console.error('Failed to fetch countries:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string) => {
  fetchCountries(query)
}

const handleCodeChange = (value: string) => {
  emit('update:countryCode', value)
}

const handlePhoneChange = (value: string) => {
  emit('update:value', value)
}

onMounted(() => {
  fetchCountries()
})
</script>

<template>
  <NInputGroup>
    <NSelect
      :value="countryCode"
      :options="countryOptions"
      :loading="loading"
      :disabled="disabled"
      placeholder="Code"
      :style="{ width: '35%' }"
      @update:value="handleCodeChange"
      filterable
      remote
      @search="handleSearch"
    />
    <NInput
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="{ width: '65%' }"
      @update:value="handlePhoneChange"
    />
  </NInputGroup>
</template>
