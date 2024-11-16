<script setup lang="ts">
defineProps<{
  ended: boolean
  winner: string | null
  size?: 'small' | 'large'
}>()

const getStatusIcon = (ended: boolean, winner: string | null): string => {
  if (!ended) return 'mdi-timer'
  return winner ? 'mdi-trophy-variant' : 'mdi-close-circle'
}

const getStatusColor = (ended: boolean, winner: string | null): string => {
  if (ended) {
    return winner ? 'var(--success)' : 'var(--error)'
  }
  return 'var(--warning)'
}

const getStatusText = (ended: boolean, winner: string | null): string => {
  if (!ended) return 'Round in Progress'
  return winner ? 'Winner Declared!' : 'Round Ended - No Winner'
}
</script>

<template>
  <div class="d-flex align-center" :class="{ 'flex-column': size === 'large' }">
    <v-icon
      :icon="getStatusIcon(ended, winner)"
      :color="getStatusColor(ended, winner)"
      :size="size === 'large' ? 64 : 24"
      class="status-icon"
      :class="{ 'mb-4': size === 'large' }"
    ></v-icon>
    <span 
      v-if="size === 'large'" 
      class="text-h6 font-weight-medium"
      :style="{ color: getStatusColor(ended, winner) }"
    >
      {{ getStatusText(ended, winner) }}
    </span>
  </div>
</template>

<style scoped>
.status-icon {
  transition: transform var(--transition-normal);
}

.status-icon:hover {
  transform: scale(1.1);
}
</style>