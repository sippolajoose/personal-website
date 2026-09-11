<script setup lang="ts">
import { onMounted } from 'vue';
import { NAlert, NSpin, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '../stores/profile';

const profileStore = useProfileStore();
const { t } = useI18n();

onMounted(async () => {
  await profileStore.loadProfile();
});
</script>

<template>
  <section class="projects-view">
    <header class="page-intro">
      <p class="eyebrow">{{ t('projects.eyebrow') }}</p>
      <h1>{{ t('projects.title') }}</h1>
      <p class="lede">{{ t('projects.intro') }}</p>
    </header>

    <n-spin :show="profileStore.loading">
      <n-alert v-if="profileStore.error" type="error" :show-icon="true" :title="profileStore.error" />
      <div v-else-if="profileStore.profile?.projects.length" class="project-grid">
        <article v-for="project in profileStore.profile.projects" :key="project.name" class="project-card">
          <div class="project-card-topline">
            <span class="project-index">0{{ profileStore.profile.projects.indexOf(project) + 1 }}</span>
            <a v-if="project.url" class="project-link" :href="project.url" target="_blank" rel="noreferrer" :aria-label="t('projects.openProject')">↗</a>
          </div>
          <h2>{{ project.name }}</h2>
          <p>{{ project.summary }}</p>
          <div class="project-tags">
            <n-tag v-for="technology in project.technologies" :key="technology" size="small" :bordered="false">{{ technology }}</n-tag>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">{{ t('projects.empty') }}</p>
    </n-spin>
  </section>
</template>
