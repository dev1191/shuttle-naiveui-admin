<script setup lang="ts">
import type { FormItemRule, FormInst } from "naive-ui";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMessage } from "naive-ui";

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

const { t } = useI18n()
const loading = ref(false);
const keepLoggedIn = ref(false);
const isNavigating = ref(false);

const signInFormRef = ref<FormInst | null>(null);

const signInForm = reactive({
  email: "",
  password: "",
});

const signInFormRules: Record<string, FormItemRule[]> = {
  email: [
    { required: true, message: t('login.validations.emailRequired'), trigger: ["input", "blur"] },
  ],
  password: [
    {
      required: true,
      message: t('login.validations.passwordRequired'),
      trigger: ["input", "blur"],
    },
  ],
};

const handleSubmit = async () => {
  signInFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      loading.value = true;
      try {
        const result = await authStore.login({
          email: signInForm.email,
          password: signInForm.password,
        });

        if (result.success) {
          message.success(t('login.successMessage'));
          toLayout();
        } else {
          message.error(result.error || t('login.failedMessage'));
        }
      } catch (error: any) {
        message.error(error.message || t('login.failedMessage'));
      } finally {
        loading.value = false;
      }
    }
  });
};

function toLayout() {
  const { r } = router.currentRoute.value.query;

  isNavigating.value = true;
  router
    .replace({
      path: (r as string) || '/dashboard',
    })
    .finally(() => {
      isNavigating.value = false;
    });
}
</script>

<template>
  <div class="w-full max-w-md pt-10 mx-auto">
    <router-link
      to="/"
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
      Back to dashboard
    </router-link>
  </div>
  <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
    <div>
      <div class="mb-5 sm:mb-8">
        <h1
          class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
        >
          {{ t('login.title') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
         {{ t('login.message') }} 
        </p>
      </div>
      <div>
        <NForm
          ref="signInFormRef"
          :model="signInForm"
          :show-require-mark="false"
          :rules="signInFormRules"
        >
          <div class="space-y-5">
            <!-- Email -->

            <NFormItem path="email" :label="t('login.email')">
              <NInput
                v-model:value="signInForm.email"
                placeholder="Enter Your Email Address"
                size="large"
              />
            </NFormItem>
            <!-- Password -->

            <NFormItem path="password" :label="t('login.password')">
              <NInput
                v-model:value="signInForm.password"
                placeholder="Enter Your Password"
                type="password"
                size="large"
                show-password-on="mousedown"
                :maxlength="8"
              />
            </NFormItem>

            <!-- Checkbox -->
            <div class="flex items-center justify-between">
              <div>
                <label
                  for="keepLoggedIn"
                  class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                >
                  <div class="relative">
                    <input
                      v-model="keepLoggedIn"
                      type="checkbox"
                      id="keepLoggedIn"
                      class="sr-only"
                    />
                    <div
                      :class="
                        keepLoggedIn
                          ? 'border-brand-500 bg-brand-500'
                          : 'bg-transparent border-gray-300 dark:border-gray-700'
                      "
                      class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
                    >
                      <span :class="keepLoggedIn ? '' : 'opacity-0'">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                            stroke="white"
                            stroke-width="1.94437"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  Keep me logged in
                </label>
              </div>
              <router-link
                to="/auth/reset-password"
                class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >{{t('login.forgetPassword')}}?</router-link
              >
            </div>
            <!-- Button -->
            <div>
              <NButton
                type="primary"
                :loading="loading"
                attr-type="button"
                :disabled="isNavigating"
                block
                size="large"
                class="bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                @click="handleSubmit"
              >
                {{ t('login.loginButton') }}
              </NButton>
            </div>
          </div>
        </NForm>
      </div>
    </div>
  </div>
</template>
