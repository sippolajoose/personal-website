import { createRouter, createWebHistory } from 'vue-router';
import ApiGuideView from '../views/ApiGuideView.vue';
import HomeView from '../views/HomeView.vue';
import CvView from '../views/CvView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import ArchitectureView from '../views/ArchitectureView.vue';

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
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/architecture',
      name: 'architecture',
      component: ArchitectureView
    },
    {
      path: '/api-guide',
      name: 'api-guide',
      component: ApiGuideView
    }
  ]
});
