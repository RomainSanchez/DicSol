<script setup lang="ts">
defineProps<{
  amount: number
  size?: 'small' | 'large'
}>()

const formatAmount = (amount: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<template>
  <span class="d-inline-flex align-center">
    {{ formatAmount(amount) }}
    <v-img
      src="/daoo-logo.png"
      :width="size === 'small' ? 16 : 32"
      :height="size === 'small' ? 16 : 32"
      class="ms-2 currency-logo"
      alt="DAOO"
    />
  </span>
</template>

<style scoped>
.currency-logo {
  display: inline-block;
  transition: transform var(--transition-normal);
}

.currency-logo:hover {
  transform: rotate(15deg) scale(1.1);
}
</style>