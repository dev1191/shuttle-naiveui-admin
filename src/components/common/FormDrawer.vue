<script setup lang="ts" generic="T extends Record<string, any>">
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NInputNumber, NButton, NSpace, NSwitch, NSelect, NRadio, NRadioGroup, NRadioButton, NDatePicker } from 'naive-ui'
import AvatarUpload from '@/components/common/AvatarUpload.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import PhoneInput from '@/components/common/PhoneInput.vue'
import { useThemeStore } from '@/stores/theme'
import { computed, ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { useI18n } from 'vue-i18n'

interface SelectOption {
  label: string
  value: any
}

interface FormField {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'radio' | 'radio-group' | 'datepicker' | 'upload' | 'editor' | 'phone'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: SelectOption[]  // For select type
  defaultValue?: any  // Default value for the field
  dateType?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year' | 'quarter' // For datepicker
  valueFormat?: string // For datepicker value format
  uploadLabel?: string // For upload component label
  countryCodeKey?: string // For phone input country code key
}

interface Props {
  title: string
  fields?: FormField[]
  rules?: FormRules
  modelValue?: T | null
  loading?: boolean
  width?: number
}

const { t } = useI18n()
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  loading: false,
  fields: () => [],
  width: 500
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
    if (props.fields) {
      props.fields.forEach(field => {
        // Set default values based on field type
        if (field.defaultValue !== undefined) {
          resetData[field.key as keyof T] = field.defaultValue
        } else if (field.type === 'switch') {
          resetData[field.key as keyof T] = false as any
        } else if (field.type === 'select' || field.type === 'radio' || field.type === 'radio-group' || field.type === 'datepicker' || field.type === 'upload') {
          resetData[field.key as keyof T] = null as any
        } else if (field.type === 'phone') {
          resetData[field.key as keyof T] = '' as any
          if (field.countryCodeKey) {
            resetData[field.countryCodeKey as keyof T] = '' as any
          }
        } else {
          resetData[field.key as keyof T] = '' as any
        }
      })
    }
    formData.value = resetData
  }
}, { immediate: true })

// Generate validation rules
const rules = computed<FormRules>(() => {
  const generatedRules: FormRules = {}
  if (props.fields) {
    props.fields.forEach(field => {
      if (field.required) {
        generatedRules[field.key] = {
          required: true,
          message: `${field.label} is required`,
          trigger: field.type === 'switch' ? ['change'] : ['blur', 'input', 'change']
        }
      }
    })
  }
  return { ...generatedRules, ...props.rules }
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
  <NDrawer v-model:show="show" :width="width" :placement="placement">
    <NDrawerContent :title="title">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <slot :model="formData"></slot>

        <template v-if="fields && fields.length > 0">
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

            <!-- Radio Group Field -->
            <NRadioGroup
              v-else-if="field.type === 'radio' || field.type === 'radio-group'"
              v-model:value="formData[field.key as keyof T]"
              :disabled="field.disabled"
            >
           
                <NRadioButton
                  v-for="option in field.options || []"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </NRadioButton>
         
            </NRadioGroup>

            <!-- Date Picker Field -->
            <NDatePicker
              v-else-if="field.type === 'datepicker'"
              v-model:value="formData[field.key as keyof T]"
              :type="field.dateType || 'date'"
              :value-format="field.valueFormat"
              :placeholder="field.placeholder || `Select ${field.label.toLowerCase()}`"
              :disabled="field.disabled"
              clearable
              style="width: 100%"
            />

            <!-- Upload Field -->
            <AvatarUpload
              v-else-if="field.type === 'upload'"
              v-model="formData[field.key as keyof T]"
              :label="field.uploadLabel || 'Upload Image'"
            />

            <!-- Editor Field -->
            <RichTextEditor
              v-else-if="field.type === 'editor'"
              v-model="formData[field.key as keyof T]"
              :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
              :read-only="field.disabled"
            />

            <!-- Number Field -->
            <NInputNumber
              v-else-if="field.type === 'number'"
              v-model:value="formData[field.key as keyof T]"
              :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
              :disabled="field.disabled"
              clearable
            />

            <!-- Phone Input Field -->
            <PhoneInput
              v-else-if="field.type === 'phone'"
              v-model:value="formData[field.key as keyof T]"
              v-model:countryCode="formData[(field.countryCodeKey || 'country_code') as keyof T]"
              :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
              :disabled="field.disabled"
            />

            <!-- Default Text Input -->
            <NInput
              v-else
              v-model:value="formData[field.key as keyof T]"
              :type="(field.type === 'text' || field.type === 'textarea' || field.type === 'password') ? field.type : 'text'"
              :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
              :disabled="field.disabled"
            />
          </NFormItem>
        </template>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancel" size="large" secondary strong type="error">
            {{ t('common.cancel') }}
          </NButton>
          <NButton type="primary"  size="large" :loading="loading" @click="handleSubmit">
            {{ t('common.submit') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
