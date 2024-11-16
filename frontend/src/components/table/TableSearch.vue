<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

const searchInput = ref('')
const debounceTimeout = ref<number | null>(null)

watch(searchInput, (newValue) => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  
  debounceTimeout.value = setTimeout(() => {
    emit('search', newValue)
  }, 300) as unknown as number
})
</script>

<template>
  <v-text-field
    v-model="searchInput"
    :placeholder="placeholder ?? 'Search...'"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    hide-details
    class="search-field"
    bg-color="var(--surface)"
    color="warning"
    base-color="warning"
  ></v-text-field>
</template>

<style scoped>
.search-field {
  width: 100%;
  max-width: 300px;
}

.search-field :deep(.v-field) {
  border-radius: 8px !important;
  background: var(--surface) !important;
}
</style>