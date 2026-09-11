import { createApp } from 'vue';
import App from './App.vue';
import naive from 'naive-ui';
import { initializeTheme } from './composables/theme';
import { router } from './router';
import './styles.css';

initializeTheme();

createApp(App).use(router).use(naive).mount('#app');
