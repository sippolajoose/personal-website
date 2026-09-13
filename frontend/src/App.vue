<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { darkTheme, lightTheme, NButton, NConfigProvider } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useTheme } from './composables/theme';
import { toggleLocale } from './i18n';

const { isDarkMode, themeMode, toggleTheme } = useTheme();
const { locale, t } = useI18n();
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
        <router-link class="brand" to="/">{{ t('app.brand') }}</router-link>

        <nav class="nav">
          <router-link to="/">{{ t('app.navigation.home') }}</router-link>
          <router-link to="/projects">{{ t('app.navigation.projects') }}</router-link>
          <router-link to="/architecture">{{ t('app.navigation.architecture') }}</router-link>
          <router-link to="/api-guide">{{ t('app.navigation.apiGuide') }}</router-link>
          <router-link to="/playground">{{ t('app.navigation.playground') }}</router-link>
        </nav>

        <div class="topbar-actions">
          <n-button class="language-toggle" quaternary size="small" @click="toggleLocale">
            {{ t('app.language') }}
          </n-button>
          <n-button class="theme-toggle" quaternary size="small" @click="toggleTheme">
            {{ themeMode === 'dark' ? t('app.theme.light') : t('app.theme.dark') }}
          </n-button>
        </div>
      </header>

      <main class="page">
        <router-view />
      </main>
    </div>
  </n-config-provider>
</template>
