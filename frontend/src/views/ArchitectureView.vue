<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '../composables/locale';

const { locale } = useLocale();
const copy = computed(() => locale.value === 'fi'
  ? {
      eyebrow: 'Järjestelmä', title: 'Miten tämä sivu toimii', intro: 'Selain näyttää sisällön, backend tarjoaa datan ja MongoDB säilyttää profiilin.', frontend: 'Selain', frontendText: 'Vue rakentaa sivut ja vaihtaa näkymää ilman täyttä sivunlatausta.', api: 'Backend', apiText: 'Express tarjoaa frontendille profiilin datan.', database: 'MongoDB', databaseText: 'Profiili on tallennettu yhdeksi dokumentiksi.'
    }
  : {
      eyebrow: 'System', title: 'How this site works', intro: 'The browser displays the content, the backend provides the data, and MongoDB stores the profile.', frontend: 'Browser', frontendText: 'Vue renders the pages and changes views without a full page reload.', api: 'Backend', apiText: 'Express provides the profile data to the frontend.', database: 'MongoDB', databaseText: 'The profile is stored as one document.'
    });
</script>

<template>
  <section class="architecture-view">
    <header class="page-intro architecture-intro">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1>{{ copy.title }}</h1>
      <p class="lede">{{ copy.intro }}</p>
    </header>

    <div class="architecture-flow" aria-label="Application architecture">
      <div class="architecture-node architecture-node-primary"><span>01</span><strong>Vue frontend</strong><small>Browser</small></div>
      <div class="architecture-connector">→</div>
      <div class="architecture-node"><span>02</span><strong>Express API</strong><small>Backend</small></div>
      <div class="architecture-connector">→</div>
      <div class="architecture-node"><span>03</span><strong>MongoDB</strong><small>Persistence</small></div>
    </div>

    <div class="architecture-grid">
      <article class="architecture-card"><span class="architecture-card-number">01</span><h2>{{ copy.frontend }}</h2><p>{{ copy.frontendText }}</p></article>
      <article class="architecture-card"><span class="architecture-card-number">02</span><h2>{{ copy.api }}</h2><p>{{ copy.apiText }}</p></article>
      <article class="architecture-card"><span class="architecture-card-number">03</span><h2>{{ copy.database }}</h2><p>{{ copy.databaseText }}</p></article>
    </div>
  </section>
</template>
