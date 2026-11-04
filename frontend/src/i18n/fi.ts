export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      label: 'Päänavigaatio',
      home: 'Etusivu',
      projects: 'Projektit',
      thisApp: 'Tämä sovellus',
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
    snapshot: 'Pikakuvaus',
    experience: 'Kokemus',
    education: 'Koulutus',
    certificates: 'Sertifikaatit',
    educationLabel: 'Koulutus',
    certificate: 'Sertifikaatti',
    loading: 'Ladataan profiilia…',
    slowLoadingNotice:
      'Taustapalvelu toimii maksuttomalla tasolla ja on voinut siirtyä lepotilaan käyttämättömyyden vuoksi. Ensimmäinen pyyntö sen jälkeen voi kestää hetken.'
  },
  feedback: {
    eyebrow: 'Jätä viesti',
    title: 'Mitä pidit?',
    intro:
      'Lyhyt viesti on tervetullut. Palaute tarkistetaan ennen kuin sitä voidaan julkaista.',
    messageLabel: 'Viesti',
    messagePlaceholder: 'Mitä mielessä?',
    nameLabel: 'Nimi tai nimimerkki (valinnainen)',
    namePlaceholder: 'Millä nimellä allekirjoitan viestin?',
    consent: 'Palautteeni voidaan julkaista sivustolla.',
    submit: 'Lähetä palaute',
    success: 'Kiitos. Viestisi odottaa tarkistusta.',
    error: 'Viestin lähettäminen epäonnistui. Yritä uudelleen.',
    scrollerAria: 'Julkaistu palaute',
    scrollerEyebrow: 'Vierailijoiden viestejä',
    scrollerTitle: 'Muutama sana matkan varrelta',
    previous: 'Edellinen palaute',
    next: 'Seuraava palaute',
    anonymous: 'Nimetön',
    loading: 'Ladataan palautteita...',
    empty: 'Ei vielä palautteita :('
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
    empty: 'Valikoituja projekteja lisätään tänne myöhemmin.',
    openProject: 'Avaa projekti'
  },
  architecture: {
    eyebrow: 'Oma projekti',
    title: 'Tämä sovellus',
    intro:
      'Tämä on oma portfoliosivustoni, ja mukana on myös minigolfrata. Molemmat pyörivät kotona Raspberry Pi 400:lla. Profiilitiedot tallennan MongoDB Atlasiin.',
    frontend: 'Frontend',
    frontendText:
      'Tein sivut Vue 3:lla. Nginx tarjoilee ne selaimelle ja välittää API-pyynnöt backendille.',
    api: 'Backend',
    apiText:
      'Kirjoitin backendin Node.js:llä ja Expressillä. Se hakee profiilitiedot Atlaksesta ja tallentaa vierailijoiden palautteet.',
    database: 'MongoDB Atlas',
    databaseText:
      'Käytän MongoDB Atlasia, koska tietokanta ei pyöri Piillä. Backend hakee profiilin sieltä.',
    flowAria: 'Selain, Raspberry Pi ja MongoDB Atlas',
    clientNode: 'Selain',
    hostNode: 'Raspberry Pi 400',
    dataNode: 'MongoDB Atlas',
    clientDetail: 'Selaimesi',
    hostDetail: 'Frontend + API',
    dataDetail: 'Profiilitiedot',
    stackEyebrow: 'Tekniikka',
    stackTitle: 'Työkalut',
    stackIntro:
      'Näillä työkaluilla rakensin ja ajan sivustoa.',
    frontendStack: 'Frontend',
    frontendStackText:
      'Tein käyttöliittymän Vue 3:lla ja TypeScriptillä. Vite kokoaa sivut, ja Nginx tarjoilee ne Piiltä.',
    backendStack: 'Backend ja API',
    backendStackText:
      'Backend on Node.js:llä ja Expressillä tehty API. Se hakee profiilitiedot Atlasista ja tallentaa sivustolle jätetyt palautteet.',
    qualityStack: 'Testaus ja julkaisu',
    qualityStackText:
      'Kun pushaan koodia GitHubiin, Actions testaa sen ja rakentaa Piille sopivat konttikuvat. Flux päivittää uudet kuvat klusteriin.',
    hostingEyebrow: 'Hostaus',
    hostingTitle: 'Näin julkaisen muutokset',
    hostingIntro:
      'Koodi on GitHubissa, mutta sivusto pyörii kotona. Kun pushaan muutoksen, GitHub Actions ja Flux hoitavat julkaisun Piille.',
    piHostingTitle: 'Raspberry Pi 400',
    piHostingText:
      'Piissä on 4 Gt muistia, ja sillä pyörii koko klusteri. Frontend ja backend ovat omissa konteissaan. Jos Pi sammuu, myös sivusto menee pois päältä.',
    k3sHostingTitle: 'K3s ja Helm',
    k3sHostingText:
      'Asensin Piille K3s:n pitämään sovelluksen kontit käynnissä. Helmillä määrittelin, miten frontend ja backend asennetaan ja paljonko resursseja ne saavat.',
    gitOpsTitle: 'Flux CD ja GitOps',
    gitOpsText:
      'Flux seuraa tätä GitHub-repositoriota. Kun GHCR:ään tulee uudet kuvat, Flux päivittää niiden versiot ja käynnistää ne klusterissa.',
    releaseTitle: 'Automaattiset julkaisut',
    releaseText:
      'GitHub Actions testaa muutokset ja tarkistaa myös Helm-kaavion. Jos kaikki menee läpi, se rakentaa ARM64-kuvat ja julkaisee ne GHCR:ään.',
    lanTitle: 'Miten sivulle pääsee?',
    lanText:
      'Selain pyytää datan samasta osoitteesta kuin sivunkin. Nginx välittää /api-pyynnöt backendille Piin sisällä, joten backendille ei tarvita omaa julkista osoitetta.',
    secretsTitle: 'Tunnukset',
    secretsText:
      'Pidän tunnukset poissa GitHubista ja annan ne sovelluksille Kubernetes Secretien kautta.',
    tunnelTitle: 'Cloudflare Tunnel',
    tunnelText:
      'cloudflared yhdistää Piiltä Cloudflareen. Cloudflare ohjaa sivustolle tulevan liikenteen frontendille, joten reitittimeen ei tarvitse tehdä porttiohjauksia. Backend pysyy Piin klusterin sisällä.'
  },
  playground: {
    eyebrow: 'Minigolf',
    title: 'Rauhallinen minigolfrata',
    intro:
      'Vedä palloa taaksepäin, päästä irti ja yritä löytää reikä mahdollisimman vähillä lyönneillä.',
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
