<script setup lang="ts">
import {
  NConfigProvider,
  NModalProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider,
  NGlobalStyle,
} from "naive-ui";
import { getConfigProviderProps } from "@/composables";
import DiscreteApi from "./DiscreteApi.vue";
import SettingsDrawer from "./SettingsDrawer.vue";
import { useThemeStore } from "@/stores/theme";
import { loadLanguageAsync } from "@/plugins/i18n";
import { watch } from "vue";

const configProviderProps = getConfigProviderProps();
const themeStore = useThemeStore();

watch(
  () => themeStore.language,
  (lang) => {
    loadLanguageAsync(lang);
  }
);
</script>

<template>
  <NConfigProvider v-bind="configProviderProps">
    <NGlobalStyle />
    <NLoadingBarProvider>
      <NModalProvider>
        <NNotificationProvider placement="bottom-right">
          <NMessageProvider>
            <NDialogProvider>
              <DiscreteApi />
              <SettingsDrawer />
              <slot />
            </NDialogProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
