<script lang="ts" setup>
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { NMenu, NLayout, NLayoutSider, NLayoutContent } from 'naive-ui';
import { RouterLink, useRoute } from 'vue-router';
import { Settings as SettingsIcon, Globe as GlobeIcon, Banknote as CurrencyIcon, Languages as LanguageIcon } from 'lucide-vue-next';
import Heading from '@/components/common/Heading.vue';
import { useRender } from '@/composables/useRender';

const { t } = useI18n();
const { renderIcon } = useRender();
const route = useRoute();

const props = defineProps<{ title: string; description?: string }>();

const menuOptions = [
  {
    label: () => h(RouterLink, { to: { name: 'siteSettings' } }, { default: () => t('settings.general.title') }),
    key: 'siteSettings',
    icon: renderIcon(SettingsIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'countries' } }, { default: () => t('settings.countries.title') }),
    key: 'countries',
    icon: renderIcon(GlobeIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'currencies' } }, { default: () => t('settings.currencies.title') }),
    key: 'currencies',
    icon: renderIcon(CurrencyIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'languages' } }, { default: () => t('settings.languages.title') }),
    key: 'languages',
    icon: renderIcon(LanguageIcon)
  }
];

const activeKey = ref<string | null>(route.name as string);
</script>

<template>
  <div class="px-1">

    <NLayout has-sider class="mt-4 bg-transparent">
      <NLayoutSider
        bordered
        width="255"
        content-style="padding-right: 20px;"
        class="bg-transparent"
      >
        <NMenu
          :options="menuOptions"
          :value="activeKey"
          @update:value="(k) => activeKey = k"
        />
      </NLayoutSider>

      <NLayoutContent class="bg-transparent pl-4">
        <slot />
      </NLayoutContent>
    </NLayout>
  </div>
</template>
