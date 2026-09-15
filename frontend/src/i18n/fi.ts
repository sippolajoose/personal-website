export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      home: 'Etusivu',
      projects: 'Projektit',
      architecture: 'Arkkitehtuuri',
      apiGuide: 'API-opas',
      playground: 'Minigolf'
    },
    theme: {
      light: 'Vaalea tila',
      dark: 'Tumma tila'
    },
    language: 'EN'
  },
  home: {
    eyebrow: 'CV',
    contact: 'Ota yhteyttä',
    snapshot: 'Pikakuvaus',
    experience: 'Kokemus',
    education: 'Koulutus',
    certificates: 'Sertifikaatit',
    educationLabel: 'Koulutus',
    certificate: 'Sertifikaatti',
    loading: 'Ladataan profiilia…',
    slowLoadingNotice: 'Taustapalvelu toimii maksuttomalla tasolla ja on voinut siirtyä lepotilaan käyttämättömyyden vuoksi. Ensimmäinen pyyntö sen jälkeen voi kestää hetken.'
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
    empty: 'Siirryin työelämään jo toisena opiskeluvuotenani, joten henkilökohtaiset projektit ovat jääneet taka-alalle. Katsotaan, milloin tänne saadaan jotain mielenkiintoista.',
    disclaimer: 'Siirryin työelämään jo toisena opiskeluvuotenani, joten henkilökohtaiset projektit ovat jääneet hieman taka-alalle. Tässä kuitenkin muutama esimerkki projekteista, joita olen tehnyt työn ulkopuolella.',
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
    persistence: 'Tallennus',
    stackEyebrow: 'Teknologiavalinnat',
    stackTitle: 'Sivuston taustalla olevat työkalut',
    stackIntro: 'Pino on tarkoituksella pieni: jokaisella työkalulla on selkeä rooli sivuston rakentamisessa, tarjoamisessa, tallentamisessa tai testaamisessa.',
    apiDocs: 'Avaa interaktiivinen API-dokumentaatio',
    frontendStack: 'Frontend',
    frontendStackText: 'Vue vastaa käyttöliittymästä, ja Vite, reititys, tila, kieliversiot sekä komponenttikirjasto pitävät selainpuolen sovelluksen selkeänä.',
    backendStack: 'Backend ja API',
    backendStackText: 'API on pieni Express-palvelu, jossa on tyypitetty konfiguraatio, MongoDB-tallennus, validointi ja PDF-tiedostojen generointi palvelimella.',
    qualityStack: 'Toimitus ja laatu',
    qualityStackText: 'Docker Compose tarjoaa paikallisen infrastruktuurin, ja automaattiset testit sekä muotoilutyökalut pitävät muutokset ennakoitavina.'
  },
  apiGuide: {
    eyebrow: 'API-opas',
    title: 'Interaktiivinen OpenAPI-dokumentaatio',
    intro: 'Tutki endpointteja, tarkastele pyyntöjä ja kokeile APIa suoraan tällä sivulla.',
    raw: 'Avaa OpenAPI JSON',
    loading: 'Ladataan interaktiivista dokumentaatiota…'
  },
  playground: {
    eyebrow: 'Minigolf',
    title: 'Rauhallinen minigolfrata',
    intro: 'Vedä palloa taaksepäin, päästä irti ja yritä löytää reikä mahdollisimman vähillä lyönneillä.',
    courseLabel: 'Minimalistinen rata',
    randomCourse: 'Satunnainen rata',
    hole: 'Reikä',
    strokes: 'Lyönnit',
    reset: 'Nollaa rata',
    regenerate: 'Arvo uusi rata',
    courseAria: 'Minimalistinen minigolfrata',
    ballAria: 'Golfpallo. Tähtää vetämällä ja lyö päästämällä irti.',
    controls: 'Ohjaimet',
    help: 'Tähtää vetämällä pallosta taaksepäin. Boosterit kiihdyttävät lyöntiä ja rampit nostavat pallon esteiden yli.',
    settings: 'Radan asetukset',
    obstacleCount: 'Esteet',
    bonusCount: 'Boosterit ja hyppyrit',
    currentScore: 'Tämä rata',
    totalScore: 'Yhteensä',
    holeComplete: 'Rata suoritettu. Hieno lyönti.',
    nextHole: 'Seuraava reikä',
    playAgain: 'Pelaa uudelleen'
  },
  errors: {
    profile: 'Profiilin lataaminen epäonnistui.'
  }
} as const;
