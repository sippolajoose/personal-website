import { createRouter, createWebHistory } from 'vue-router';
import ApiGuideView from '../views/ApiGuideView.vue';
import HomeView from '../views/HomeView.vue';
import CvView from '../views/CvView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cv',
      name: 'cv',
      component: CvView
    },
    {
      path: '/api-guide',
      name: 'api-guide',
      component: ApiGuideView
    }
  ]
});
