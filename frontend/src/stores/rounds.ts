import { defineStore } from 'pinia'
import axios from 'axios'

export const useRoundStore = defineStore('rounds', {
  state: () => ({
    rounds: [],
    currentRound: {}
  }),
  getters: {
    getRounds(state){
        return state.rounds
      }
  },
  actions: {
    async fetchRounds() {
      try {
        const response = await axios.get('https://api.dicsol.xyz/rounds')
          this.rounds = response.data
          this.currentRound = this.rounds[this.rounds.length - 1]
        }
        catch (error) {
          this.rounds = JSON.parse('[{"_id":"672f9c19184e57ca83162624","epoch":695,"winner":null,"players":[{"address":"UjMvzFNLRV2BmHFtPSM9c1WBsXHCVadvqAX8A7XMipJ","oldBalance":23.955007522,"balance":23.955007522,"enteredAt":40,"exitedAt":0,"score":60},{"address":"3wpiu9Zj9Fs35bwyMnRniEUt8ja7wWbasDsW7UPeg9c5","oldBalance":0.000497918,"balance":0.000497918,"enteredAt":40,"exitedAt":40,"score":0},{"address":"5BHpLTtv9VHWTkQLqdR87CydmxW3SYwm5YgpGtMJwoav","oldBalance":0.003554902,"balance":0.003554902,"enteredAt":40,"exitedAt":40,"score":0},{"address":"126MxB2xTdYZfzzZvGthdS2AcgnycwYCesLW5U9eEc8g","oldBalance":0.053275564,"balance":0.053275564,"enteredAt":40,"exitedAt":40,"score":0},{"address":"48QuH3GE2fZZcZaM4e4VvTXAc23jFdmwhxVGyoFAQhNJ","oldBalance":0.042714613,"balance":0.042714613,"enteredAt":40,"exitedAt":40,"score":0},{"address":"D6fNLYBabc1JdHLV6Aa9QLHrNnfcJ6HDpbFi9AeGn24S","oldBalance":0.189187048,"balance":0.189187048,"enteredAt":40,"exitedAt":40,"score":0},{"address":"GR12g7u7v6KFq5RrcPKjVupmwh26SGVbBRzrvJbtxWrS","oldBalance":706.773008574,"balance":706.773008574,"enteredAt":40,"exitedAt":0,"score":60},{"address":"E2eQEMyETVDSp4U8cJLWe9P8mJw8CdQKhWXjma96BcFF","oldBalance":0.01,"balance":0.01,"enteredAt":40,"exitedAt":40,"score":0},{"address":"4kQgbDptMXuwoxGj2m1SEcrX2fJZXVpn47aWKp9dDg2B","oldBalance":0.336907115,"balance":0.336907115,"enteredAt":40,"exitedAt":40,"score":0},{"address":"7sqkV85qKQaJL64tSjsM9eSW5y2y3oMf9CwP8CPVNEy7","oldBalance":3.298272286,"balance":3.298272286,"enteredAt":40,"exitedAt":0,"score":60}],"pot":0.626087193,"odds":10,"tx":null,"createdAt":"2024-11-09T17:30:01.509Z","updatedAt":"2024-11-10T22:00:00.356Z","ended":false}]')
          console.log(error)
          this.currentRound = this.rounds[this.rounds.length - 1]
      }
    }
  }
})
