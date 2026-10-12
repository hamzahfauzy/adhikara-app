<template>
  <!-- HEADER -->
  <header class="topbar">
      <div>
          <h1 class="topbar-title" id="headerTitle">{{title}}</h1>
          <div class="topbar-subtitle">ADHIKARA NUSA PERKASA</div>
      </div>

      <!-- <button class="icon-button" type="button" aria-label="Notifikasi">
        <i class="bi bi-bell"></i>
        <span class="notification-dot"></span>
      </button> -->
  </header>
</template>

<script setup>

defineProps({
  title: { type: String, default: 'Dashboard' }
});
</script>
