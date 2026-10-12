import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import PresenceView from '../views/PresenceView.vue';
import RequestView from '../views/RequestView.vue';
import RequestFormView from '../views/RequestFormView.vue';
import { store } from '../store/store.js';
import api from '../service/api.js';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', name: 'Login', component: LoginView, meta: { guest: true } },
  { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true, title: 'Dashboard Employee' } },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true, title: 'Profile' } },
  { path: '/presence', name: 'Presence', component: PresenceView, meta: { requiresAuth: true, title: 'Presence List' } },
  { path: '/request', name: 'Request', component: RequestView, meta: { requiresAuth: true, title: 'Request' } },
  { path: '/request/create', name: 'RequestForm', component: RequestFormView, meta: { requiresAuth: true, title: 'Request Form' } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Guard Autentikasi
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('lp_token');
  const user = store.user
  if (to.meta.requiresAuth && !token && !user) {
    store.user = null
    store.token = null
    localStorage.removeItem('lp_token')
    next('/login');
  } else if (to.meta.requiresAuth && token) {
    if(!user)
    {
        try {
            const {data} = await api.get('/profile')
            store.user = data.data
        } catch (error) {
            store.user = null
            store.token = null
            localStorage.removeItem('lp_token')
            next('/login');
        }
    }

    next();
  
  } else if (to.meta.guest && token) {
    next('/home');
  } else {
    next();
  }
});

export default router;