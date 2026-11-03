<script setup lang="ts">
import { ref } from 'vue';
import { NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import FeedbackScroller from './FeedbackScroller.vue';
import { sendFeedback } from '../services/api';

const { locale, t } = useI18n();
const feedbackMessage = ref('');
const feedbackDisplayName = ref('');
const feedbackPublishConsent = ref(false);
const feedbackState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');
const feedbackRefreshKey = ref(0);

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
        <input
          id="feedback-name"
          v-model="feedbackDisplayName"
          :placeholder="t('feedback.namePlaceholder')"
          maxlength="80"
        />
      </label>

      <label class="feedback-consent">
        <input v-model="feedbackPublishConsent" type="checkbox" />
        <span>{{ t('feedback.consent') }}</span>
      </label>

      <div class="feedback-actions">
        <n-button
          type="primary"
          attr-type="submit"
          :loading="feedbackState === 'submitting'"
        >
          {{ t('feedback.submit') }}
        </n-button>
        <p
          v-if="feedbackState === 'success'"
          class="feedback-status"
          role="status"
        >
          {{ t('feedback.success') }}
        </p>
        <p
          v-else-if="feedbackState === 'error'"
          class="feedback-status feedback-status-error"
          role="alert"
        >
          {{ t('feedback.error') }}
        </p>
      </div>
    </form>

    <FeedbackScroller :refresh-key="feedbackRefreshKey" />
  </footer>
</template>
