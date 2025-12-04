```html
<script setup lang="ts">
import { h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, NDropdown, NAvatar, NText } from 'naive-ui'
import { useAuthStore } from '@/stores'
import type { DropdownProps } from 'naive-ui'
import defaultAvatar from '@/assets/images/avatar/default.png'

interface UserDropdownProps extends /** @vue-ignore */ DropdownProps {
  collapsed?: boolean
}

const props = defineProps<UserDropdownProps>()

defineOptions({
  inheritAttrs: false,
})

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userName = computed(() => `${user.value?.firstname} ${user.value?.lastname}`|| 'User')
const userRole = computed(() => user.value?.role || 'Guest')
const userAvatar = computed(() => user.value?.picture || '')


const userDropdownOptions = [
  {
    icon: () => h('span', { class: 'iconify ph--user size-5' }),
    key: 'user',
    label: 'Profile',
  },
  {
    icon: () => h('span', { class: 'iconify ph--sign-out size-5' }),
    key: 'signOut',
    label: 'Sign Out',
  },
]

const onUserDropdownSelected = (key: string) => {
  switch (key) {
    case 'user':
      message.info('Profile clicked')
      break
    case 'signOut':
      authStore.clearAuth()
      router.push({ name: 'signIn' })
      break
  }
}
</script>

<template>
  <NDropdown
    trigger="click"
    :options="userDropdownOptions"
    show-arrow
    @select="onUserDropdownSelected"
    v-bind="$attrs"
  >
    <div 
      class="flex items-center gap-3 cursor-pointer p-2 mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      :class="{ 'justify-center': props.collapsed }"
    >
      <NAvatar
        round
        size="small"
        class="shrink-0"
        :src="userAvatar"
        fallback-src="defaultAvatar"

      />
        
      
      <div v-if="!props.collapsed" class="flex flex-col min-w-0 overflow-hidden">
        <NText depth="1" strong class="truncate text-sm leading-tight">
          {{ userName }}
        </NText>
        <NText depth="3" class="truncate text-xs">
          {{ userRole }}
        </NText>
      </div>
    </div>
  </NDropdown>
</template>
```