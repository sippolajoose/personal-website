import { createApp } from 'vue';
import App from './App.vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import { initializeTheme } from './composables/theme';
import { router } from './router';
import './styles.css';

initializeTheme();

createApp(App).use(createPinia()).use(router).use(naive).mount('#app');
