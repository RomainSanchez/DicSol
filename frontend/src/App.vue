<script setup lang="ts">
import LotteryRounds from './components/LotteryRounds.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="surface" elevation="2">
      <v-container class="px-0">
        <div class="d-flex justify-center align-center w-100">
          <v-img
            src="/daoo-logo.png"
            alt="dicSOL Logo"
            max-width="64"
            class="me-3 logo-spin"
          ></v-img>
          <span class="text-h3 font-weight-bold app-title">
            <span class="text-success">d</span><span class="text-warning">i</span><span class="text-error">c</span><span class="text-primary">S</span>OL
          </span>
          <span class="text-h3 font-weight-bold ms-2">Lottery</span>
        </div>
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

.v-toolbar__content {
  height: 80px !important;
}
</style>