<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NAlert, NButton, NSpin } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { downloadResumePdf } from '../services/api';
import { useProfileStore } from '../stores/profile';

const profileStore = useProfileStore();
const exporting = ref(false);
const { t } = useI18n();

onMounted(async () => {
  await profileStore.loadProfile();
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
        <p class="eyebrow">{{ t('cv.eyebrow') }}</p>
        <h1 class="section-title" style="font-size: 2rem; margin: 0">{{ t('cv.title') }}</h1>
      </div>

      <n-button type="primary" size="large" :loading="exporting" @click="handleExport">
        {{ t('cv.export') }}
      </n-button>
    </div>

    <n-spin :show="profileStore.loading">
      <template #description>{{ t('cv.loading') }}</template>

      <n-alert v-if="profileStore.error" type="error" :show-icon="true" :title="profileStore.error" />

      <template v-else-if="profileStore.profile">
        <div class="cv-resume">
          <header class="cv-header">
            <div>
              <p class="cv-kicker">{{ t('cv.title') }}</p>
              <h2 class="cv-name">{{ profileStore.profile.name }}</h2>
              <p class="cv-role">{{ profileStore.profile.headline }}</p>
            </div>

            <div class="cv-contact">
              <span>{{ profileStore.profile.location }}</span>
              <a :href="`mailto:${profileStore.profile.email}`">{{ profileStore.profile.email }}</a>
            </div>
          </header>

          <p class="cv-summary">{{ profileStore.profile.summary }}</p>

          <div class="cv-grid">
            <section class="cv-panel">
              <h3 class="cv-section-title">{{ t('cv.experience') }}</h3>

              <article v-for="entry in profileStore.profile.experience" :key="`${entry.company}-${entry.role}`" class="cv-item">
                <div class="cv-item-topline">
                  <div>
                    <strong>{{ entry.role }}</strong>
                    <span class="cv-company"> · {{ entry.company }}</span>
                  </div>
                  <span class="cv-date">{{ entry.startDate }}<span v-if="entry.endDate"> - {{ entry.endDate }}</span></span>
                </div>

                <p class="cv-copy">{{ entry.summary }}</p>

                <ul v-if="entry.highlights?.length" class="cv-bullets">
                  <li v-for="highlight in entry.highlights" :key="highlight">{{ highlight }}</li>
                </ul>
              </article>
            </section>

            <aside class="cv-panel cv-side-panel">
              <div>
                <h3 class="cv-section-title">{{ t('cv.education') }}</h3>
                <article v-for="entry in profileStore.profile.education" :key="`${entry.institution}-${entry.degree}`" class="cv-side-item">
                  <strong>{{ entry.degree }}</strong>
                  <div class="cv-copy">{{ entry.institution }}</div>
                  <div class="cv-date">{{ entry.startDate }}<span v-if="entry.endDate"> - {{ entry.endDate }}</span></div>
                </article>
              </div>

              <div>
                <h3 class="cv-section-title">{{ t('cv.certificates') }}</h3>
                <article v-for="certificate in profileStore.profile.certificates" :key="`${certificate.issuer}-${certificate.name}`" class="cv-side-item">
                  <strong>{{ certificate.name }}</strong>
                  <div class="cv-copy">{{ certificate.issuer }}</div>
                  <div class="cv-date">{{ certificate.date }}</div>
                </article>
              </div>

              <div>
                <h3 class="cv-section-title">{{ t('cv.skills') }}</h3>
                <div class="cv-skill-list">
                  <span v-for="skill in profileStore.profile.skills" :key="skill">{{ skill }}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </template>
    </n-spin>
  </section>
</template>
