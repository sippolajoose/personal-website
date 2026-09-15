<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getPublishedFeedback, type FeedbackItem } from '../services/api';

const { t } = useI18n();
const props = defineProps<{ refreshKey?: number }>();
const feedbackItems = ref<FeedbackItem[]>([]);
const activeIndex = ref(0);
let rotationTimer: ReturnType<typeof setInterval> | undefined;

const activeFeedback = computed(() => feedbackItems.value[activeIndex.value]);

function clearRotation() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = undefined;
  }
}

function startRotation() {
  clearRotation();

  if (feedbackItems.value.length > 1) {
    rotationTimer = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % feedbackItems.value.length;
    }, 5500);
  }
}

async function loadFeedback() {
  try {
    feedbackItems.value = await getPublishedFeedback();
    activeIndex.value = 0;
    startRotation();
  } catch {
    feedbackItems.value = [];
    clearRotation();
  }
}

function showFeedback(index: number) {
  activeIndex.value = (index + feedbackItems.value.length) % feedbackItems.value.length;
  startRotation();
}

onMounted(() => {
  void loadFeedback();
});

watch(
  () => props.refreshKey,
  () => {
    void loadFeedback();
  }
);

onBeforeUnmount(() => {
  clearRotation();
});
</script>

<template>
  <section class="feedback-scroller" :aria-label="t('feedback.scrollerAria')" @mouseenter="clearRotation" @mouseleave="startRotation">
    <div class="feedback-scroller-heading">
      <div>
        <p class="eyebrow">{{ t('feedback.scrollerEyebrow') }}</p>
        <h2>{{ t('feedback.scrollerTitle') }}</h2>
      </div>
      <div v-if="feedbackItems.length > 1" class="feedback-scroller-controls">
        <button type="button" :aria-label="t('feedback.previous')" @click="showFeedback(activeIndex - 1)">←</button>
        <button type="button" :aria-label="t('feedback.next')" @click="showFeedback(activeIndex + 1)">→</button>
      </div>
    </div>

    <blockquote v-if="activeFeedback" class="feedback-quote">
      <p>“{{ activeFeedback.message }}”</p>
      <footer>— {{ activeFeedback.displayName || t('feedback.anonymous') }}</footer>
    </blockquote>
    <p v-else class="feedback-empty">{{ t('feedback.empty') }}</p>

    <div v-if="feedbackItems.length > 1" class="feedback-dots" aria-hidden="true">
      <button
        v-for="(item, index) in feedbackItems"
        :key="`${item.createdAt}-${index}`"
        type="button"
        :class="{ 'feedback-dot-active': index === activeIndex }"
        tabindex="-1"
        @click="showFeedback(index)"
      />
    </div>
  </section>
</template>