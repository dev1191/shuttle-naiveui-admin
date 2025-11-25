<script setup lang="ts">
import { NCard, NSteps, NStep, NForm, NButton, NSpace, NUpload, NFormItem, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import FormInput from '@/components/common/FormInput.vue'
import FormSelect from '@/components/common/FormSelect.vue'
import FormDatePicker from '@/components/common/FormDatePicker.vue'
import { driversApi } from '@/services/driver.service'
import type { CreateDriverDTO } from '@/types/driver'

const router = useRouter()
const message = useMessage()
const currentStep = ref(1)
const loading = ref(false)

// Basic Information Form
const basicInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: null as number | null,
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

// Document Requirements Form
const documents = ref({
  licenseNumber: '',
  licenseExpiry: null as number | null,
  licenseClass: '',
  vehicleType: ''
})

const licenseFiles = ref<UploadFileInfo[]>([])
const insuranceFiles = ref<UploadFileInfo[]>([])
const identityFiles = ref<UploadFileInfo[]>([])

const vehicleTypeOptions = [
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'Van', value: 'van' },
  { label: 'Bus', value: 'bus' },
  { label: 'Truck', value: 'truck' }
]

const licenseClassOptions = [
  { label: 'Class A', value: 'A' },
  { label: 'Class B', value: 'B' },
  { label: 'Class C', value: 'C' },
  { label: 'Class D', value: 'D' }
]

function handleNext() {
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

function handlePrevious() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    const driverData: CreateDriverDTO = {
      ...basicInfo.value,
      ...documents.value
    }
    
    // Create driver via API
    await driversApi.create(driverData)
    
    message.success('Driver created successfully!')
    router.push({ name: 'driversList' })
  } catch (error: any) {
    console.error('Error creating driver:', error)
    message.error(error.response?.data?.message || 'Failed to create driver')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="p-1">
    <NCard title="Create New Driver">
      <NSteps :current="currentStep" class="mb-6">
        <NStep title="Basic Information" description="Personal details" />
        <NStep title="Documents" description="License & verification" />
      </NSteps>

      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 1">
        <NForm :model="basicInfo" label-placement="top" label-width="auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              v-model="basicInfo.firstName"
              label="First Name"
              path="firstName"
              placeholder="Enter first name"
              required
            />
            
            <FormInput
              v-model="basicInfo.lastName"
              label="Last Name"
              path="lastName"
              placeholder="Enter last name"
              required
            />
            
            <FormInput
              v-model="basicInfo.email"
              label="Email"
              path="email"
              placeholder="driver@example.com"
              required
            />
            
            <FormInput
              v-model="basicInfo.phone"
              label="Phone Number"
              path="phone"
              placeholder="+1 (555) 000-0000"
              required
            />
            
            <FormDatePicker
              v-model="basicInfo.dateOfBirth"
              label="Date of Birth"
              path="dateOfBirth"
              required
            />
            
            <FormInput
              v-model="basicInfo.address"
              label="Address"
              path="address"
              placeholder="Street address"
              required
            />
            
            <FormInput
              v-model="basicInfo.city"
              label="City"
              path="city"
              placeholder="City"
              required
            />
            
            <FormInput
              v-model="basicInfo.state"
              label="State"
              path="state"
              placeholder="State"
              required
            />
            
            <FormInput
              v-model="basicInfo.zipCode"
              label="Zip Code"
              path="zipCode"
              placeholder="00000"
              required
            />
          </div>
        </NForm>
      </div>

      <!-- Step 2: Documents -->
      <div v-show="currentStep === 2">
        <NForm :model="documents" label-placement="top" label-width="auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              v-model="documents.licenseNumber"
              label="License Number"
              path="licenseNumber"
              placeholder="DL-123456789"
              required
            />
            
            <FormDatePicker
              v-model="documents.licenseExpiry"
              label="License Expiry Date"
              path="licenseExpiry"
              required
            />
            
            <FormSelect
              v-model="documents.licenseClass"
              label="License Class"
              path="licenseClass"
              :options="licenseClassOptions"
              placeholder="Select license class"
              required
            />
            
            <FormSelect
              v-model="documents.vehicleType"
              label="Vehicle Type"
              path="vehicleType"
              :options="vehicleTypeOptions"
              placeholder="Select vehicle type"
              required
            />
          </div>

          <div class="mt-6 space-y-4">
            <NFormItem label="Driver's License (Upload)" required>
              <NUpload
                v-model:file-list="licenseFiles"
                :max="2"
                list-type="image-card"
              >
                <NButton>Upload License</NButton>
              </NUpload>
              <div class="text-xs text-gray-500 mt-1">Upload front and back of driver's license</div>
            </NFormItem>

            <NFormItem label="Insurance Certificate" required>
              <NUpload
                v-model:file-list="insuranceFiles"
                :max="1"
                list-type="image-card"
              >
                <NButton>Upload Insurance</NButton>
              </NUpload>
              <div class="text-xs text-gray-500 mt-1">Upload valid insurance certificate</div>
            </NFormItem>

            <NFormItem label="Identity Proof (Passport/ID)" required>
              <NUpload
                v-model:file-list="identityFiles"
                :max="1"
                list-type="image-card"
              >
                <NButton>Upload ID</NButton>
              </NUpload>
              <div class="text-xs text-gray-500 mt-1">Upload government-issued ID</div>
            </NFormItem>
          </div>
        </NForm>
      </div>

      <!-- Navigation Buttons -->
      <template #footer>
        <div class="flex justify-between">
          <NButton @click="handleCancel">
            Cancel
          </NButton>
          
          <NSpace>
            <NButton v-if="currentStep > 1" @click="handlePrevious">
              Previous
            </NButton>
            
            <NButton v-if="currentStep < 2" type="primary" @click="handleNext">
              Next
            </NButton>
            
            <NButton v-if="currentStep === 2" type="primary" @click="handleSubmit">
              Create Driver
            </NButton>
          </NSpace>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style scoped>
.n-upload {
  width: 100%;
}
</style>
