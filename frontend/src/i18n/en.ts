export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      home: 'Home',
      projects: 'Projects',
      architecture: 'Architecture',
      apiGuide: 'API Guide'
    },
    theme: {
      light: 'Light mode',
      dark: 'Dark mode'
    },
    language: 'FI'
  },
  home: {
    eyebrow: 'CV',
    exportCv: 'Export CV as PDF',
    contact: 'Contact',
    snapshot: 'Snapshot',
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certificates',
    educationLabel: 'Education',
    certificate: 'Certificate',
    loading: 'Loading profile…'
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
    empty: 'No projects have been added yet.',
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
  errors: {
    profile: 'Failed to load profile.'
  }
} as const;
