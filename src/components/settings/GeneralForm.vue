<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dateFormatOptions from "@/constants/dateFormat";
import timeFormatOptions from "@/constants/timeFormat";
import timezones from "timezones-list";
import { countriesApi } from "@/services/country.service";
import { currenciesApi } from "@/services/currency.service";
import { languagesApi } from "@/services/language.service";
import { settingsApi } from "@/services/setting.service";
import {
  NForm,
  NFlex,
  NCard,
  NGrid,
  NGi,
  NFormItem,
  NInput,
  NButton,
  NDivider,
  NTabs,
  NTabPane,
  NSelect,
  NInputNumber,
  useMessage,
  type SelectOption,
  type FormInst
} from "naive-ui";
import { useAuthStore } from "@/stores/auth";

const { t } = useI18n();

interface Props {
  item: any;
  isLoading: boolean;
}
const props = defineProps<Props>();

const message = useMessage();
const formRef = ref<FormInst | null>(null);
const isSubmitting = ref(false);

const formData = reactive({
  // General Tab
  name: "",
  tagline: "",
  white_logo: null,
  dark_logo: null,
  favicon: null,
  email: "",
  phone: "",
  address: "",

  // App Settings Tab
  timezone: "",
  default_country: "",
  default_currency: "",
  default_language: "",
  date_format: "",
  time_format: "",
  google_key: "",
  fee: "",
  tax: "",
  api_base_url: "",
  background_location_update_interval: 0,
  driver_online_location_update_interval: 0,
  max_distance: 0,
  prebooking_time: 0,
});

// Transform timezones list for n-select
const timezoneOptions = computed(() => {
  return timezones.default.map((tz) => ({
    label: tz.label,
    value: tz.tzCode,
  }));
});

const { setGeneralSetting } = useAuthStore()
const searchCountry = ref("");
const countryOptions = ref<SelectOption[]>([]);

const searchCurrency = ref("");
const currencyOptions = ref<SelectOption[]>([]);

const searchLanguage = ref("");
const languageOptions = ref<SelectOption[]>([]);

watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(formData, val);
  },
  { immediate: true }
);

const fetchCountries = async () => {
  try {
    const result = await countriesApi.countryLists(searchCountry.value);
    countryOptions.value = result.items.map((item)=>({
      label: item.label,
      value: item.value,
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const handleCountrySearch = (query: string) => {
  searchCountry.value = query;
  fetchCountries();
};

const fetchCurrencies = async () => {
  try {
    const result = await currenciesApi.currencyLists(searchCurrency.value);
    currencyOptions.value = result.items.map((item)=>({
      label: item.label,
      value: item.value,
    }));
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
};

const handleCurrencySearch = (query: string) => {
  searchCurrency.value = query;
  fetchCurrencies();
};

const fetchLanguages = async () => {
  try {
    const result = await languagesApi.languageLists(searchLanguage.value);
    languageOptions.value = result.items.map((item)=>({
      label: item.label,
      value: item.value,
    }));
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

const handleLanguageSearch = (query: string) => {
  searchLanguage.value = query;
  fetchLanguages();
};

const onSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    isSubmitting.value = true;

    // axios.toFormData will automatically handle the conversion
    // including files, nested objects, and all field types
   const result =  await settingsApi.update("general", formData);

    message.success("General settings saved successfully");
    setGeneralSetting(result.data)
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.length) {
      // Validation errors
      message.error("Please fill in all required fields");
    } else {
      message.error("Failed to save general settings");
    }
    console.error("Submit error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchCountries();
  fetchCurrencies();
  fetchLanguages();
});
</script>

<template>
  <n-form ref="formRef" :model="formData" @submit.prevent="onSave" label-placement="top">
    <n-tabs type="segment" animated>
      <!-- GENERAL TAB -->
      <n-tab-pane name="general" tab="General">
        <n-flex>
          <div class="w-full lg:w-3/4">
            <!-- GENERAL DETAILS -->
            <n-card title="General Settings" class="mb-4">
              <n-grid :cols="2" :x-gap="24">
                <n-gi>
                  <FormInput
                    v-model="formData.name"
                    label="Name"
                    path="name"
                    placeholder="Enter name"
                    required
                  />
                </n-gi>

                <n-gi>
                  <FormInput
                    v-model="formData.tagline"
                    label="Tagline"
                    path="tagline"
                    placeholder="Enter tagline"
                    required
                  />
                </n-gi>

                <n-gi>
                  <FormInput
                    v-model="formData.email"
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
                    v-model="formData.phone"
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
                      size="large"
                      v-model:value="formData.address"
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
            <n-card title="Branding" class="mb-4">
              <n-grid :cols="1" :x-gap="24">
                <n-gi>
                  <n-form-item :label="t('settings.general.form.whiteLogo')">
                    <AvatarUpload
                      v-model="formData.white_logo"
                      shape="square"
                      :size="80"
                      :maxSizeMB="3"
                    />
                  </n-form-item>
                </n-gi>

                <n-gi>
                  <n-form-item :label="t('settings.general.form.darkLogo')">
                    <AvatarUpload
                      v-model="formData.dark_logo"
                      shape="square"
                      :size="80"
                      :maxSizeMB="3"
                    />
                  </n-form-item>
                </n-gi>

                <n-gi>
                  <n-form-item :label="t('settings.general.form.favicon')">
                    <AvatarUpload
                      v-model="formData.favicon"
                      shape="square"
                      :size="80"
                      :maxSizeMB="3"
                    />
                  </n-form-item>
                </n-gi>
              </n-grid>
            </n-card>
          </div>
        </n-flex>
      </n-tab-pane>

      <!-- APP SETTINGS TAB -->
      <n-tab-pane name="app-settings" tab="App Settings">
        <n-card title="Regional Settings" class="mb-4">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <n-form-item label="Timezone" path="timezone">
                <n-select
                  size="large"
                  v-model:value="formData.timezone"
                  :options="timezoneOptions"
                  filterable
                  placeholder="Search and select timezone"
                  clearable
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Default Country" path="country">
                <n-select
                  size="large"
                  v-model:value="formData.default_country"
                  :options="countryOptions"
                  placeholder="Search and select country"
                  filterable
                  remote
                  clearable
                  @search="handleCountrySearch"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Default Currency" path="default_currency">
                <n-select
                  size="large"
                  v-model:value="formData.default_currency"
                  :options="currencyOptions"
                  placeholder="Search and select currency"
                  filterable
                  remote
                  clearable
                  @search="handleCurrencySearch"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Default Language" path="default_language">
                <n-select
                  size="large"
                  v-model:value="formData.default_language"
                  :options="languageOptions"
                  placeholder="Search and select language"
                  filterable
                  remote
                  clearable
                  @search="handleLanguageSearch"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Date Format" path="date_format">
                <n-select
                  size="large"
                  v-model:value="formData.date_format"
                  :options="dateFormatOptions"
                  placeholder="Select date format"
                  @update:value="
                    (val) => {
                      formData.date_format = val;
                    }
                  "
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Time Format" path="time_format">
                <n-select
                  size="large"
                  v-model:value="formData.time_format"
                  :options="timeFormatOptions"
                  placeholder="Select time format"
                  @update:value="
                    (val) => {
                      formData.time_format = val;
                    }
                  "
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>

        <n-card title="API & Integration" class="mb-4">
          <n-grid :cols="2" :x-gap="24">
            <n-gi :span="2">
              <FormInput
                v-model="formData.google_key"
                label="Google API Key"
                path="google_key"
                placeholder="Enter Google API key"
              />
            </n-gi>

            <n-gi :span="2">
              <FormInput
                v-model="formData.api_base_url"
                label="API Base URL"
                path="api_base_url"
                placeholder="https://api.example.com"
              />
            </n-gi>
          </n-grid>
        </n-card>

        <n-card title="Pricing & Fees" class="mb-4">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <FormInput
                v-model="formData.fee"
                label="Service Fee (%)"
                path="fee"
                placeholder="Enter service fee"
                type="number"
              />
            </n-gi>

            <n-gi>
              <FormInput
                v-model="formData.tax"
                label="Tax (%)"
                path="tax"
                placeholder="Enter tax percentage"
                type="number"
              />
            </n-gi>
          </n-grid>
        </n-card>

        <n-card title="Location & Booking Settings" class="mb-4">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <n-form-item
                label="Background Location Update Interval (seconds)"
                path="background_location_update_interval"
              >
                <n-input-number
                  size="large"
                  v-model:value="formData.background_location_update_interval"
                  :min="0"
                  :step="1"
                  placeholder="Enter interval"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item
                label="Driver Online Location Update Interval (seconds)"
                path="driver_online_location_update_interval"
              >
                <n-input-number
                  size="large"
                  v-model:value="
                    formData.driver_online_location_update_interval
                  "
                  :min="0"
                  :step="1"
                  placeholder="Enter interval"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Max Distance (km)" path="max_distance">
                <n-input-number
                  size="large"
                  v-model:value="formData.max_distance"
                  :min="0"
                  :step="1"
                  placeholder="Enter max distance"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item
                label="Pre-booking Time (minutes)"
                path="prebooking_time"
              >
                <n-input-number
                  size="large"
                  v-model:value="formData.prebooking_time"
                  :min="0"
                  :step="1"
                  placeholder="Enter pre-booking time"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </n-tab-pane>
    </n-tabs>

    <n-divider />

    <!-- SUBMIT BUTTON -->
    <div style="text-align: right; margin-top: 16px">
      <n-button
        type="primary"
        size="large"
        :loading="isSubmitting"
        attr-type="submit"
      >
        Submit
      </n-button>
    </div>
  </n-form>
</template>
