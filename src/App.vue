<template>
    <!-- Main Content Container -->
     <template v-if="isAuthenticated">
        <div class="app">
            <AppHeader :title="currentPageTitle" />

            <main class="content">
                <router-view />
            </main>
        </div>
        <!-- Bottom Navigation Mobile -->
        <MobileBottomNav />
    </template>
        
    <template v-else>
        <main class="is_auth">
            <router-view />
        </main>
    </template>

    <!-- Reusable Modal & Toast -->
    <GlobalModal />
    <GlobalToast />
</template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from './store/store';

import AppHeader from './components/AppHeader.vue';
import MobileBottomNav from './components/MobileBottomNav.vue';
import GlobalModal from './components/GlobalModal.vue';
import GlobalToast from './components/GlobalToast.vue';

const route = useRoute();
const isAuthenticated = computed(() => !!store.token);
const currentPageTitle = computed(() => route.meta.title || 'PresenceApp');

</script>