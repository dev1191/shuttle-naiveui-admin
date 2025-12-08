<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
  NCard,
  NButton,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NInputNumber,
  NEmpty,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui';
import { Plus as PlusIcon, Pencil as EditIcon, Trash2 as DeleteIcon } from 'lucide-vue-next';
import type { SocialLink } from '@/types/settings/social';
import { settingsApi } from '@/services/setting.service';

interface Props {
  item?: any;
}

const props = defineProps<Props>();
const message = useMessage();

// Modal state
const showModal = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const formRef = ref<FormInst | null>(null);
const formLoading = ref(false);
const editingIndex = ref<number>(-1);

// Social links data
const socialLinks = ref<SocialLink[]>([]);

// Form model
const formModel = reactive<SocialLink>({
  name: '',
  url: '',
  order: 0,
  is_active: true,
});

// Form rules
const rules: FormRules = {
  name: [
    { required: true, message: 'Please enter social media name', trigger: 'blur' }
  ],
  url: [
    { required: true, message: 'Please enter URL', trigger: 'blur' },
    { type: 'url', message: 'Please enter a valid URL', trigger: 'blur' }
  ],
  order: [
    { required: true, message: 'Please enter display order', trigger: 'blur', type: 'number' }
  ],
};

// Watch for item changes
watch(() => props.item, (newItem) => {
  if (newItem?.type) {
    socialLinks.value = newItem.type;
  }
}, { immediate: true });

// Modal title
const modalTitle = computed(() => 
  modalMode.value === 'create' ? 'Add Social Link' : 'Edit Social Link'
);

// Open modal for create
function handleCreate() {
  modalMode.value = 'create';
  editingIndex.value = -1;
  resetForm();
  showModal.value = true;
}

// Open modal for edit
function handleEdit(link: SocialLink, index: number) {
  modalMode.value = 'edit';
  editingIndex.value = index;
  Object.assign(formModel, link);
  showModal.value = true;
}

// Delete social link
function handleDelete(index: number) {
  socialLinks.value.splice(index, 1);
  saveSocialLinks();
}

// Reset form
function resetForm() {
  formModel.name = '';
  formModel.url = '';
  formModel.order = socialLinks.value.length;
  formModel.is_active = true;
  formRef.value?.restoreValidation();
}

// Handle form submit
async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      formLoading.value = true;
      try {
        if (modalMode.value === 'create') {
          socialLinks.value.push({ ...formModel });
        } else {
          socialLinks.value[editingIndex.value] = { ...formModel };
        }
        
        await saveSocialLinks();
        message.success(`Social link ${modalMode.value === 'create' ? 'added' : 'updated'} successfully`);
        showModal.value = false;
        resetForm();
      } catch (error: any) {
        message.error(error.message || 'Failed to save social link');
      } finally {
        formLoading.value = false;
      }
    }
  });
}

// Save social links to backend
async function saveSocialLinks() {
  try {
    await settingsApi.update('social_links', { type: socialLinks.value });
  } catch (error: any) {
    message.error(error.message || 'Failed to save social links');
    throw error;
  }
}

// Handle modal cancel
function handleCancel() {
  showModal.value = false;
  resetForm();
}
</script>

<template>
  <div>
    <NSpace justify="end" class="mb-4">
      <NButton type="primary" @click="handleCreate">
        <template #icon>
          <PlusIcon :size="16" />
        </template>
        Add Social Link
      </NButton>
    </NSpace>

    <div v-if="socialLinks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NCard
        v-for="(link, index) in socialLinks"
        :key="index"
        :title="link.name"
        size="small"
        hoverable
      >
        <template #header-extra>
          <NSpace :size="8">
            <NButton
              size="small"
              quaternary
              circle
              @click="handleEdit(link, index)"
            >
              <template #icon>
                <EditIcon :size="16" />
              </template>
            </NButton>
            <NButton
              size="small"
              quaternary
              circle
              type="error"
              @click="handleDelete(index)"
            >
              <template #icon>
                <DeleteIcon :size="16" />
              </template>
            </NButton>
          </NSpace>
        </template>

        <NSpace vertical :size="8">
          <div>
            <strong>URL:</strong>
            <a :href="link.url" target="_blank" class="text-primary ml-2">
              {{ link.url }}
            </a>
          </div>
          <div>
            <strong>Order:</strong> {{ link.order }}
          </div>
          <div>
            <strong>Status:</strong>
            <NTag :type="link.is_active ? 'success' : 'default'" size="small" class="ml-2">
              {{ link.is_active ? 'Active' : 'Inactive' }}
            </NTag>
          </div>
        </NSpace>
      </NCard>
    </div>

    <NEmpty v-else description="No social links added yet" class="my-8" />

    <!-- Add/Edit Modal -->
    <NModal
      v-model:show="showModal"
      :title="modalTitle"
      preset="card"
      :style="{ width: '600px' }"
      :mask-closable="false"
    >
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <NFormItem label="Social Media Name" path="name">
          <NInput
            v-model:value="formModel.name"
            placeholder="e.g., Facebook, Twitter, LinkedIn"
            size="large"
          />
        </NFormItem>

        <NFormItem label="URL" path="url">
          <NInput
            v-model:value="formModel.url"
            placeholder="https://facebook.com/yourpage"
            size="large"
          />
        </NFormItem>

        <NFormItem label="Display Order" path="order">
          <NInputNumber
            v-model:value="formModel.order"
            :min="0"
            :step="1"
            placeholder="Enter display order"
            size="large"
            style="width: 100%"
          />
        </NFormItem>

        <NFormItem label="Active">
          <NSwitch v-model:value="formModel.is_active" size="large" />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancel">Cancel</NButton>
          <NButton type="primary" :loading="formLoading" @click="handleSubmit">
            {{ modalMode === 'create' ? 'Add' : 'Update' }}
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.text-primary {
  color: var(--n-color-target);
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>
