export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      home: 'Etusivu',
      cv: 'CV',
      projects: 'Projektit',
      architecture: 'Arkkitehtuuri',
      apiGuide: 'API-opas'
    },
    theme: {
      light: 'Vaalea tila',
      dark: 'Tumma tila'
    },
    language: 'EN'
  },
  home: {
    eyebrow: 'Portfolio + CV',
    openCv: 'Avaa CV',
    contact: 'Ota yhteyttä',
    snapshot: 'Pikakuvaus',
    experience: 'Kokemus',
    education: 'Koulutus',
    certificates: 'Sertifikaatit',
    educationLabel: 'Koulutus',
    certificate: 'Sertifikaatti',
    loading: 'Ladataan profiilia…'
  },
  cv: {
    eyebrow: 'CV',
    title: 'Ansioluettelo',
    export: 'Vie PDF:nä',
    loading: 'Ladataan CV:tä…',
    experience: 'Kokemus',
    education: 'Koulutus',
    certificates: 'Sertifikaatit',
    skills: 'Osaaminen'
  },
  projects: {
    eyebrow: 'Työnäytteet',
    title: 'Projektit',
    intro: 'Valikoima rakennettuja asioita ja niistä opittuja ratkaisuja.',
    empty: 'Projekteja ei ole vielä lisätty.',
    openProject: 'Avaa projekti'
  },
  architecture: {
    eyebrow: 'Järjestelmä',
    title: 'Miten tämä sivu toimii',
    intro: 'Selain näyttää sisällön, backend tarjoaa datan ja MongoDB säilyttää profiilin.',
    frontend: 'Selain',
    frontendText: 'Vue rakentaa sivut ja vaihtaa näkymää ilman täyttä sivunlatausta.',
    api: 'Backend',
    apiText: 'Express tarjoaa frontendille profiilin datan.',
    database: 'MongoDB',
    databaseText: 'Profiili on tallennettu yhdeksi dokumentiksi.',
    flowAria: 'Sovelluksen arkkitehtuuri',
    frontendNode: 'Vue-frontend',
    apiNode: 'Express-API',
    browser: 'Selain',
    backend: 'Backend',
    persistence: 'Tallennus'
  },
  apiGuide: {
    eyebrow: 'API-opas',
    title: 'Interaktiivinen OpenAPI-dokumentaatio',
    intro: 'Tutki endpointteja, tarkastele pyyntöjä ja kokeile APIa suoraan tällä sivulla.',
    raw: 'Avaa OpenAPI JSON',
    loading: 'Ladataan interaktiivista dokumentaatiota…'
  },
  errors: {
    profile: 'Profiilin lataaminen epäonnistui.'
  }
} as const;
