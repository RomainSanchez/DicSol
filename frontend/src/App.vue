<script setup lang="ts">
import LotteryRounds from './components/LotteryRounds.vue'

declare global {
  interface Window { 
    Jupiter: any
  }
}
const jup = () => {
  window.Jupiter.init({
    endpoint: "https://old-nameless-bridge.solana-mainnet.quiknode.pro/6fdc470238c40c1c9c3754ed5035c71e0a9b0267",
    useUserSlippage: "true",
    formProps: {
      fixedOutputMint: true,
      initialInputMint: "So11111111111111111111111111111111111111112",
      initialOutputMint: "Dicscx2kpukGBATbjgsuzdbsVRFktV19BXEHofPQwEQF",
      // initialAmount: "1069000000",
    },
  });
}

const closeJup = () => {
  window.Jupiter.close();
}

</script>

<template>
  <v-app>
    <v-app-bar color="surface" elevation="2" @click="closeJup()">
      <v-container class="px-0">
        <v-row class="d-flex align-center">
          <v-col>
            <v-img
            src="/daoo-logo.png"
            alt="dicSOL Logo"
            max-width="64"
            class="me-3 logo-spin"
          ></v-img>
          </v-col>
          <v-col class="d-flex justify-center align-center">
              <span class="text-h4 font-weight-bold app-title">
                <span class="text-success">d</span><span class="text-warning">i</span><span class="text-error">c</span><span class="text-primary">S</span>OL
              </span>
              <span class="text-h4 font-weight-bold ms-2 d-none d-md-block">Lottery</span>
          </v-col>
          <v-col id="jup" class="d-flex align-center justify-end">
            <v-btn @click.stop="jup()" class="bg-yellow">Buy dicSOL</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <LotteryRounds />
    </v-main>
  </v-app>
</template>

<style>
#app {
  width: 100%;
}

.app-title {
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.logo-spin {
  transition: transform var(--transition-normal);
}

.logo-spin:hover {
  transform: rotate(360deg);
}

.v-container {
  max-width: 1440px;
}

@media (max-width: 600px) {
  #jupiter-terminal-instance div.fixed {
    margin-top : 66px;
  }

  #jup {
    justify-content: center !important;
  }
}
</style>