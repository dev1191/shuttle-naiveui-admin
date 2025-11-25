<script setup lang="ts">
import { useLoadingBar, useDialog, useMessage, useNotification, useModal } from 'naive-ui'
import { setupDiscreteApi } from '@/composables'

const loadingBar = useLoadingBar()
const dialog = useDialog()
const message = useMessage()
const notification = useNotification()
const modal = useModal()

setupDiscreteApi({
  loadingBar,
  dialog,
  message,
  notification,
  modal
})
</script>

<template>
  <slot />
</template>
