<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { NAlert, NSpin, NTag } from 'naive-ui';
import { getProfile } from '../services/api';
import { useLocale } from '../composables/locale';
import type { ProfileDocument } from '../types';

const { locale } = useLocale();
const profile = ref<ProfileDocument | null>(null);
const loading = ref(true);
const error = ref('');

const copy = computed(() => (locale.value === 'fi'
  ? { eyebrow: 'Työnäytteet', title: 'Projektit', intro: 'Valikoima rakennettuja asioita ja niistä opittuja ratkaisuja.', empty: 'Projekteja ei ole vielä lisätty.' }
  : { eyebrow: 'Selected work', title: 'Projects', intro: 'A selection of things built and the solutions behind them.', empty: 'No projects have been added yet.' }));

onMounted(async () => {
  try {
    profile.value = await getProfile();
  } catch (caughtError) {
    error.value = caughtError instanceof Error ? caughtError.message : 'Failed to load projects';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="projects-view">
    <header class="page-intro">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1>{{ copy.title }}</h1>
      <p class="lede">{{ copy.intro }}</p>
    </header>

    <n-spin :show="loading">
      <n-alert v-if="error" type="error" :show-icon="true" :title="error" />
      <div v-else-if="profile?.projects.length" class="project-grid">
        <article v-for="project in profile.projects" :key="project.name" class="project-card">
          <div class="project-card-topline">
            <span class="project-index">0{{ profile.projects.indexOf(project) + 1 }}</span>
            <a v-if="project.url" class="project-link" :href="project.url" target="_blank" rel="noreferrer" aria-label="Open project">↗</a>
          </div>
          <h2>{{ project.name }}</h2>
          <p>{{ project.summary }}</p>
          <div class="project-tags">
            <n-tag v-for="technology in project.technologies" :key="technology" size="small" :bordered="false">{{ technology }}</n-tag>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">{{ copy.empty }}</p>
    </n-spin>
  </section>
</template>
