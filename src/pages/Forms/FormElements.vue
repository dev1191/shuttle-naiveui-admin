<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Form Elements</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Comprehensive form components and validation examples
        </p>
      </div>

      <!-- Basic Form -->
      <n-card title="Basic Form" :bordered="false" class="shadow-sm">
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          label-placement="top"
          require-mark-placement="right-hanging"
        >
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="Full Name" path="fullName">
              <n-input
                v-model:value="formValue.fullName"
                placeholder="Enter your full name"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Email" path="email">
              <n-input
                v-model:value="formValue.email"
                placeholder="your.email@example.com"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Phone Number" path="phone">
              <n-input
                v-model:value="formValue.phone"
                placeholder="+1 (555) 000-0000"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Age" path="age">
              <n-input-number
                v-model:value="formValue.age"
                placeholder="Enter age"
                :min="18"
                :max="100"
                style="width: 100%"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Address" path="address">
              <n-input
                v-model:value="formValue.address"
                type="textarea"
                placeholder="Enter your full address"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Country" path="country">
              <n-select
                v-model:value="formValue.country"
                placeholder="Select country"
                :options="countryOptions"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="City" path="city">
              <n-select
                v-model:value="formValue.city"
                placeholder="Select city"
                :options="cityOptions"
                :disabled="!formValue.country"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Skills" path="skills">
              <n-select
                v-model:value="formValue.skills"
                placeholder="Select your skills"
                :options="skillOptions"
                multiple
                filterable
                tag
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Gender" path="gender">
              <n-radio-group v-model:value="formValue.gender">
                <n-space>
                  <n-radio value="male">Male</n-radio>
                  <n-radio value="female">Female</n-radio>
                  <n-radio value="other">Other</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Interests" path="interests">
              <n-checkbox-group v-model:value="formValue.interests">
                <n-space>
                  <n-checkbox value="sports" label="Sports" />
                  <n-checkbox value="music" label="Music" />
                  <n-checkbox value="reading" label="Reading" />
                  <n-checkbox value="travel" label="Travel" />
                  <n-checkbox value="cooking" label="Cooking" />
                </n-space>
              </n-checkbox-group>
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Date of Birth" path="dateOfBirth">
              <n-date-picker
                v-model:value="formValue.dateOfBirth"
                type="date"
                placeholder="Select date"
                style="width: 100%"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Preferred Contact Time" path="contactTime">
              <n-time-picker
                v-model:value="formValue.contactTime"
                placeholder="Select time"
                style="width: 100%"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" path="subscribe">
              <n-checkbox v-model:checked="formValue.subscribe">
                Subscribe to newsletter
              </n-checkbox>
            </n-form-item-gi>

            <n-form-item-gi :span="24" path="terms">
              <n-checkbox v-model:checked="formValue.terms">
                I agree to the terms and conditions
              </n-checkbox>
            </n-form-item-gi>

            <n-gi :span="24">
              <n-space>
                <n-button type="primary" @click="handleSubmit">
                  Submit Form
                </n-button>
                <n-button @click="handleReset">
                  Reset
                </n-button>
                <n-button @click="handleValidate">
                  Validate
                </n-button>
              </n-space>
            </n-gi>
          </n-grid>
        </n-form>
      </n-card>

      <!-- Advanced Form Elements -->
      <n-card title="Advanced Form Elements" :bordered="false" class="shadow-sm">
        <n-form label-placement="top">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="Slider">
              <n-slider v-model:value="sliderValue" :step="5" :marks="sliderMarks" />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Slider Value">
              <n-input-number
                v-model:value="sliderValue"
                :min="0"
                :max="100"
                style="width: 100%"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Rating">
              <n-rate v-model:value="ratingValue" allow-half />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="Switch">
              <n-switch v-model:value="switchValue">
                <template #checked>ON</template>
                <template #unchecked>OFF</template>
              </n-switch>
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Color Picker">
              <n-color-picker v-model:value="colorValue" :modes="['hex', 'rgb']" />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Transfer">
              <n-transfer
                v-model:value="transferValue"
                :options="transferOptions"
                source-filterable
              />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Dynamic Tags">
              <n-dynamic-tags v-model:value="tags" />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="Upload Files">
              <n-upload
                action="/api/upload"
                :default-upload="false"
                list-type="image-card"
                :max="5"
              >
                <n-button>Upload Files</n-button>
              </n-upload>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-card>

      <!-- Inline Form -->
      <n-card title="Inline Form" :bordered="false" class="shadow-sm">
        <n-form inline :model="inlineFormValue">
          <n-form-item label="Search">
            <n-input v-model:value="inlineFormValue.search" placeholder="Search..." />
          </n-form-item>
          <n-form-item label="Status">
            <n-select
              v-model:value="inlineFormValue.status"
              placeholder="Select status"
              :options="statusOptions"
              style="width: 150px"
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleInlineSearch">
              Search
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>

      <!-- Form with Validation Messages -->
      <n-card title="Validation Examples" :bordered="false" class="shadow-sm">
        <n-alert type="info" title="Form Validation" class="mb-4">
          Try submitting the form without filling required fields to see validation in action.
        </n-alert>
        <n-space vertical size="large">
          <n-input
            placeholder="Required field"
            :status="validationStatus.required"
          />
          <n-input
            placeholder="Email validation"
            :status="validationStatus.email"
          />
          <n-input
            placeholder="Minimum length (5 chars)"
            :status="validationStatus.minLength"
          />
        </n-space>
      </n-card>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import {
  NCard,
  NForm,
  NFormItem,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NSpace,
  NRadioGroup,
  NRadio,
  NCheckboxGroup,
  NCheckbox,
  NDatePicker,
  NTimePicker,
  NSlider,
  NRate,
  NSwitch,
  NColorPicker,
  NTransfer,
  NDynamicTags,
  NUpload,
  NAlert,
  NGi,
  type FormInst,
  type FormRules,
  type FormItemRule,
  useMessage
} from 'naive-ui'
import { ref } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const message = useMessage()
const formRef = ref<FormInst | null>(null)

// Form data
const formValue = ref({
  fullName: '',
  email: '',
  phone: '',
  age: null,
  address: '',
  country: null,
  city: null,
  skills: [],
  gender: null,
  interests: [],
  dateOfBirth: null,
  contactTime: null,
  subscribe: false,
  terms: false,
})

// Form validation rules
const rules: FormRules = {
  fullName: [
    {
      required: true,
      message: 'Please input your full name',
      trigger: ['input', 'blur'],
    },
  ],
  email: [
    {
      required: true,
      message: 'Please input your email',
      trigger: ['input', 'blur'],
    },
    {
      type: 'email',
      message: 'Please input valid email',
      trigger: ['input', 'blur'],
    },
  ],
  phone: [
    {
      required: true,
      message: 'Please input your phone number',
      trigger: ['input', 'blur'],
    },
  ],
  age: [
    {
      type: 'number',
      required: true,
      message: 'Please input your age',
      trigger: ['input', 'blur'],
    },
  ],
  country: [
    {
      required: true,
      message: 'Please select your country',
      trigger: ['change', 'blur'],
    },
  ],
  terms: [
    {
      validator: (_rule: FormItemRule, value: boolean) => {
        return value === true
      },
      message: 'You must agree to terms and conditions',
      trigger: 'change',
    },
  ],
}

// Options
const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
]

const cityOptions = [
  { label: 'New York', value: 'ny' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
  { label: 'Houston', value: 'hou' },
]

const skillOptions = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Node.js', value: 'node' },
  { label: 'Python', value: 'python' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

// Advanced form values
const sliderValue = ref(50)
const sliderMarks = {
  0: '0',
  50: '50',
  100: '100',
}
const ratingValue = ref(3.5)
const switchValue = ref(true)
const colorValue = ref('#18a058')
const transferValue = ref([])
const transferOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
  { label: 'Option 4', value: 'opt4' },
  { label: 'Option 5', value: 'opt5' },
]
const tags = ref(['Tag 1', 'Tag 2'])

// Inline form
const inlineFormValue = ref({
  search: '',
  status: null,
})

// Validation status
const validationStatus = ref({
  required: 'error' as const,
  email: 'warning' as const,
  minLength: 'success' as const,
})

// Form handlers
const handleSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      message.success('Form validation passed!')
      console.log('Form values:', formValue.value)
    } else {
      message.error('Form validation failed!')
      console.log('Validation errors:', errors)
    }
  })
}

const handleReset = () => {
  formRef.value?.restoreValidation()
  formValue.value = {
    fullName: '',
    email: '',
    phone: '',
    age: null,
    address: '',
    country: null,
    city: null,
    skills: [],
    gender: null,
    interests: [],
    dateOfBirth: null,
    contactTime: null,
    subscribe: false,
    terms: false,
  }
  message.info('Form reset')
}

const handleValidate = () => {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      message.success('Validation passed!')
    } else {
      message.error('Validation failed!')
    }
  })
}

const handleInlineSearch = () => {
  message.info(`Searching: ${inlineFormValue.value.search} | Status: ${inlineFormValue.value.status}`)
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
