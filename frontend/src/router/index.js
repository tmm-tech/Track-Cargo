import { createRouter, createWebHistory } from 'vue-router';
import Track from '@/views/TrackPage.vue';

const routes = [
  { path: '/', name: 'Track', component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;