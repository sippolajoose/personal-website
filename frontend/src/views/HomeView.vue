<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NAlert, NButton, NCard, NSpin, NSpace, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { downloadResumePdf } from '../services/api';
import { useProfileStore } from '../stores/profile';
import { getLocalizedText } from '../utils/localizedText';

const profileStore = useProfileStore();
const exporting = ref(false);
const { locale, t } = useI18n();
const localized = (value: Parameters<typeof getLocalizedText>[0]) => getLocalizedText(value, locale.value === 'fi' ? 'fi' : 'en');

onMounted(async () => {
  await profileStore.loadProfile();
});

async function handleExport() {
  exporting.value = true;

  try {
    await downloadResumePdf(locale.value === 'fi' ? 'fi' : 'en');
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <section class="hero">
    <n-spin :show="profileStore.loading">
      <template #description>{{ t('home.loading') }}</template>

      <n-alert v-if="profileStore.error" type="error" :show-icon="true" :title="profileStore.error" />

      <template v-else-if="profileStore.profile">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">{{ t('home.eyebrow') }}</p>
            <h1 class="title">{{ profileStore.profile.name }}</h1>
            <p class="lede">{{ profileStore.profile.headline }}</p>
            <p class="lede">{{ localized(profileStore.profile.summary) }}</p>

            <n-space class="actions" style="margin-top: 24px" :wrap="true" align="center">
              <n-button type="primary" size="large" :loading="exporting" @click="handleExport">
                {{ t('home.exportCv') }}
              </n-button>
              <n-button quaternary size="large" tag="a" :href="`mailto:${profileStore.profile.email}`">{{ t('home.contact') }}</n-button>
            </n-space>
          </div>

          <n-card size="large" :title="t('home.snapshot')" embedded>
              <div v-if="profileStore.profile.photoUrl" class="profile-photo-wrap">
                <img :src="profileStore.profile.photoUrl" :alt="`${profileStore.profile.name} profile photo`" class="profile-photo" />
            </div>
              <p class="meta">{{ profileStore.profile.location }}</p>
            <n-space :wrap="true">
                <n-tag v-for="skill in profileStore.profile.skills" :key="skill" type="success" round>{{ skill }}</n-tag>
            </n-space>
            <n-space style="margin-top: 18px" :wrap="true">
              <n-tag v-for="link in profileStore.profile.socialLinks || profileStore.profile.links" :key="link.url" type="info" round>
                <a :href="link.url" target="_blank" rel="noreferrer">{{ link.label }}</a>
              </n-tag>
            </n-space>
          </n-card>
        </div>

        <div class="home-sections">
          <div class="home-column">
            <n-card :title="t('home.experience')" embedded>
              <div class="timeline">
                <article v-for="entry in profileStore.profile.experience" :key="`${entry.company}-${localized(entry.role)}`" class="timeline-item">
                  <p class="meta">{{ entry.startDate }}<span v-if="entry.endDate"> - {{ entry.endDate }}</span></p>
                  <h3 style="margin: 0 0 4px">{{ localized(entry.role) }} · {{ entry.company }}</h3>
                  <p class="subtle">{{ localized(entry.summary) }}</p>
                </article>
              </div>
            </n-card>
          </div>

          <div class="home-column">
            <n-card :title="t('home.education')" embedded>
              <div class="list">
                <article v-for="entry in profileStore.profile.education" :key="`${localized(entry.institution)}-${localized(entry.degree)}`" class="list-item">
                  <p class="meta">{{ t('home.educationLabel') }}</p>
                  <h3 style="margin: 0 0 4px">{{ localized(entry.degree) }}</h3>
                  <p class="subtle">{{ localized(entry.institution) }}</p>
                </article>
              </div>
            </n-card>

            <n-card :title="t('home.certificates')" embedded>
              <div class="list">
                <article v-for="certificate in profileStore.profile.certificates" :key="`${certificate.issuer}-${certificate.name}`" class="list-item">
                  <p class="meta">{{ t('home.certificate') }}</p>
                  <h3 style="margin: 0 0 4px">{{ certificate.name }}</h3>
                  <p class="subtle">{{ certificate.issuer }} · {{ certificate.date }}</p>
                </article>
              </div>
            </n-card>
          </div>
        </div>
      </template>
    </n-spin>
  </section>
</template>
