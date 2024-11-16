<script setup lang="ts">
defineProps<{
  size?: 'small' | 'medium' | 'large'
  color?: string
}>()
</script>

<template>
  <div class="loading-container" role="alert" aria-busy="true">
    <v-progress-circular
      indeterminate
      :size="size === 'large' ? 64 : size === 'small' ? 24 : 40"
      :width="size === 'large' ? 6 : size === 'small' ? 2 : 4"
      :color="color ?? 'primary'"
    ></v-progress-circular>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
</style>