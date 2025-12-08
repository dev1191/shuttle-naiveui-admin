<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { NMenu, NLayout, NLayoutSider, NLayoutContent } from 'naive-ui';
import { RouterLink, useRoute } from 'vue-router';
import { 
  Settings as SettingsIcon, 
  Globe as GlobeIcon, Banknote as CurrencyIcon, 
  Languages as LanguageIcon ,
  MailIcon as MailIcon,
  Warehouse as StorageIcon,
  Share as ShareIcon,
  TicketSlash as RefundIcon,
  Megaphone as NotificationIcon,
  Layers as PageIcon,
  HandHeart as SocialIcon
} from 'lucide-vue-next';

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
  },
    {
    label: () => h(RouterLink, { to: { name: 'emailSettings' } }, { default: () => t('settings.email.title') }),
    key: 'email',
    icon: renderIcon(MailIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'notificationSettings' } }, { default: () => t('settings.notification.title') }),
    key: 'notification',
    icon: renderIcon(NotificationIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'refundSettings' } }, { default: () => t('settings.refund.title') }),
    key: 'refund',
    icon: renderIcon(RefundIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'referralSettings' } }, { default: () => t('settings.referral.title') }),
    key: 'referral',
    icon: renderIcon(ShareIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'storageSettings' } }, { default: () => t('settings.storage.title') }),
    key: 'storage',
    icon: renderIcon(StorageIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'pages' } }, { default: () => t('settings.pages.title') }),
    key: 'pages',
    icon: renderIcon(PageIcon)
  },
  {
    label: () => h(RouterLink, { to: { name: 'socialLinks' } }, { default: () => t('settings.socialLinks.title') }),
    key: 'socialLinks',
    icon: renderIcon(SocialIcon)
  },
];

const activeKey = ref<string | null>(route.name as string);
</script>

<template>
  <div class="">

    <NLayout has-sider class="">
      <NLayoutSider
        bordered
        width="255"
        content-style="padding-right: 20px;"
      >
        <NMenu
          :options="menuOptions"
          :value="activeKey"
          @update:value="(k) => activeKey = k"
        />
      </NLayoutSider>

      <NLayoutContent class="py-4 px-4">
        <Heading :title="props.title" :description="props.description" />
        <div class="py-6">
            <slot />
          </div>
      
      </NLayoutContent>
    </NLayout>
  </div>
</template>
