<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import Icon from './Icon.vue'

interface Props {
  debounceTime?: number
}

const props = withDefaults(defineProps<Props>(), { debounceTime: 500 })
const model = defineModel<string>()
const emits = defineEmits(['search'])

const focused = ref(false)
let searchTimerId: any = null

function searchInListDebounced(value: string) {
  model.value = value
  clearTimeout(searchTimerId)
  searchTimerId = setTimeout(() => {
    emits('search')
  }, props.debounceTime)
}
</script>

<template>
    <n-input  v-model="model" placeholder="search" autosize clearable
        class="w-50 transition-property-all transition-ease-in transition-duration-200" :class="{ 'md:w-60': focused }"
        @input="searchInListDebounced" @focus="focused = true" @blur="focused = false">
        <template #prefix>
            <Icon name="Search" />
        </template>
    </n-input>
</template>

