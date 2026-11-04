<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  darkTheme,
  lightTheme,
  NButton,
  NConfigProvider,
  type GlobalThemeOverrides
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useTheme } from './composables/theme';
import SiteFooter from './components/SiteFooter.vue';
import { toggleLocale } from './i18n';

const { isDarkMode, themeMode, toggleTheme } = useTheme();
const { locale, t } = useI18n();
const naiveTheme = computed(() => (isDarkMode.value ? darkTheme : lightTheme));
const naiveThemeOverrides = computed<GlobalThemeOverrides | undefined>(() =>
  isDarkMode.value
    ? {
        common: {
          cardColor: 'var(--surface-strong)',
          borderColor: 'var(--border)',
          dividerColor: 'var(--border)',
          textColor1: 'var(--text)',
          textColor2: 'var(--muted)',
          textColor3: 'var(--muted)'
        }
      }
    : undefined
);
const isNavHidden = ref(false);
let lastScrollY = 0;

function handleScroll() {
  const currentScrollY = Math.max(window.scrollY, 0);
  const scrollDelta = currentScrollY - lastScrollY;

  if (currentScrollY <= 16) {
    isNavHidden.value = false;
  } else if (Math.abs(scrollDelta) >= 8) {
    isNavHidden.value = scrollDelta > 0;
    lastScrollY = currentScrollY;
  }
}

onMounted(() => {
  document.documentElement.lang = locale.value;
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="naiveThemeOverrides">
    <div class="shell">
      <header class="topbar" :class="{ 'topbar--hidden': isNavHidden }">
        <router-link class="brand" to="/">{{ t('app.brand') }}</router-link>

        <nav class="nav" :aria-label="t('app.navigation.label')">
          <div class="nav-primary">
            <router-link
              to="/"
              active-class=""
              exact-active-class="router-link-active"
              >{{ t('app.navigation.home') }}</router-link
            >
            <router-link to="/projects">{{
              t('app.navigation.projects')
            }}</router-link>
          </div>
          <div class="nav-secondary">
            <router-link to="/architecture">{{
              t('app.navigation.thisApp')
            }}</router-link>
            <router-link to="/playground">{{
              t('app.navigation.playground')
            }}</router-link>
          </div>
        </nav>

        <div class="topbar-actions">
          <n-button
            class="language-toggle"
            quaternary
            size="small"
            @click="toggleLocale"
          >
            {{ t('app.language') }}
          </n-button>
          <n-button
            class="theme-toggle"
            quaternary
            size="small"
            :aria-label="
              themeMode === 'dark' ? t('app.theme.light') : t('app.theme.dark')
            "
            :title="
              themeMode === 'dark' ? t('app.theme.light') : t('app.theme.dark')
            "
            @click="toggleTheme"
          >
            <span class="theme-toggle-label">{{
              themeMode === 'dark' ? t('app.theme.light') : t('app.theme.dark')
            }}</span>
            <span class="theme-toggle-icon" aria-hidden="true">{{
              themeMode === 'dark' ? '☀' : '☾'
            }}</span>
          </n-button>
        </div>
      </header>

      <main class="page">
        <router-view />
      </main>

      <SiteFooter />
    </div>
  </n-config-provider>
</template>
