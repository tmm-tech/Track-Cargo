import { createRouter, createWebHistory } from 'vue-router';
import Track from '@/views/TrackPage.vue';
import Home from '@/views/HomePage.vue';
const routes = [
  { path: '/', name: 'Home', component: Home },
   { path: '/track', name: 'Track', component: Track },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;