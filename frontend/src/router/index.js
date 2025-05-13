import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/HomePage.vue';
import Track from '@/views/TrackPage.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/track', name: 'Track', component: Track },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;