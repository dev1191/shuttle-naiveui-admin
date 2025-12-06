<script setup lang="ts">
import { useRoute } from 'vue-router'
import BusScheduleForm from './components/BusScheduleForm.vue'

const route = useRoute()
const id = route.params.id as string
</script>

<template>
  <BusScheduleForm :id="id" />
</template>
