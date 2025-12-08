<script setup lang="ts">
import { ref, watch } from 'vue';
import { NForm, NFormItem, NInput, NSelect, NSwitch, NButton, NSpace, NGrid, NGridItem, useMessage } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import type { EmailTemplate } from '@/types/settings/emailTemplate';
import { emailTemplatesApi } from '@/services/emailTemplate.service';
import RichTextEditor from '@/components/common/RichTextEditor.vue';

const props = defineProps<{
  template: EmailTemplate | null;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const message = useMessage();
const formRef = ref<FormInst | null>(null);
const formLoading = ref(false);

const formModel = ref({
  name: '',
  slug: '',
  subject: '',
  body: '',
  description: '',
  recipient_type: 'customer',
  is_active: true,
  variables: [] as string[],
});

const recipientTypeOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Operator', value: 'operator' },
  { label: 'Driver', value: 'driver' },
  { label: 'Customer', value: 'customer' },
];

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter template name', trigger: 'blur' }],
  slug: [{ required: true, message: 'Please enter slug', trigger: 'blur' }],
  subject: [{ required: true, message: 'Please enter email subject', trigger: 'blur' }],
  body: [{ required: true, message: 'Please enter email body', trigger: 'blur' }],
  recipient_type: [{ required: true, message: 'Please select recipient type', trigger: 'change' }],
};

// Watch for template changes and populate form
watch(
  () => props.template,
  (newTemplate) => {
    if (newTemplate) {
      formModel.value = {
        name: newTemplate.name,
        slug: newTemplate.slug,
        subject: newTemplate.subject,
        body: newTemplate.body,
        description: newTemplate.description,
        recipient_type: newTemplate.recipient_type,
        is_active: newTemplate.is_active,
        variables: newTemplate.variables || [],
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors && props.template) {
      formLoading.value = true;
      try {
        await emailTemplatesApi.update(props.template.ids, formModel.value);
        message.success('Email template updated successfully');
        emit('success');
      } catch (error: any) {
        message.error(error.message || 'Failed to update email template');
        console.error('Update error:', error);
      } finally {
        formLoading.value = false;
      }
    }
  });
};

const handleCancel = () => {
  formRef.value?.restoreValidation();
  emit('cancel');
};
</script>

<template>
  <NForm
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-placement="top"
    require-mark-placement="right-hanging"
  >
    <NGrid :x-gap="8" :cols="2">
      <!-- Left Column -->
      <NGridItem>
        <NFormItem label="Template Name" path="name">
          <NInput v-model:value="formModel.name" placeholder="Enter template name" />
        </NFormItem>

        <NFormItem label="Slug" path="slug">
          <NInput v-model:value="formModel.slug" placeholder="e.g., booking-confirmation" />
        </NFormItem>

        <NFormItem label="Recipient Type" path="recipient_type">
          <NSelect
            v-model:value="formModel.recipient_type"
            :options="recipientTypeOptions"
            placeholder="Select recipient type"
          />
        </NFormItem>

        <NFormItem label="Active">
          <NSwitch v-model:value="formModel.is_active" />
        </NFormItem>
      </NGridItem>

      <!-- Right Column -->
      <NGridItem>
        <NFormItem label="Email Subject" path="subject">
          <NInput v-model:value="formModel.subject" placeholder="Enter email subject" />
        </NFormItem>

        <NFormItem label="Description" path="description">
          <NInput
            v-model:value="formModel.description"
            type="textarea"
            :rows="4"
            placeholder="Brief description of this template"
          />
        </NFormItem>
      </NGridItem>

      <!-- Full Width - Email Body -->
      <NGridItem :span="2">
        <NFormItem label="Email Body" path="body">
          <div style="min-height: 400px">
            <RichTextEditor
              v-model="formModel.body"
              placeholder="Enter email body content..."
              content-type="html"
            />
          </div>
        </NFormItem>
      </NGridItem>
    </NGrid>

    <NSpace justify="end" class="mt-4">
      <NButton @click="handleCancel">Cancel</NButton>
      <NButton type="primary" :loading="formLoading" @click="handleSubmit">
        Update Template
      </NButton>
    </NSpace>
  </NForm>
</template>
