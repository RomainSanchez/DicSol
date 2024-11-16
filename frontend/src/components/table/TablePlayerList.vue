<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../../types/lottery'

const props = defineProps<{
  players: Player[]
  winner: string | null
}>()

const formatAddress = (address: string): string => {
  if (address.length <= 24) return address
  return `${address.slice(0, 12)}...${address.slice(-8)}`
}

const getSolscanUrl = (address: string): string => {
  return `https://solscan.io/account/${address}`
}

const getSortedPlayers = computed(() => {
  return [...props.players].sort((a, b) => {
    if (props.winner) {
      if (a.address === props.winner) return -1
      if (b.address === props.winner) return 1
    }
    return b.score - a.score
  })
})
</script>

<template>
  <div class="player-list">
    <v-list density="compact" class="player-list-container">
      <v-list-item
        v-for="player in getSortedPlayers"
        :key="player.address"
        class="player-item mb-2"
        :class="{ 'winner': player.address === winner }"
      >
        <template v-slot:prepend>
          <v-avatar
            :color="player.address === winner ? 'success' : 'primary'"
            variant="tonal"
            size="32"
            class="mr-3"
          >
            <v-icon size="16">
              {{ player.address === winner ? 'mdi-trophy-variant' : 'mdi-account' }}
            </v-icon>
          </v-avatar>
        </template>
        
        <v-list-item-title class="d-flex justify-center">
          <a
            :href="getSolscanUrl(player.address)"
            target="_blank"
            rel="noopener noreferrer"
            class="address-link"
            :class="{ 'winner-text': player.address === winner }"
            @click.stop
          >
            <span class="address">{{ formatAddress(player.address) }}</span>
            <v-icon
              icon="mdi-open-in-new"
              size="14"
              class="ms-1 external-link-icon"
            ></v-icon>
          </a>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.player-list {
  max-height: 400px;
  overflow-y: auto;
}

.player-list-container {
  background: transparent !important;
  border-radius: 8px;
  padding: 0.5rem;
}

.player-item {
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
}

.player-item.winner {
  background: rgba(137, 209, 133, 0.1);
  border: 1px solid rgba(137, 209, 133, 0.2);
}

.address {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.address-link {
  color: var(--primary);
  text-decoration: none;
  transition: color var(--transition-fast);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  width: 100%;
  justify-content: center;
}

.address-link.winner-text {
  color: var(--success);
}

.address-link:hover {
  color: var(--primary-light);
}

.address-link.winner-text:hover {
  color: var(--success);
  opacity: 0.9;
}

.external-link-icon {
  opacity: 0.7;
  transition: opacity var(--transition-normal);
}

.address-link:hover .external-link-icon {
  opacity: 1;
}
</style>