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
      <div class="architecture-node architecture-node-primary"><span>01</span><strong>{{ t('architecture.clientNode') }}</strong><small>{{ t('architecture.clientDetail') }}</small></div>
      <div class="architecture-connector">→</div>
      <div class="architecture-node"><span>02</span><strong>{{ t('architecture.hostNode') }}</strong><small>{{ t('architecture.hostDetail') }}</small></div>
      <div class="architecture-connector">→</div>
      <div class="architecture-node"><span>03</span><strong>{{ t('architecture.dataNode') }}</strong><small>{{ t('architecture.dataDetail') }}</small></div>
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
          </div>
        </article>

        <article class="architecture-stack-card">
          <span class="architecture-card-number">03</span>
          <h3>{{ t('architecture.qualityStack') }}</h3>
          <p>{{ t('architecture.qualityStackText') }}</p>
          <div class="architecture-tags">
            <span>GitHub Actions</span>
            <span>GHCR</span>
            <span>K3s</span>
            <span>Helm</span>
            <span>Flux CD</span>
            <span>Vitest</span>
            <span>Supertest</span>
            <span>ESLint</span>
            <span>Prettier</span>
          </div>
        </article>
      </div>
    </section>

    <section class="architecture-stack">
      <header class="architecture-stack-header">
        <p class="eyebrow">{{ t('architecture.hostingEyebrow') }}</p>
        <h2>{{ t('architecture.hostingTitle') }}</h2>
        <p>{{ t('architecture.hostingIntro') }}</p>
      </header>

      <div class="architecture-stack-grid">
        <article class="architecture-stack-card">
          <span class="architecture-card-number">01</span>
          <h3>{{ t('architecture.piHostingTitle') }}</h3>
          <p>{{ t('architecture.piHostingText') }}</p>
        </article>
        <article class="architecture-stack-card">
          <span class="architecture-card-number">02</span>
          <h3>{{ t('architecture.k3sHostingTitle') }}</h3>
          <p>{{ t('architecture.k3sHostingText') }}</p>
        </article>
        <article class="architecture-stack-card">
          <span class="architecture-card-number">03</span>
          <h3>{{ t('architecture.gitOpsTitle') }}</h3>
          <p>{{ t('architecture.gitOpsText') }}</p>
        </article>
        <article class="architecture-stack-card">
          <span class="architecture-card-number">04</span>
          <h3>{{ t('architecture.releaseTitle') }}</h3>
          <p>{{ t('architecture.releaseText') }}</p>
        </article>
        <article class="architecture-stack-card">
          <span class="architecture-card-number">05</span>
          <h3>{{ t('architecture.lanTitle') }}</h3>
          <p>{{ t('architecture.lanText') }}</p>
        </article>
        <article class="architecture-stack-card">
          <span class="architecture-card-number">06</span>
          <h3>{{ t('architecture.secretsTitle') }}</h3>
          <p>{{ t('architecture.secretsText') }}</p>
        </article>
        <article class="architecture-stack-card">
          <span class="architecture-card-number">07</span>
          <h3>{{ t('architecture.tunnelTitle') }}</h3>
          <p>{{ t('architecture.tunnelText') }}</p>
        </article>
      </div>
    </section>
  </section>
</template>
