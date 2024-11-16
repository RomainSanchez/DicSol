<script setup lang="ts">
defineProps<{
  tx: string
}>()

const getSolscanUrl = (tx: string): string => {
  return `https://solscan.io/tx/${tx}`
}
</script>

<template>
  <div class="transaction-info">
    <div class="text-subtitle-1 font-weight-medium mb-2 text-center">
      Transaction
    </div>
    <div class="d-flex justify-center">
      <a
        :href="getSolscanUrl(tx)"
        target="_blank"
        rel="noopener noreferrer"
        class="transaction-link"
        @click.stop
      >
        <v-icon icon="mdi-link-variant" size="16" class="me-2" />
        View on Solscan
      </a>
    </div>
  </div>
</template>

<style scoped>
.transaction-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.transaction-link:hover {
  color: var(--primary-light);
  background: rgba(255, 255, 255, 0.06);
}
</style>