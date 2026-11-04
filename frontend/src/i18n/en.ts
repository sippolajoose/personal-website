export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      label: 'Main navigation',
      home: 'Home',
      projects: 'Projects',
      thisApp: 'This app',
      playground: 'Minigolf'
    },
    theme: {
      light: 'Light mode',
      dark: 'Dark mode'
    },
    language: 'FI'
  },
  home: {
    eyebrow: 'CV',
    snapshot: 'Snapshot',
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certificates',
    educationLabel: 'Education',
    certificate: 'Certificate',
    loading: 'Loading profile…',
    slowLoadingNotice:
      'The backend is running on a free tier and may have gone to sleep due to inactivity. The first request after that can take a little longer.'
  },
  feedback: {
    eyebrow: 'Leave a note',
    title: 'What did you think?',
    intro:
      'A short message is welcome. Submissions are reviewed before anything can appear publicly.',
    messageLabel: 'Message',
    messagePlaceholder: "What's on your mind?",
    nameLabel: 'Name or nickname (optional)',
    namePlaceholder: 'How should I sign it?',
    consent: 'You may publish this message on the site.',
    submit: 'Send feedback',
    success: 'Thanks. Your message is waiting for review.',
    error: 'The message could not be sent. Please try again.',
    scrollerAria: 'Published feedback',
    scrollerEyebrow: 'Notes from visitors',
    scrollerTitle: 'A few words left behind',
    previous: 'Previous feedback',
    next: 'Next feedback',
    anonymous: 'Anonymous',
    loading: 'Loading feedback...',
    empty: 'No feedback yet :('
  },
  cv: {
    eyebrow: 'CV',
    title: 'Curriculum vitae',
    export: 'Export PDF',
    loading: 'Loading CV…',
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certificates',
    skills: 'Skills'
  },
  projects: {
    eyebrow: 'Selected work',
    title: 'Projects',
    intro: 'A selection of things built and the solutions behind them.',
    empty: 'Selected projects will appear here soon.',
    openProject: 'Open project'
  },
  architecture: {
    eyebrow: 'My project',
    title: 'This app',
    intro:
      'This is my portfolio site, and it has a mini-golf game too. Both run on my Raspberry Pi 400 at home. I keep the profile data in MongoDB Atlas.',
    frontend: 'Frontend',
    frontendText:
      'I built the site with Vue 3. Nginx serves it to the browser and forwards API requests to the backend.',
    api: 'Backend',
    apiText:
      'I wrote the backend in Node.js and Express. It gets profile data from Atlas and stores feedback people leave on the site.',
    database: 'MongoDB Atlas',
    databaseText:
      'I use MongoDB Atlas because I don’t run a database on the Pi. The backend gets the profile from there.',
    flowAria: 'The browser, Raspberry Pi, and MongoDB Atlas',
    clientNode: 'Browser',
    hostNode: 'Raspberry Pi 400',
    dataNode: 'MongoDB Atlas',
    clientDetail: 'Your browser',
    hostDetail: 'Frontend + API',
    dataDetail: 'Profile data',
    stackEyebrow: 'The tech',
    stackTitle: 'The tools I use',
    stackIntro:
      'These are the tools I used to build and run the site.',
    frontendStack: 'Frontend',
    frontendStackText:
      'I wrote the frontend in Vue 3 and TypeScript. Vite builds it, and Nginx serves it from the Pi.',
    backendStack: 'Backend and API',
    backendStackText:
      'The backend is an API I wrote with Node.js and Express. It gets profile data from Atlas and stores feedback left on the site.',
    qualityStack: 'Testing and releases',
    qualityStackText:
      'When I push code to GitHub, Actions tests it and builds container images for the Pi. Flux updates the cluster with the new images.',
    hostingEyebrow: 'Hosting',
    hostingTitle: 'How I publish changes',
    hostingIntro:
      'The code is on GitHub, but the site runs at home. When I push a change, GitHub Actions and Flux deploy it to the Pi.',
    piHostingTitle: 'Raspberry Pi 400',
    piHostingText:
      'The Pi has 4 GB of memory and runs the whole cluster. The frontend and backend have their own containers. If the Pi goes down, so does the site.',
    k3sHostingTitle: 'K3s and Helm',
    k3sHostingText:
      'I installed K3s to run the app containers. I use Helm to describe how to install the frontend and backend and how much of the Pi they can use.',
    gitOpsTitle: 'Flux CD and GitOps',
    gitOpsText:
      'Flux watches this GitHub repository. When new images land in GHCR, Flux updates their versions and starts them on the Pi.',
    releaseTitle: 'Automatic releases',
    releaseText:
      'GitHub Actions tests the changes and checks the Helm chart. If everything passes, it builds ARM64 images and publishes them to GHCR.',
    lanTitle: 'How do requests reach the app?',
    lanText:
      'The browser requests data from the same address it uses for the site. Nginx forwards /api requests to the backend inside the Pi, so the backend does not need a public address of its own.',
    secretsTitle: 'Secrets',
    secretsText:
      'I keep credentials out of GitHub and pass them to the app as Kubernetes Secrets.',
    tunnelTitle: 'Cloudflare Tunnel',
    tunnelText:
      'cloudflared connects from the Pi to Cloudflare. Cloudflare sends visitors to the frontend, so I don’t need to open ports on the router. The backend stays inside the Pi’s cluster.'
  },
  playground: {
    eyebrow: 'Minigolf',
    title: 'A quiet round of mini golf',
    intro:
      'Drag the ball backwards, release, and find the hole in as few strokes as possible.',
    courseLabel: 'Minimal course',
    randomCourse: 'Random course',
    hole: 'Hole',
    strokes: 'Strokes',
    reset: 'Reset course',
    regenerate: 'Regenerate course',
    courseAria: 'A minimalist mini golf course',
    ballAria: 'Golf ball. Drag to aim and release to shoot.',
    controls: 'Controls',
    help: 'Pull back from the ball to aim. Boosters speed up a shot, and ramps send the ball over obstacles.',
    settings: 'Course settings',
    obstacleCount: 'Obstacles',
    bonusCount: 'Boosters and ramps',
    currentScore: 'This course',
    totalScore: 'Total',
    holeComplete: 'Course complete. Nice shot.',
    nextHole: 'Next hole',
    playAgain: 'Play again'
  },
  errors: {
    profile: 'Failed to load profile.'
  }
} as const;
