<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTheme } from '../composables/theme';
import { useI18n } from 'vue-i18n';

const scalarHost = ref<HTMLDivElement | null>(null);
const scalarLoaded = ref(false);
const { themeMode } = useTheme();
const { t } = useI18n();

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
const openApiUrl = computed(() => `${apiBaseUrl}/openapi.json`);
const scalarTheme = computed(() => (themeMode.value === 'dark' ? 'moon' : 'default'));

interface ScalarApiReference {
  createApiReference: (target: string | HTMLElement, options: { url: string; theme?: string }) => void;
}

declare global {
  interface Window {
    Scalar?: ScalarApiReference;
  }
}

async function loadScalarScript() {
  if (window.Scalar) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-scalar-api-reference]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Scalar API Reference')), {
        once: true
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
    script.async = true;
    script.dataset.scalarApiReference = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Scalar API Reference'));
    document.head.appendChild(script);
  });
}

function renderScalar() {
  if (!scalarHost.value || !window.Scalar) {
    return;
  }

  scalarHost.value.innerHTML = '';
  window.Scalar.createApiReference(scalarHost.value, {
    url: openApiUrl.value,
    theme: scalarTheme.value
  });
}

onMounted(async () => {
  await loadScalarScript();
  scalarLoaded.value = true;
  renderScalar();
});

watch(scalarTheme, () => {
  if (scalarLoaded.value) {
    renderScalar();
  }
});

onBeforeUnmount(() => {
  if (scalarHost.value) {
    scalarHost.value.innerHTML = '';
  }
});
</script>

<template>
  <section class="api-guide-shell">
    <header class="api-guide-header panel">
      <div>
        <p class="eyebrow">{{ t('apiGuide.eyebrow') }}</p>
        <h1 class="section-title" style="font-size: 2rem; margin: 0 0 10px">{{ t('apiGuide.title') }}</h1>
        <p class="subtle">{{ t('apiGuide.intro') }}</p>
      </div>
      <a class="button-secondary" :href="openApiUrl" target="_blank" rel="noreferrer">{{ t('apiGuide.raw') }}</a>
    </header>

    <section class="panel api-guide-panel">
      <div v-if="!scalarLoaded" class="api-guide-loading">{{ t('apiGuide.loading') }}</div>
      <div ref="scalarHost" class="scalar-host" />
    </section>
  </section>
</template>
