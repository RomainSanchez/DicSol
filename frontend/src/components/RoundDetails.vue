<script setup lang="ts">
import { computed } from 'vue'
import PotDisplay from './PotDisplay.vue'
import RoundStatus from './RoundStatus.vue'

interface Player {
  address: string
  exitedAt: number
}

interface Round {
  _id: string
  epoch: number
  winner: string | null
  players: Player[]
  pot: number
  ended: boolean
}

const props = defineProps<{
  round: Round
}>()

const activePlayers = computed(() => 
  props.round.players.filter(p => p.exitedAt === 0)
)
</script>

<template>
  <v-card class="round-details" elevation="0">
    <v-card-text>
      <v-row align="center" justify="center" class="pa-8">
        <v-col cols="12" md="6" class="text-center">
          <RoundStatus
            :ended="round.ended"
            :winner="round.winner"
            size="large"
          />
        </v-col>

        <v-col cols="12" md="6" class="text-center">
          <div class="pot-display">
            <div class="text-h2 font-weight-medium mb-3">
              <PotDisplay :amount="round.pot" size="large" />
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Current Pot Amount
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6 divider"></v-divider>

      <div class="text-center pa-6">
        <div class="text-subtitle-1 text-medium-emphasis mb-2">Active Players</div>
        <div class="text-h2 font-weight-medium players-count">
          {{ activePlayers.length }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.round-details {
  background: var(--gradient-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  height: 100%;
  backdrop-filter: blur(12px);
}

.pot-display {
  transform: translateY(0);
  transition: transform var(--transition-normal);
}

.pot-display:hover {
  transform: translateY(-4px);
}

.players-count {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.divider {
  opacity: 0.1;
}
</style>