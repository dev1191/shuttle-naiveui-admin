<script setup lang="ts">
import { NFormItem, NDatePicker } from 'naive-ui'

interface Props {
  label: string
  path: string
  modelValue: number | null
  placeholder?: string
  required?: boolean
  disabled?: boolean
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year'
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Select date',
  required: false,
  disabled: false,
  type: 'date'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

function handleUpdate(value: number | null) {
  emit('update:modelValue', value)
}
</script>

<template>
  <NFormItem :label="label" :path="path" :required="required">
    <NDatePicker
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full"
      @update:value="handleUpdate"
    />
  </NFormItem>
</template>
