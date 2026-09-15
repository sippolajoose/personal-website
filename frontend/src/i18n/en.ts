export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      home: 'Home',
      projects: 'Projects',
      architecture: 'Architecture',
      apiGuide: 'API Guide',
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
    contact: 'Contact',
    snapshot: 'Snapshot',
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certificates',
    educationLabel: 'Education',
    certificate: 'Certificate',
    loading: 'Loading profile…',
    slowLoadingNotice: 'The backend is running on a free tier and may have gone to sleep due to inactivity. The first request after that can take a little longer.'
  },
  feedback: {
    eyebrow: 'Leave a note',
    title: 'What did you think?',
    intro: 'A short message is welcome. Submissions are reviewed before anything can appear publicly.',
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
    empty: 'I entered working life during my second year of university, so personal projects have taken a back seat. Let\'s see when something gets something interesting here.',
    disclaimer: 'I entered working life during my second year of university, so personal projects have taken a bit of a back seat. Here are a few highlights from projects I have worked on outside of work.',
    openProject: 'Open project'
  },
  architecture: {
    eyebrow: 'System',
    title: 'How this site works',
    intro: 'The browser displays the content, the backend provides the data, and MongoDB stores the profile.',
    frontend: 'Browser',
    frontendText: 'Vue renders the pages and changes views without a full page reload.',
    api: 'Backend',
    apiText: 'Express provides the profile data to the frontend.',
    database: 'MongoDB',
    databaseText: 'The profile is stored as one document.',
    flowAria: 'Application architecture',
    frontendNode: 'Vue frontend',
    apiNode: 'Express API',
    browser: 'Browser',
    backend: 'Backend',
    persistence: 'Persistence',
    stackEyebrow: 'Technology choices',
    stackTitle: 'The tools behind the site',
    stackIntro: 'The stack is intentionally small: each tool has a clear role in building, serving, storing, or validating the site.',
    apiDocs: 'Open interactive API documentation',
    frontendStack: 'Frontend',
    frontendStackText: 'Vue handles the interface, while Vite, routing, state, localization, and the component library keep the client-side application focused.',
    backendStack: 'Backend and API',
    backendStackText: 'The API is a small Express service with typed configuration, MongoDB persistence, validation, and server-side PDF generation.',
    qualityStack: 'Delivery and quality',
    qualityStackText: 'Docker Compose provides local infrastructure, and automated tests and formatting tools help keep changes predictable.'
  },
  apiGuide: {
    eyebrow: 'API Guide',
    title: 'Interactive OpenAPI docs',
    intro: 'Click through the endpoints, inspect request bodies, and try the API directly from this page.',
    raw: 'Open raw OpenAPI JSON',
    loading: 'Loading interactive docs…'
  },
  playground: {
    eyebrow: 'Minigolf',
    title: 'A quiet round of mini golf',
    intro: 'Drag the ball backwards, release, and find the hole in as few strokes as possible.',
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
