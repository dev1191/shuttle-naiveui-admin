<script setup lang="ts">
import { ref } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSelect,
  useMessage,
} from "naive-ui";
import type { Helper, Reply } from "@/types/helper";

const props = defineProps<{
  editingHelper: Helper;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", reply: Reply): void;
}>();

const message = useMessage();
const formRef = ref<InstanceType<typeof NForm> | null>(null);

const model = ref<Reply>({
  email: props.editingHelper.email,
  title: props.editingHelper.title
    ? `Re: ${props.editingHelper.title}`
    : "Re: Support Request",
  content: "",
  type: "email",
});

const rules = {
  email: [
    {
      required: true,
      message: "Email is required",
      trigger: ["blur", "input"],
    },
    {
      type: "email",
      message: "Invalid email format",
      trigger: ["blur", "input"],
    },
  ],
  title: {
    required: true,
    message: "Title is required",
    trigger: ["blur", "input"],
  },
  content: {
    required: true,
    message: "Content is required",
    trigger: ["blur", "input"],
  },
  type: {
    required: true,
    message: "Type is required",
    trigger: ["blur", "change"],
  },
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit("submit", model.value);
    } else {
      console.log(errors);
      message.error("Please fill out the form correctly");
    }
  });
};
</script>

<template>
  <div class="p-2">
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="top"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="Type" path="type">
        <NRadioGroup v-model:value="model.type">
          <NRadioButton value="email">Email</NRadioButton>
          <NRadioButton value="notification">Notification</NRadioButton>
        </NRadioGroup>
      </NFormItem>

      <FormInput
        v-model="model.email"
        label="Email"
        path="email"
        placeholder="Recipient Email"
        required
      />


            <FormInput
        v-model="model.title"
        label="Title"
        path="title"
        placeholder="Subject"
        required
      />

      <NFormItem label="Content" path="content">
        <NInput
          v-model:value="model.content"
          type="textarea"
          placeholder="Reply Content"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
      </NFormItem>



      <div class="mt-6 flex justify-end gap-2">
        <NButton @click="emit('close')">Cancel</NButton>
        <NButton type="primary" @click="handleSubmit">Send Reply</NButton>
      </div>
    </NForm>
  </div>
</template>
