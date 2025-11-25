<script setup lang="ts">
import { NFormItem, NSelect, type SelectOption } from 'naive-ui'

interface Props {
  label: string
  path: string
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  clearable?: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  required: false,
  disabled: false,
  clearable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

function handleUpdate(value: string | number | null) {
  emit('update:modelValue', value)
}
</script>

<template>
  <NFormItem :label="label" :path="path" :required="required">
    <NSelect
      :value="modelValue"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      @update:value="handleUpdate"
    />
  </NFormItem>
</template>
