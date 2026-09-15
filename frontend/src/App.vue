<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { darkTheme, lightTheme, NButton, NConfigProvider } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useTheme } from './composables/theme';
import FeedbackScroller from './components/FeedbackScroller.vue';
import { toggleLocale } from './i18n';
import { sendFeedback } from './services/api';

const { isDarkMode, themeMode, toggleTheme } = useTheme();
const { locale, t } = useI18n();
const naiveTheme = computed(() => (isDarkMode.value ? darkTheme : lightTheme));
const feedbackMessage = ref('');
const feedbackDisplayName = ref('');
const feedbackPublishConsent = ref(false);
const feedbackState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');
const feedbackRefreshKey = ref(0);

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

async function handleFeedbackSubmit() {
  const message = feedbackMessage.value.trim();

  if (!message || feedbackState.value === 'submitting') {
    return;
  }

  feedbackState.value = 'submitting';

  try {
    await sendFeedback({
      message,
      displayName: feedbackDisplayName.value.trim() || undefined,
      locale: locale.value === 'fi' ? 'fi' : 'en',
      publishConsent: feedbackPublishConsent.value
    });
    feedbackMessage.value = '';
    feedbackDisplayName.value = '';
    feedbackPublishConsent.value = false;
    feedbackState.value = 'success';
    feedbackRefreshKey.value += 1;
  } catch {
    feedbackState.value = 'error';
  }
}
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

      <footer class="site-footer">
        <div class="feedback-intro">
          <p class="eyebrow">{{ t('feedback.eyebrow') }}</p>
          <h2>{{ t('feedback.title') }}</h2>
          <p>{{ t('feedback.intro') }}</p>
        </div>

        <form class="feedback-form" @submit.prevent="handleFeedbackSubmit">
          <label class="feedback-field" for="feedback-message">
            <span>{{ t('feedback.messageLabel') }}</span>
            <textarea
              id="feedback-message"
              v-model="feedbackMessage"
              :placeholder="t('feedback.messagePlaceholder')"
              maxlength="1000"
              rows="5"
              required
            />
          </label>

          <label class="feedback-field" for="feedback-name">
            <span>{{ t('feedback.nameLabel') }}</span>
            <input id="feedback-name" v-model="feedbackDisplayName" :placeholder="t('feedback.namePlaceholder')" maxlength="80" />
          </label>

          <label class="feedback-consent">
            <input v-model="feedbackPublishConsent" type="checkbox" />
            <span>{{ t('feedback.consent') }}</span>
          </label>

          <div class="feedback-actions">
            <n-button type="primary" attr-type="submit" :loading="feedbackState === 'submitting'">
              {{ t('feedback.submit') }}
            </n-button>
            <p v-if="feedbackState === 'success'" class="feedback-status" role="status">{{ t('feedback.success') }}</p>
            <p v-else-if="feedbackState === 'error'" class="feedback-status feedback-status-error" role="alert">{{ t('feedback.error') }}</p>
          </div>
        </form>

        <FeedbackScroller :refresh-key="feedbackRefreshKey" />
      </footer>
    </div>
  </n-config-provider>
</template>
