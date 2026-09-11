<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { NAlert, NButton, NCard, NGrid, NGridItem, NSpin, NSpace, NTag } from 'naive-ui';
import { useLocale } from '../composables/locale';
import { useProfileStore } from '../stores/profile';

const profileStore = useProfileStore();
const { locale } = useLocale();
const copy = computed(() => locale.value === 'fi'
  ? { eyebrow: 'Portfolio + CV', openCv: 'Avaa CV', contact: 'Ota yhteyttä', snapshot: 'Pikakuvaus', experience: 'Kokemus', education: 'Koulutus', certificates: 'Sertifikaatit', educationLabel: 'Koulutus', certificate: 'Sertifikaatti', loading: 'Ladataan profiilia…' }
  : { eyebrow: 'Portfolio + CV', openCv: 'Open CV', contact: 'Contact', snapshot: 'Snapshot', experience: 'Experience', education: 'Education', certificates: 'Certificates', educationLabel: 'Education', certificate: 'Certificate', loading: 'Loading profile…' });

onMounted(async () => {
  await profileStore.loadProfile();
});
</script>

<template>
  <section class="hero">
    <n-spin :show="profileStore.loading">
      <template #description>{{ copy.loading }}</template>

      <n-alert v-if="profileStore.error" type="error" :show-icon="true" :title="profileStore.error" />

      <template v-else-if="profileStore.profile">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">{{ copy.eyebrow }}</p>
            <h1 class="title">{{ profileStore.profile.name }}</h1>
            <p class="lede">{{ profileStore.profile.headline }}</p>
            <p class="lede">{{ profileStore.profile.summary }}</p>

            <n-space class="actions" style="margin-top: 24px" :wrap="true" align="center">
              <RouterLink to="/cv">
                <n-button type="primary" size="large">{{ copy.openCv }}</n-button>
              </RouterLink>
              <n-button quaternary size="large" tag="a" :href="`mailto:${profileStore.profile.email}`">{{ copy.contact }}</n-button>
            </n-space>
          </div>

          <n-card size="large" :title="copy.snapshot" embedded>
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

        <n-grid class="home-sections" :cols="2" :x-gap="20" :y-gap="20" responsive="screen">
          <n-grid-item span="1">
            <n-card :title="copy.experience" embedded>
              <div class="timeline">
                <article v-for="entry in profileStore.profile.experience" :key="`${entry.company}-${entry.role}`" class="timeline-item">
                  <p class="meta">{{ entry.startDate }}<span v-if="entry.endDate"> - {{ entry.endDate }}</span></p>
                  <h3 style="margin: 0 0 4px">{{ entry.role }} · {{ entry.company }}</h3>
                  <p class="subtle">{{ entry.summary }}</p>
                </article>
              </div>
            </n-card>
          </n-grid-item>

          <n-grid-item span="1">
            <n-card :title="copy.education" embedded>
              <div class="list">
                <article v-for="entry in profileStore.profile.education" :key="`${entry.institution}-${entry.degree}`" class="list-item">
                  <p class="meta">{{ copy.educationLabel }}</p>
                  <h3 style="margin: 0 0 4px">{{ entry.degree }}</h3>
                  <p class="subtle">{{ entry.institution }}</p>
                </article>
              </div>
            </n-card>
          </n-grid-item>

          <n-grid-item span="1">
            <n-card :title="copy.certificates" embedded>
              <div class="list">
                <article v-for="certificate in profileStore.profile.certificates" :key="`${certificate.issuer}-${certificate.name}`" class="list-item">
                  <p class="meta">{{ copy.certificate }}</p>
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
