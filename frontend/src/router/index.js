import { createRouter, createWebHistory } from 'vue-router';
import TrackPage from '../views/TrackPage.vue';
import ResultsPage from '../views/ResultsPage.vue';
import AdminPage from '../views/AdminPage.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/track',
      name: 'track',
      component: TrackPage
    },
    {
      path: '/track/results',
      name: 'results',
      component: ResultsPage
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage
    }
  ]
})

export default router