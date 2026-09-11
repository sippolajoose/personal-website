<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from '../composables/locale';

const { locale } = useLocale();
const copy = computed(() => locale.value === 'fi'
  ? {
      eyebrow: 'Järjestelmä', title: 'Miten tämä sivu toimii', intro: 'Portfolio on samalla pieni full-stack-sovellus. Käyttöliittymä, API ja data on pidetty erillään, jotta kokonaisuus on helppo ymmärtää ja ylläpitää.', frontend: 'Frontend', frontendText: 'Vue 3, Vue Router ja Naive UI muodostavat reaktiivisen käyttöliittymän.', api: 'API', apiText: 'Express tarjoaa profiilin, CV:n, PDF-exportin, health-tarkistuksen ja OpenAPI-dokumentaation.', database: 'Data', databaseText: 'MongoDB säilyttää profiilin yhtenä dokumenttina, jonka backend lukee turvallisesti ympäristöstä riippumatta.', boundary: 'Selkeä raja', boundaryText: 'Selain ei puhu suoraan tietokantaan. Kaikki data kulkee backendin validoitujen reittien kautta.'
    }
  : {
      eyebrow: 'System', title: 'How this site works', intro: 'This portfolio is also a small full-stack application. The UI, API, and data are separated so the system stays easy to understand and maintain.', frontend: 'Frontend', frontendText: 'Vue 3, Vue Router, and Naive UI form the reactive interface.', api: 'API', apiText: 'Express serves the profile, CV, PDF export, health check, and OpenAPI documentation.', database: 'Data', databaseText: 'MongoDB stores the profile as one document, read by the backend through environment-specific configuration.', boundary: 'A clear boundary', boundaryText: 'The browser never talks directly to the database. All data moves through validated backend routes.'
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
      <article class="architecture-card architecture-card-accent"><span class="architecture-card-number">04</span><h2>{{ copy.boundary }}</h2><p>{{ copy.boundaryText }}</p></article>
    </div>
  </section>
</template>
