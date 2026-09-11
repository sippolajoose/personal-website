<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { NAlert, NButton, NCard, NGrid, NGridItem, NSpin, NSpace, NTag } from 'naive-ui';
import { getProfile } from '../services/api';
import type { ProfileDocument } from '../types';

const profile = ref<ProfileDocument | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    profile.value = await getProfile();
  } catch (caughtError) {
    error.value = caughtError instanceof Error ? caughtError.message : 'Failed to load profile';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="hero">
    <n-spin :show="loading">
      <template #description>Loading profile…</template>

      <n-alert v-if="error" type="error" :show-icon="true" :title="error" />

      <template v-else-if="profile">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">Portfolio + CV</p>
            <h1 class="title">{{ profile.name }}</h1>
            <p class="lede">{{ profile.headline }}</p>
            <p class="lede">{{ profile.summary }}</p>

            <n-space class="actions" style="margin-top: 24px" :wrap="true" align="center">
              <RouterLink to="/cv">
                <n-button type="primary" size="large">Open CV</n-button>
              </RouterLink>
              <n-button quaternary size="large" tag="a" :href="`mailto:${profile.email}`">Contact</n-button>
            </n-space>
          </div>

          <n-card size="large" title="Snapshot" embedded>
            <p class="meta">{{ profile.location }}</p>
            <n-space :wrap="true">
              <n-tag v-for="skill in profile.skills" :key="skill" type="success" round>{{ skill }}</n-tag>
            </n-space>
            <n-space style="margin-top: 18px" :wrap="true">
              <n-tag v-for="link in profile.links" :key="link.url" type="info" round>
                <a :href="link.url" target="_blank" rel="noreferrer">{{ link.label }}</a>
              </n-tag>
            </n-space>
          </n-card>
        </div>

        <n-grid :cols="2" :x-gap="20" :y-gap="20" responsive="screen">
          <n-grid-item span="1">
            <n-card title="Experience" embedded>
              <div class="timeline">
                <article v-for="entry in profile.experience" :key="`${entry.company}-${entry.role}`" class="timeline-item">
                  <p class="meta">{{ entry.startDate }}<span v-if="entry.endDate"> - {{ entry.endDate }}</span></p>
                  <h3 style="margin: 0 0 4px">{{ entry.role }} · {{ entry.company }}</h3>
                  <p class="subtle">{{ entry.summary }}</p>
                </article>
              </div>
            </n-card>
          </n-grid-item>

          <n-grid-item span="1">
            <n-card title="Education + Certificates" embedded>
              <div class="list">
                <article v-for="entry in profile.education" :key="`${entry.institution}-${entry.degree}`" class="list-item">
                  <p class="meta">Education</p>
                  <h3 style="margin: 0 0 4px">{{ entry.degree }}</h3>
                  <p class="subtle">{{ entry.institution }}</p>
                </article>

                <article v-for="certificate in profile.certificates" :key="`${certificate.issuer}-${certificate.name}`" class="list-item">
                  <p class="meta">Certificate</p>
                  <h3 style="margin: 0 0 4px">{{ certificate.name }}</h3>
                  <p class="subtle">{{ certificate.issuer }} · {{ certificate.date }}</p>
                </article>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </template>
    </n-spin>
  </section>
</template>
