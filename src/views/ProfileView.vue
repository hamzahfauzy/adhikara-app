<template>
  <section class="page" id="profilePage" v-if="store.user">
      <div class="eyebrow">Employee Account</div>
      <h2 class="employee-name mb-4">Profil Saya</h2>

      <div class="card-dark text-center">
          <div class="avatar mx-auto mb-3" style="width:72px;height:72px;font-size:26px">
              {{userInitials}}
          </div>
          <h3 class="section-title" id="profileName">{{store.user.name}}</h3>
          <p class="muted small-text mt-2 mb-1">Business Process Development</p>
          <span class="status status-approved">Karyawan Aktif</span>
      </div>

      <div class="card-dark">
          <div class="profile-item">
              <span class="muted">ID Karyawan</span>
              <strong>{{store.user.code}}</strong>
          </div>
          <div class="profile-item">
              <span class="muted">No. HP</span>
              <strong>{{store.user.phone}}</strong>
          </div>
          <div class="profile-item">
              <span class="muted">Status</span>
              <strong>{{store.user.status}}</strong>
          </div>
      </div>

      <button class="btn-outline-gold w-100 mt-3" @click="promptLogout">
          <i class="bi bi-box-arrow-right me-2"></i>
          Keluar
      </button>
  </section>
</template>
<script setup>
import { computed } from 'vue';
import { store } from '../store/store';

const promptLogout = () => store.openModal('logout');
const userInitials = computed(() => store.user?.name.split(' ').map(n => n[0]).join(''));
</script>