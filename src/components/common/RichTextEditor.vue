<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  contentType?: 'html' | 'text' | 'delta';
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', editor: any): void;
  (e: 'focus', editor: any): void;
  (e: 'ready', editor: any): void;
}>();

const content = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value)
});

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];
</script>

<template>
  <div class="rich-text-editor">
    <QuillEditor
      v-model:content="content"
      :content-type="contentType || 'html'"
      :placeholder="placeholder"
      :read-only="readOnly"
      :toolbar="toolbarOptions"
      theme="snow"
      @blur="(editor) => emit('blur', editor)"
      @focus="(editor) => emit('focus', editor)"
      @ready="(editor) => emit('ready', editor)"
    />
  </div>
</template>

<style scoped>
:deep(.ql-toolbar) {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-color: rgba(239, 239, 245, 1);
}

:deep(.ql-container) {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-color: rgba(239, 239, 245, 1);
  min-height: 200px;
  font-family: inherit;
}

:deep(.ql-editor) {
  min-height: 200px;
}

/* Dark mode support */
:deep(.dark .ql-toolbar),
:deep(.dark .ql-container) {
  border-color: rgba(255, 255, 255, 0.09);
}

:deep(.dark .ql-toolbar .ql-stroke),
:deep(.dark .ql-toolbar .ql-fill) {
  stroke: rgba(255, 255, 255, 0.82);
  fill: rgba(255, 255, 255, 0.82);
}
</style>
