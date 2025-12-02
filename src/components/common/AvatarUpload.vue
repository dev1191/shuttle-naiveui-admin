<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage, NIcon, NUpload, NAvatar, NUploadTrigger } from 'naive-ui'
import { Plus as PlusIcon, LoaderCircle as LoadingIcon } from 'lucide-vue-next'

interface Props {
  modelValue?: File | string | null
  size?: number
  shape?: 'circle' | 'square'
  label?: string
  maxSizeMB?: number
}
interface Emits {
  (e: 'update:modelValue', value: File | string | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 60,
  shape: 'circle',
  label: 'Upload',
  maxSizeMB: 2,
})

const emit = defineEmits<Emits>()
const message = useMessage()

const loading = ref(false)
const previewUrl = ref<string>('')

const beforeUpload = async (data: { file: File }) => {
  const file = data.file

  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Only image files are allowed!')
    return false
  }

  const isLt = file.size / 1024 / 1024 < props.maxSizeMB
  if (!isLt) {
    message.error(`Image must be smaller than ${props.maxSizeMB}MB!`)
    return false
  }

  return true
}

const handleChange = (options: any) => {
  const file = options.file?.file
  if (!file) return

  loading.value = true
  try {
    emit('update:modelValue', file)
    previewUrl.value = URL.createObjectURL(file)
  } catch {
    message.error('Image load failed!')
  } finally {
    loading.value = false
  }
}

const previewSrc = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (typeof props.modelValue === 'string') return props.modelValue
  return ''
})
</script>


<template>
  <n-upload
    :show-file-list="false"
    accept="image/*"
    :max-size="props.maxSizeMB * 1024 * 1024"
    :before-upload="beforeUpload"
    @change="handleChange"
    abstract
  >
    <n-upload-trigger #="{ handleClick }" abstract>
      <div
        class="upload-wrapper"
        :class="{ 'is-circle': props.shape === 'circle' }"
        :style="{ width: props.size + 'px', height: props.size + 'px' }"
        @click="handleClick"
      >
        <template v-if="previewSrc">
          <n-avatar
            :src="previewSrc"
            :size="props.size"
            :round="props.shape === 'circle'"
            object-fit="cover"
          />
          <div class="upload-overlay">
            <n-icon size="24" color="#fff">
              <PlusIcon />
            </n-icon>
          </div>
        </template>

        <template v-else>
          <div class="upload-placeholder">
            <n-icon v-if="loading" size="28" class="animate-spin">
              <LoadingIcon />
            </n-icon>

            <n-icon v-else size="28">
              <PlusIcon />
            </n-icon>

            <div class="upload-label">{{ props.label }}</div>
          </div>
        </template>
      </div>
    </n-upload-trigger>
  </n-upload>
</template>

<style scoped>
.upload-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--n-border-color);
  background-color: var(--n-color-modal);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-wrapper.is-circle {
  border-radius: 50%;
}

.upload-wrapper:hover {
  border-color: var(--n-primary-color);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--n-text-color-3);
  gap: 8px;
}

.upload-label {
  font-size: 12px;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-wrapper:hover .upload-overlay {
  opacity: 1;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
