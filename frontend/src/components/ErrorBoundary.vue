<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err: Error) => {
  error.value = err
  return false
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <v-alert
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = null"
    >
      <template v-slot:title>
        Something went wrong
      </template>
      <p>We're sorry, but there was an error loading this content.</p>
    </v-alert>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.error-boundary {
  padding: 1rem;
  text-align: center;
}
</style>