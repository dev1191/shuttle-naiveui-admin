<script setup lang="ts">
import { NFormItem, NInput, NSelect, NSwitch, NGrid, NFormItemGi } from 'naive-ui'
import AvatarUpload from '@/components/common/AvatarUpload.vue'
import PhoneInput from '@/components/common/PhoneInput.vue'
import type { Admin } from '@/types/admin'

interface Props {
  model: Admin
  mode: 'create' | 'edit'
  roleOptions: { label: string; value: string }[]
}

defineProps<Props>()
</script>

<template>
  <NGrid :x-gap="12" :y-gap="8" cols="2">
    <!-- Profile Picture -->
    <NFormItemGi :span="2" label="Profile Picture" path="picture">
      <AvatarUpload v-model="model.picture" label="Upload Avatar" />
    </NFormItemGi>

    <!-- First Name -->
    <NFormItemGi label="First Name" path="firstname">
      <NInput v-model:value="model.firstname" placeholder="Enter first name" />
    </NFormItemGi>

    <!-- Last Name -->
    <NFormItemGi label="Last Name" path="lastname">
      <NInput v-model:value="model.lastname" placeholder="Enter last name" />
    </NFormItemGi>

    <!-- Email -->
    <NFormItemGi  label="Email" path="email">
      <NInput v-model:value="model.email" placeholder="Enter email address" />
    </NFormItemGi>

        <!-- Role -->
    <NFormItemGi  label="Role" path="role">
      <NSelect
        v-model:value="model.role"
        :options="roleOptions"
        placeholder="Select role"
      />
    </NFormItemGi>

    <!-- Password Fields -->
    <NFormItemGi
      label="Password"
      path="password"
      :rule="mode === 'create' ? { required: true, message: 'Password is required', trigger: ['input', 'blur'] } : undefined"
    >
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        placeholder="Enter password"
      />
    </NFormItemGi>

    <NFormItemGi
      label="Confirm Password"
      path="confirmPassword"
      :rule="mode === 'create' ? [
        { required: true, message: 'Confirm Password is required', trigger: ['input', 'blur'] },
        {
          validator: (_rule, value) => {
            if (value !== model.password) {
              return new Error('Passwords do not match')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ] : undefined"
    >
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        placeholder="Confirm password"
      />
    </NFormItemGi>

    <!-- Phone -->
    <NFormItemGi :span="2" label="Phone Number" path="phone">
      <PhoneInput
        v-model:value="model.phone"
        v-model:countryCode="model.country_code"
        placeholder="Enter phone number"
      />
    </NFormItemGi>



    <!-- Active Status -->
    <NFormItemGi :span="2" label="Active Status" path="is_active">
      <NSwitch v-model:value="model.is_active" />
    </NFormItemGi>
  </NGrid>
</template>
