<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NAlert, NButton, NCard, NGrid, NGridItem, NSpin } from 'naive-ui';
import { downloadResumePdf, getProfile } from '../services/api';
import type { ProfileDocument } from '../types';

const profile = ref<ProfileDocument | null>(null);
const loading = ref(true);
const error = ref('');
const exporting = ref(false);

onMounted(async () => {
  try {
    profile.value = await getProfile();
  } catch (caughtError) {
    error.value = caughtError instanceof Error ? caughtError.message : 'Failed to load CV';
  } finally {
    loading.value = false;
  }
});

async function handleExport() {
  exporting.value = true;

  try {
    await downloadResumePdf();
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <section>
    <div class="page-heading" style="margin-bottom: 20px">
      <div>
        <p class="eyebrow">CV</p>
        <h1 class="section-title" style="font-size: 2rem; margin: 0">Curriculum vitae</h1>
      </div>

      <n-button type="primary" size="large" :loading="exporting" @click="handleExport">
        Export PDF
      </n-button>
    </div>

    <n-spin :show="loading">
      <template #description>Loading CV…</template>

      <n-alert v-if="error" type="error" :show-icon="true" :title="error" />

      <template v-else-if="profile">
        <n-card size="large" embedded>
          <h2 style="margin: 0 0 8px">{{ profile.name }}</h2>
          <p class="meta">{{ profile.headline }} · {{ profile.location }}</p>
          <p class="subtle">{{ profile.summary }}</p>

          <n-grid :cols="2" :x-gap="20" :y-gap="20" style="margin-top: 24px" responsive="screen">
            <n-grid-item span="1">
              <n-card title="Experience" embedded>
                <div class="timeline">
                  <article v-for="entry in profile.experience" :key="`${entry.company}-${entry.role}`" class="timeline-item">
                    <p class="meta">{{ entry.startDate }}<span v-if="entry.endDate"> - {{ entry.endDate }}</span></p>
                    <strong>{{ entry.role }}</strong>
                    <div class="subtle">{{ entry.company }}</div>
                    <p class="subtle">{{ entry.summary }}</p>
                  </article>
                </div>
              </n-card>
            </n-grid-item>

            <n-grid-item span="1">
              <n-card title="Education + Certificates" embedded>
                <div class="list">
                  <article v-for="entry in profile.education" :key="`${entry.institution}-${entry.degree}`" class="list-item">
                    <strong>{{ entry.degree }}</strong>
                    <div class="subtle">{{ entry.institution }}</div>
                  </article>

                  <article v-for="certificate in profile.certificates" :key="`${certificate.issuer}-${certificate.name}`" class="list-item">
                    <strong>{{ certificate.name }}</strong>
                    <div class="subtle">{{ certificate.issuer }}</div>
                  </article>
                </div>
              </n-card>
            </n-grid-item>
          </n-grid>
        </n-card>
      </template>
    </n-spin>
  </section>
</template>
