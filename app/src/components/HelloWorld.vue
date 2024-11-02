<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, computed } from "vue";
import { useRoundStore } from "../stores/rounds";
const store = useRoundStore();
const msg = ref("Welcome to my Vuex Store");

const rounds = computed(() => {
  return store.rounds;
});

onMounted(() => {
  store.fetchRounds();
});
</script>

<template>
  <div class="greetings">
    <li v-for="round in rounds">
  {{ round }}
</li>
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      What's next?
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
