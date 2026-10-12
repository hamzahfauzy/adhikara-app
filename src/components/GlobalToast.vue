<template>
  <div class="custom-toast-container">
    <Transition name="fade">
      <div
        v-if="store.toast.show"
        class="custom-toast d-flex align-items-center gap-3"
        :class="{
          'toast-success': store.toast.type === 'success',
          'toast-error': store.toast.type === 'error',
          'toast-default': !['success', 'error'].includes(store.toast.type)
        }"
        role="status"
        aria-live="polite"
      >
        <Info
          :size="20"
          class="flex-shrink-0 toast-icon"
        />

        <span class="small fw-semibold">
          {{ store.toast.message }}
        </span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Info } from 'lucide-vue-next'
import { store } from '../store/store'
</script>

<style scoped>
.custom-toast-container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  width: 100%;
  max-width: 400px;
  padding: 0 16px;
  pointer-events: none;
}

.custom-toast {
  width: 100%;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  overflow-wrap: anywhere;
}

/* SUCCESS */
.toast-success {
  background-color: #0f172a;
  color: #fff;
  border-color: #4dba87;
}

.toast-success .toast-icon {
  color: #4dba87;
}

/* ERROR */
.toast-error {
  background-color: #dc3545;
  color: #fff;
  border-color: #f87171;
}

.toast-error .toast-icon {
  color: #fff;
}

/* DEFAULT / INFO */
.toast-default {
  background-color: #1e293b;
  color: #fff;
  border-color: #475569;
}

.toast-default .toast-icon {
  color: #94a3b8;
}

/* FADE TRANSITION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>