<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue'
import type { Round, SortBy } from '@/types/lottery'
import PotDisplay from './PotDisplay.vue'
import RoundStatus from './RoundStatus.vue'
import JackpotDisplay from './JackpotDisplay.vue'
import TableSearch from './table/TableSearch.vue'
import TablePlayerList from './table/TablePlayerList.vue'
import TableTransactionInfo from './table/TableTransactionInfo.vue'

const props = withDefaults(defineProps<{
  rounds: Round[]
  itemsPerPage?: number
}>(), {
  itemsPerPage: 10
})

const search = ref('')
const sortBy = ref<SortBy[]>([{ key: 'epoch', order: 'desc' }])
const expandedRound = ref<string | null>(null)
const error = ref<string | null>(null)

const currentJackpot = computed(() => {
  try {
    const latestRound = [...props.rounds]
      .sort((a, b) => b.epoch - a.epoch)[0]
    return latestRound?.pot || 0
  } catch (err) {
    console.error('Error calculating jackpot:', err)
    return 0
  }
})

const filteredRounds = computed(() => {
  if (!search.value) return props.rounds
  
  const searchTerm = search.value.toLowerCase()
  return props.rounds.filter(round => 
    round.epoch.toString().includes(searchTerm) ||
    round.pot.toString().includes(searchTerm) ||
    (round.winner?.toLowerCase().includes(searchTerm))
  )
})

const getActivePlayers = (round: Round): number => 
  round.players.filter(p => p.exitedAt === 0).length

const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return 'Invalid Date'
  }
}

const toggleExpand = (roundId: string) => {
  expandedRound.value = expandedRound.value === roundId ? null : roundId
}

const handleSearch = (value: string) => {
  search.value = value
}

onErrorCaptured((err) => {
  console.error('Error in RoundsTable:', err)
  error.value = 'An error occurred while displaying the rounds.'
  return false
})
</script>

<template>
  <div class="rounds-table">
    <div class="d-flex flex-column align-center">
      <!-- Error Display -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4 w-100"
        closable
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>

      <!-- Jackpot Display -->
      <JackpotDisplay :amount="currentJackpot" class="mb-8" />

      <!-- Search Bar -->
      <TableSearch
        class="mb-6"
        placeholder="Search rounds..."
        @search="handleSearch"
      />

      <!-- Table -->
      <v-card
        class="table-card"
        elevation="0"
        width="100%"
      >
        <v-data-table
          :headers="[
            { title: 'Epoch', key: 'epoch', align: 'center' },
            { title: 'Status', key: 'status', align: 'center' },
            { title: 'Pot', key: 'pot', align: 'center' },
            { title: 'Players', key: 'players', align: 'center' },
            { title: 'Ended', key: 'endedAt', align: 'center' }
          ]"
          :items="filteredRounds"
          :sort-by="sortBy"
          :items-per-page="itemsPerPage"
          
          class="table-content"
          @update:sort-by="sortBy = $event"
        >
          <template v-slot:item="{ item }">
            <tr 
              @click="toggleExpand(item._id)"
              :class="['main-row', { 'expanded': expandedRound === item._id }]"
            >
              <td>
                <div class="d-flex align-center justify-center">
                  <v-icon
                    :icon="expandedRound === item._id ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    size="20"
                    class="me-2 expand-icon"
                  ></v-icon>
                  <span class="text-h6 font-weight-medium text-primary">{{ item.epoch }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex justify-center">
                  <RoundStatus
                    :ended="item.ended"
                    :winner="item.winner"
                    size="small"
                  />
                </div>
              </td>
              <td>
                <div class="d-flex justify-center">
                  <PotDisplay :amount="item.pot" size="small" />
                </div>
              </td>
              <td>
                <div class="d-flex justify-center">
                  <span class="text-h6 font-weight-medium">{{ getActivePlayers(item) }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex justify-center">
                  <span class="text-medium-emphasis">{{ formatDate(item.createdAt) }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="expandedRound === item._id" class="details-row">
              <td colspan="5">
                <div class="details-content">
                  <div class="px-4 py-6">
                    <!-- Transaction Info -->
                    <TableTransactionInfo
                      v-if="item.winner && item.tx"
                      :tx="item.tx"
                      class="mb-4"
                    />

                    <div class="text-subtitle-1 font-weight-medium mb-4 text-center">Players</div>
                    <TablePlayerList
                      :players="item.players.filter(p => p.exitedAt === 0)"
                      :winner="item.winner"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <template v-slot:no-data>
            <div class="d-flex flex-column align-center py-12">
              <v-icon
                icon="mdi-alert-circle-outline"
                size="40"
                color="text-medium-emphasis"
                class="mb-4"
              ></v-icon>
              <span class="text-medium-emphasis">No rounds found</span>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.rounds-table {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.table-card {
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--error);
  overflow: hidden;
  width: 100%;
}

.table-content {
  background: transparent;
  overflow-x: auto;
}

:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-data-table-header) {
  background: transparent;
}

:deep(.v-data-table-header th) {
  color: var(--text-secondary) !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  text-transform: none;
  padding: 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02);
  white-space: nowrap;
}

.main-row {
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.main-row:hover {
  background: rgba(255, 255, 255, 0.03) !important;
}

.main-row.expanded {
  background: rgba(var(--primary-rgb), 0.05) !important;
}

.expand-icon {
  transition: transform var(--transition-fast);
}

.expanded .expand-icon {
  transform: rotate(90deg);
}

.details-row {
  background: rgba(var(--primary-rgb), 0.02);
}

.details-content {
  animation: slideDown var(--transition-normal);
}

:deep(.v-data-table__tr) {
  transition: background-color var(--transition-fast);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

:deep(.v-data-table__td) {
  padding: 16px !important;
  height: 72px !important;
  white-space: nowrap;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .rounds-table {
    padding: 0 0.5rem;
  }
}
</style>