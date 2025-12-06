

<script setup lang="ts">
import { useRoute } from 'vue-router'
import RouteForm from './components/RouteForm.vue'

const route = useRoute()
</script>

<template>
  <div class="page-container">
    <RouteForm :id="route.params.id as string" />
  </div>
</template>

<style scoped>
.page-container {
  padding: 10px;
}
</style>