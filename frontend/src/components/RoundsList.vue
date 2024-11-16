<script setup lang="ts">
import { computed } from 'vue'
import PotDisplay from './PotDisplay.vue'
import RoundStatus from './RoundStatus.vue'

interface Round {
  _id: string
  epoch: number
  winner: string | null
  pot: number
  ended: boolean
}

const props = defineProps<{
  rounds: Round[]
  selectedRound: string | null
}>()

const emit = defineEmits<{
  (e: 'select', roundId: string): void
}>()
</script>

<template>
  <v-card class="rounds-list" elevation="0">
    <v-card-title class="py-6 text-center">
      <span class="text-h6 font-weight-medium text-primary">Lottery Rounds</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-list class="py-2 px-2">
      <transition-group name="slide-up">
        <v-list-item
          v-for="round in rounds"
          :key="round._id"
          :value="round._id"
          :active="selectedRound === round._id"
          @click="emit('select', round._id)"
          class="mb-2 rounded-lg list-item"
          :ripple="false"
        >
          <template v-slot:prepend>
            <RoundStatus
              :ended="round.ended"
              :winner="round.winner"
              size="small"
            />
          </template>
          <v-list-item-title class="font-weight-medium mb-1">
            Round {{ round.epoch }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <PotDisplay :amount="round.pot" size="small" />
          </v-list-item-subtitle>
        </v-list-item>
      </transition-group>
    </v-list>
  </v-card>
</template>

<style scoped>
.rounds-list {
  background: var(--gradient-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  height: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 96px);
  backdrop-filter: blur(12px);
}

.list-item {
  transition: all var(--transition-normal);
  background: rgba(255, 255, 255, 0.03);
  margin-inline: 0.5rem;
}

.list-item:hover:not(.v-list-item--active) {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(4px);
}

.v-list-item--active {
  background: rgba(59, 130, 246, 0.15) !important;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

:deep(.v-list) {
  background: transparent !important;
}
</style>