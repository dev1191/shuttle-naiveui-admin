<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'

const loading = ref(false);
const resetPasswordForm = reactive({
  email: "",
});

const handleSubmit = async () => {};
</script>

<template>
  <div class="w-full max-w-md pt-10 mx-auto">
    <router-link
      to="/auth/sign-in"
      class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    >
      <svg
        class="stroke-current"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
          stroke=""
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Back to sign in
    </router-link>
  </div>
  <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
    <div>
      <div class="mb-5 sm:mb-8">
        <h1
          class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
        >
          Reset Password
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to reset password!
        </p>
      </div>
      <div>
        <NForm>
          <div class="space-y-5">
            <!-- Email -->

            <NFormItem path="eamil" label="Email">
              <NInput
                v-model:value="resetPasswordForm.email"
                placeholder="Enter Your Email Address"
                size="large"
              />
            </NFormItem>
            <!-- Password -->

            <!-- Button -->
            <div>
              <NButton
                type="primary"
                :loading="loading"
                attr-type="button"
                block
                size="large"
                class="bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                @click="handleSubmit"
              >
                Submit
              </NButton>
            </div>
          </div>
        </NForm>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
