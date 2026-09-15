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

    <section class="architecture-stack">
      <header class="architecture-stack-header">
        <p class="eyebrow">{{ t('architecture.stackEyebrow') }}</p>
        <h2>{{ t('architecture.stackTitle') }}</h2>
        <p>{{ t('architecture.stackIntro') }}</p>
        <router-link class="button-secondary" to="/api-guide">{{ t('architecture.apiDocs') }}</router-link>
      </header>

      <div class="architecture-stack-grid">
        <article class="architecture-stack-card">
          <span class="architecture-card-number">01</span>
          <h3>{{ t('architecture.frontendStack') }}</h3>
          <p>{{ t('architecture.frontendStackText') }}</p>
          <div class="architecture-tags">
            <span>Vue 3</span>
            <span>TypeScript</span>
            <span>Vite</span>
            <span>Vue Router</span>
            <span>Pinia</span>
            <span>Vue I18n</span>
            <span>Naive UI</span>
          </div>
        </article>

        <article class="architecture-stack-card">
          <span class="architecture-card-number">02</span>
          <h3>{{ t('architecture.backendStack') }}</h3>
          <p>{{ t('architecture.backendStackText') }}</p>
          <div class="architecture-tags">
            <span>Node.js</span>
            <span>Express 5</span>
            <span>MongoDB</span>
            <span>MongoDB Driver</span>
            <span>Zod</span>
            <span>PDFKit</span>
          </div>
        </article>

        <article class="architecture-stack-card">
          <span class="architecture-card-number">03</span>
          <h3>{{ t('architecture.qualityStack') }}</h3>
          <p>{{ t('architecture.qualityStackText') }}</p>
          <div class="architecture-tags">
            <span>Docker Compose</span>
            <span>Vitest</span>
            <span>Supertest</span>
            <span>ESLint</span>
            <span>Prettier</span>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
