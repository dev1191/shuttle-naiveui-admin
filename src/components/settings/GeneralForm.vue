<script setup lang="ts">
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import FormInput from "@/components/common/FormInput.vue";
import AvatarUpload from "@/components/common/AvatarUpload.vue";
import { NForm, NFlex, NCard, NGrid, NGi, NFormItem, NInput, NButton, NDivider } from "naive-ui";

const { t } = useI18n();

interface Props {
  item: any;
  isLoading: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: "submit", newGeneral: any): void;
}
const emit = defineEmits<Emits>();

const newGeneral = reactive({
  name: "",
  tagline: "",
  white_logo: null,
  dark_logo: null,
  favicon: null,
  email: "",
  phone: "",
  address: "",
});

watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(newGeneral, val);
  },
  { immediate: true }
);

const onSave = () => {
  emit("submit", newGeneral);
};
</script>

<template>
  <n-form :model="newGeneral" @submit.prevent="onSave" label-placement="top">
    <n-flex>
      <div class="w-full lg:w-3/4">
        <!-- GENERAL DETAILS -->
        <n-card title="General Settings" class="mb-4">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <FormInput
                v-model="newGeneral.name"
                label="Name"
                path="name"
                placeholder="Enter name"
                required
              />
            </n-gi>

            <n-gi>
              <FormInput
                v-model="newGeneral.tagline"
                label="Tagline"
                path="tagline"
                placeholder="Enter tagline"
                required
              />
            </n-gi>

            <n-gi>
              <FormInput
                v-model="newGeneral.email"
                label="Email"
                path="email"
                placeholder="Enter email"
                required
              />
            </n-gi>
          </n-grid>
        </n-card>

        <!-- CONTACT INFORMATION -->
        <n-card title="Contact Information" class="mb-4">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <FormInput
                v-model="newGeneral.phone"
                label="Phone"
                path="phone"
                placeholder="Enter phone"
                required
              />
            </n-gi>

            <n-gi>
              <n-form-item label="Address" path="address">
                <n-input
                  type="textarea"
                  v-model:value="newGeneral.address"
                  rows="3"
                  placeholder="Enter address"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </div>

      <div class="w-full lg:flex-1">
        <!-- LOGO UPLOADS -->
        <n-card title="Contact Information" class="mb-4">
          <n-grid :cols="1" :x-gap="24">
            <n-gi>
              <n-form-item :label="t('settings.general.form.whiteLogo')">
                <AvatarUpload
                  v-model="newGeneral.white_logo"
                  shape="square"
                  :size="80"
                  :maxSizeMB="3"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item :label="t('settings.general.form.darkLogo')">
                <AvatarUpload
                  v-model="newGeneral.dark_logo"
                  shape="square"
                  :size="80"
                  :maxSizeMB="3"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item :label="t('settings.general.form.favicon')">
                <AvatarUpload
                  v-model="newGeneral.favicon"
                  shape="square"
                  :size="80"
                  :maxSizeMB="3"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
        <n-divider />

        <!-- SUBMIT BUTTON -->
        <div style="text-align: right; margin-top: 16px">
          <n-button
            type="primary"
            size="large"
            :loading="props.isLoading"
            attr-type="submit"
          >
            Submit
          </n-button>
        </div>
      </div>
    </n-flex>
  </n-form>
</template>
