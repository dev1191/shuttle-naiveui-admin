<script setup lang="ts" generic="T extends Record<string, any>">
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, NSpace, NSwitch, NSelect } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import { computed, ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'

interface SelectOption {
  label: string
  value: any
}

interface FormField {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'switch' | 'select'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: SelectOption[]  // For select type
  defaultValue?: any  // Default value for the field
}

interface Props {
  title: string
  fields: FormField[]
  modelValue?: T | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: T | null]
  'submit': [value: T]
  'cancel': []
}>()

const show = defineModel<boolean>('show', { default: false })

const themeStore = useThemeStore()
const placement = computed(() => themeStore.language === 'ar' ? 'left' : 'right')

const formRef = ref<FormInst | null>(null)
const formData = ref<T>({} as T)

// Watch for modelValue changes to populate form
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    formData.value = { ...newValue }
  } else {
    // Reset form when no modelValue
    const resetData = {} as T
    props.fields.forEach(field => {
      // Set default values based on field type
      if (field.defaultValue !== undefined) {
        resetData[field.key as keyof T] = field.defaultValue
      } else if (field.type === 'switch') {
        resetData[field.key as keyof T] = false as any
      } else if (field.type === 'select') {
        resetData[field.key as keyof T] = null as any
      } else {
        resetData[field.key as keyof T] = '' as any
      }
    })
    formData.value = resetData
  }
}, { immediate: true })

// Generate validation rules
const rules = computed<FormRules>(() => {
  const generatedRules: FormRules = {}
  props.fields.forEach(field => {
    if (field.required) {
      generatedRules[field.key] = {
        required: true,
        message: `${field.label} is required`,
        trigger: field.type === 'switch' ? ['change'] : ['blur', 'input', 'change']
      }
    }
  })
  return generatedRules
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', formData.value)
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleCancel = () => {
  show.value = false
  emit('cancel')
}

// Reset form when drawer closes
watch(show, (newShow) => {
  if (!newShow && formRef.value) {
    formRef.value.restoreValidation()
  }
})
</script>

<template>
  <NDrawer v-model:show="show" :width="400" :placement="placement">
    <NDrawerContent :title="title">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <NFormItem
          v-for="field in fields"
          :key="field.key"
          :label="field.label"
          :path="field.key"
        >
          <!-- Switch Field -->
          <NSwitch
            v-if="field.type === 'switch'"
            v-model:value="formData[field.key as keyof T]"
            :disabled="field.disabled"
          />

          <!-- Select Field -->
          <NSelect
            v-else-if="field.type === 'select'"
            v-model:value="formData[field.key as keyof T]"
            :options="field.options || []"
            :placeholder="field.placeholder || `Select ${field.label.toLowerCase()}`"
            :disabled="field.disabled"
            clearable
          />

          <!-- Textarea Field -->
          <NInput
            v-else-if="field.type === 'textarea'"
            v-model:value="formData[field.key as keyof T]"
            type="textarea"
            :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
            :disabled="field.disabled"
            :rows="4"
          />

          <!-- Default Text/Number Input -->
          <NInput
            v-else
            v-model:value="formData[field.key as keyof T]"
            :type="field.type || 'text'"
            :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
            :disabled="field.disabled"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancel">
            Cancel
          </NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            Submit
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
