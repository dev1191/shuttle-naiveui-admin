<script setup lang="ts">
import { NFormItem, NInput, NInputNumber } from 'naive-ui'

interface Props {
  label: string
  path: string
  modelValue: string | number | null
  placeholder?: string
  required?: boolean
  type?: 'text' | 'password' | 'textarea' | 'number'
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
  'update:modelValue': [value: string | number | null]
}>()

function handleInput(value: string | number | null) {
  emit('update:modelValue', value)
}
</script>

<template>
  <NFormItem :label="label" :path="path" :required="required">
    <NInputNumber
      v-if="type === 'number'"
      :value="modelValue === null || modelValue === undefined || modelValue === '' ? null : Number(modelValue)"
      :placeholder="placeholder"
      :disabled="disabled"
      style="width: 100%"
      @update:value="handleInput"
    />
    <NInput
      v-else
      size="large"
      :value="modelValue === null || modelValue === undefined ? null : String(modelValue)"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :rows="rows"
      @update:value="handleInput"
    />
  </NFormItem>
</template>
