<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const experiments = [
  {
    id: 'mini-golf',
    titleKey: 'playgroundIndex.miniGolfTitle',
    descriptionKey: 'playgroundIndex.miniGolfDescription',
    route: { name: 'playground-minigolf' }
  }
] as const;
</script>

<template>
  <section class="projects-view">
    <header class="page-intro">
      <p class="eyebrow">{{ t('playgroundIndex.eyebrow') }}</p>
      <h1>{{ t('playgroundIndex.title') }}</h1>
      <p class="lede">{{ t('playgroundIndex.intro') }}</p>
    </header>

    <div class="project-grid">
      <router-link
        v-for="(experiment, index) in experiments"
        :key="experiment.id"
        class="project-card playground-card"
        :to="experiment.route"
      >
        <div class="project-card-topline">
          <span class="project-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="project-link" aria-hidden="true">↗</span>
        </div>
        <h2>{{ t(experiment.titleKey) }}</h2>
        <p>{{ t(experiment.descriptionKey) }}</p>
      </router-link>
    </div>
  </section>
</template>
