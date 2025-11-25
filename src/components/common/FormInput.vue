<script setup lang="ts">
import { NFormItem, NInput } from 'naive-ui'

interface Props {
  label: string
  path: string
  modelValue: string
  placeholder?: string
  required?: boolean
  type?: 'text' | 'password' | 'textarea'
  disabled?: boolean
  rows?: number
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  type: 'text',
  disabled: false,
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <NFormItem :label="label" :path="path" :required="required">
    <NInput
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :rows="rows"
      @update:value="handleInput"
    />
  </NFormItem>
</template>
