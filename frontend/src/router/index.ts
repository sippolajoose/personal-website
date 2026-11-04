import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import ArchitectureView from '../views/ArchitectureView.vue';
import PlaygroundView from '../views/PlaygroundView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/playground',
      name: 'playground',
      component: PlaygroundView
    }
  ]
});
