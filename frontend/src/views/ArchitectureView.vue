<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section class="architecture-view">
    <header class="page-intro architecture-intro">
      <p class="eyebrow">{{ t('architecture.eyebrow') }}</p>
      <h1>{{ t('architecture.title') }}</h1>
      <p class="lede">{{ t('architecture.intro') }}</p>
    </header>

    <div class="architecture-flow" :aria-label="t('architecture.flowAria')">
      <div class="architecture-node architecture-node-primary"><span>01</span><strong>{{ t('architecture.frontendNode') }}</strong><small>{{ t('architecture.browser') }}</small></div>
      <div class="architecture-connector">→</div>
      <div class="architecture-node"><span>02</span><strong>{{ t('architecture.apiNode') }}</strong><small>{{ t('architecture.backend') }}</small></div>
      <div class="architecture-connector">→</div>
      <div class="architecture-node"><span>03</span><strong>MongoDB</strong><small>{{ t('architecture.persistence') }}</small></div>
    </div>

    <div class="architecture-grid">
      <article class="architecture-card"><span class="architecture-card-number">01</span><h2>{{ t('architecture.frontend') }}</h2><p>{{ t('architecture.frontendText') }}</p></article>
      <article class="architecture-card"><span class="architecture-card-number">02</span><h2>{{ t('architecture.api') }}</h2><p>{{ t('architecture.apiText') }}</p></article>
      <article class="architecture-card"><span class="architecture-card-number">03</span><h2>{{ t('architecture.database') }}</h2><p>{{ t('architecture.databaseText') }}</p></article>
    </div>
  </section>
</template>
