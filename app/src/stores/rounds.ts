import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useRoundStore = defineStore('rounds', {
  state: () => ({
    rounds: []
  }),
  getters: {
    getRounds(state){
        return state.rounds
      }
  },
  actions: {
    async fetchRounds() {
      try {
        const response = await axios.get('http://localhost:4000/rounds')
          this.rounds = response.data
        }
        catch (error) {
          console.log(error)
      }
    }
  }
})
