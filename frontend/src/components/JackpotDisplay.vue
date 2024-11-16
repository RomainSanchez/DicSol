<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  amount: number
}>()

const displayAmount = ref('0.00')
const isAnimating = ref(false)

const animateToNumber = async (target: number) => {
  isAnimating.value = true
  const duration = 2000
  const steps = 30
  const stepDuration = duration / steps
  
  const start = parseFloat(displayAmount.value)
  const diff = target - start
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps
    // Easing function for bounce effect
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = start + (diff * eased)
    
    displayAmount.value = current.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    
    await new Promise(resolve => setTimeout(resolve, stepDuration))
  }
  
  // Ensure final value is exact
  displayAmount.value = target.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  isAnimating.value = false
}

watch(() => props.amount, (newVal) => {
  if (!isAnimating.value) {
    animateToNumber(newVal)
  }
})

onMounted(() => {
  animateToNumber(props.amount)
})
</script>

<template>
  <div class="jackpot-container">
    <div class="jackpot-inner">
      <h2 class="text-h5 font-weight-bold text-center mb-4">Jackpot</h2>
      <div class="slot-display">
        <div class="slot-frame">
          <div class="slot-number" :class="{ 'animating': isAnimating }">
            {{ displayAmount }}
            <img src="/daoo-logo.png" alt="DAOO" class="currency-icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jackpot-container {
  background: var(--surface-dark);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  border: 2px solid var(--success);
  box-shadow: 
    0 0 20px rgba(137, 209, 133, 0.2),
    inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.jackpot-inner {
  background: var(--gradient-surface);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slot-display {
  background: var(--surface-dark);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slot-frame {
  background: linear-gradient(to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05) 50%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0.1)
  );
  border-radius: 6px;
  padding: 0.75rem;
  position: relative;
  overflow: hidden;
}

.slot-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
}

.slot-number {
  font-family: 'Digital-7', monospace;
  font-size: 2.5rem;
  font-weight: bold;
  color: #89d185;
  text-align: center;
  text-shadow: 0 0 10px rgba(137, 209, 133, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

.slot-number.animating {
  animation: spin 0.1s linear infinite;
}

.currency-icon {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 5px rgba(137, 209, 133, 0.5));
}

@keyframes spin {
  0% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(-2px);
  }
}

@font-face {
  font-family: 'Digital-7';
  src: url('https://fonts.cdnfonts.com/css/digital-7-mono') format('woff2');
}
</style>