<template>
  <div class="page-container">
    <StopForm :id="route.params.id as string" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import StopForm from './components/StopForm.vue'

const route = useRoute()
</script>

<style scoped>
.page-container {
  padding: 10px;
}
</style>