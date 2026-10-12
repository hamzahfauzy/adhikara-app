<template>
  <nav class="bottom-nav" aria-label="Navigasi utama">

      <router-link to="/home" class="nav-item">
          <i class="bi bi-house-door"></i>
          <span>Home</span>
      </router-link>

      <router-link to="/presence" class="nav-item">
          <i class="bi bi-person-badge"></i>
          <span>Presence</span>
      </router-link>

      <router-link to="/request" class="nav-item">
          <i class="bi bi-clipboard-check"></i>
          <span>Request</span>
      </router-link>

      <router-link to="/profile" class="nav-item">
          <i class="bi bi-person-circle"></i>
          <span>Profile</span>
      </router-link>

  </nav>
</template>