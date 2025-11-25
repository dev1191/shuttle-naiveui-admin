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

const configProviderProps = getConfigProviderProps();
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
