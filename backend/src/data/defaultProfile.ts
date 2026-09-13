import type { ProfileDocument } from '../types/profile';

export const defaultProfile: ProfileDocument = {
  _id: 'main',
  name: 'Your Name',
  headline: 'Full-stack developer',
  summary: {
    fi: 'Rakennan selkeitä ja ylläpidettäviä verkkopalveluita Vuen, Node.js:n ja dataohjautuvien taustajärjestelmien avulla.',
    en: 'I build clear, maintainable web products with Vue, Node.js, and data-driven backends.'
  },
  location: 'Finland',
  email: 'hello@example.com',
  photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
  links: [
    { label: 'Website', url: 'https://example.com' },
    { label: 'GitHub', url: 'https://github.com/your-name' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/your-name' }
  ],
  socialLinks: [
    { platform: 'github', label: 'GitHub', url: 'https://github.com/your-name' },
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/your-name' }
  ],
  skills: ['Vue', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
  experience: [
    {
      company: 'Example Company',
      role: {
        fi: 'Ohjelmistoinsinööri',
        en: 'Software Engineer'
      },
      startDate: '2022-01',
      endDate: 'Present',
      summary: {
        fi: 'Rakensin asiakaslähtöisiä verkkopalveluita ja backend-rajapintoja.',
        en: 'Built customer-facing web features and backend APIs.'
      },
      highlights: [
        {
          fi: 'Paransin keskeisiä työprosesseja',
          en: 'Improved core workflows'
        },
        {
          fi: 'Rakensin uudelleenkäytettäviä komponentteja',
          en: 'Built reusable components'
        }
      ],
      technologies: ['Vue', 'Node.js', 'MongoDB']
    }
  ],
  education: [
    {
      institution: {
        fi: 'Jyväskylän yliopisto',
        en: 'University of Jyväskylä'
      },
      degree: {
        fi: 'Tietojenkäsittelytieteen kandidaatti',
        en: 'BSc in Computer Science'
      },
      startDate: '2018-09',
      endDate: '2021-05'
    }
  ],
  certificates: [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024-03'
    }
  ],
  projects: [
    {
      name: 'Personal website',
      summary: 'A portfolio site with CV export and structured profile content.',
      url: 'https://example.com',
      technologies: ['Vue', 'Express', 'MongoDB']
    }
  ]
};
