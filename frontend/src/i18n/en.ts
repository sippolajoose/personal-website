export default {
  app: {
    brand: 'Personal Website',
    navigation: {
      home: 'Home',
      cv: 'CV',
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
    eyebrow: 'Portfolio + CV',
    openCv: 'Open CV',
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
    browser: 'Browser',
    backend: 'Backend',
    persistence: 'Persistence'
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
