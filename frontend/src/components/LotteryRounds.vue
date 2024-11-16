<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchRounds } from '../api/rounds'
import type { Round } from '../types/lottery'
import RoundsTable from './RoundsTable.vue'
import ErrorBoundary from './ErrorBoundary.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const rounds = ref<Round[]>([])
const loading = ref(true)
const error = ref('')

const loadRounds = async () => {
  try {
    rounds.value = await fetchRounds()
  } catch (e: any) {
    error.value = e.message || 'Failed to load lottery rounds'
  } finally {
    loading.value = false
  }
}

onMounted(loadRounds)
</script>

<template>
  <ErrorBoundary>
    <v-container fluid class="fill-height pa-4">
      <transition name="fade" mode="out-in">
        <v-row v-if="loading" justify="center" align="center">
          <LoadingSpinner size="large" />
        </v-row>
        
        <v-row v-else-if="error" justify="center">
          <v-col cols="12">
            <v-alert
              type="error"
              variant="tonal"
              closable
              @click:close="error = ''"
            >
              {{ error }}
              <template v-slot:append>
                <v-btn
                  color="error"
                  variant="tonal"
                  @click="loadRounds"
                >
                  Retry
                </v-btn>
              </template>
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <RoundsTable :rounds="rounds" />
          </v-col>
        </v-row>
      </transition>
    </v-container>
  </ErrorBoundary>
</template>