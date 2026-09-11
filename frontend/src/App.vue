<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { darkTheme, lightTheme, NButton, NConfigProvider } from 'naive-ui';
import { useTheme } from './composables/theme';
import { useLocale } from './composables/locale';

const { isDarkMode, themeMode, toggleTheme } = useTheme();
const { locale, toggleLocale } = useLocale();
const naiveTheme = computed(() => (isDarkMode.value ? darkTheme : lightTheme));

const syncThemeToDom = () => {
  document.documentElement.dataset.theme = themeMode.value;
  document.documentElement.style.colorScheme = themeMode.value;
};

onMounted(() => {
  syncThemeToDom();
  document.documentElement.lang = locale.value;
  window.addEventListener('themechange', syncThemeToDom as EventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('themechange', syncThemeToDom as EventListener);
});
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <div class="shell">
      <header class="topbar">
        <router-link class="brand" to="/">Personal Website</router-link>

        <nav class="nav">
          <router-link to="/">{{ locale === 'fi' ? 'Etusivu' : 'Home' }}</router-link>
          <router-link to="/cv">CV</router-link>
          <router-link to="/projects">{{ locale === 'fi' ? 'Projektit' : 'Projects' }}</router-link>
          <router-link to="/architecture">{{ locale === 'fi' ? 'Arkkitehtuuri' : 'Architecture' }}</router-link>
          <router-link to="/api-guide">API Guide</router-link>
        </nav>

        <div class="topbar-actions">
          <n-button class="language-toggle" quaternary size="small" @click="toggleLocale">
            {{ locale === 'en' ? 'FI' : 'EN' }}
          </n-button>
          <n-button class="theme-toggle" quaternary size="small" @click="toggleTheme">
            {{ themeMode === 'dark' ? 'Light mode' : 'Dark mode' }}
          </n-button>
        </div>
      </header>

      <main class="page">
        <router-view />
      </main>
    </div>
  </n-config-provider>
</template>
