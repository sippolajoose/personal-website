import type { ProfileDocument } from './types/profile';

const profileExample: ProfileDocument = {
  _id: 'main',
  name: 'Your Name',
  headline: 'Full-stack developer',
  summary: {
    fi: 'Rakennan selkeitä ja ylläpidettäviä verkkopalveluita Vuen, Node.js:n ja dataohjautuvien taustajärjestelmien avulla.',
    en: 'I build clear, maintainable web products with Vue, Node.js, and data-driven backends.'
  },
  location: 'Finland',
  email: 'hello@example.com',
  photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
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
      institution: 'Example University',
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

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Personal Website API',
    version: '1.0.0',
    description: 'Public API for the personal website, profile content, and downloadable CV.'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Service health checks' },
    { name: 'Profile', description: 'Profile, experience, education, and certificates' },
    { name: 'Resume', description: 'Downloadable CV export' }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check service health',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' }
                  },
                  required: ['status']
                },
                example: { status: 'ok' }
              }
            }
          }
        }
      }
    },
    '/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Get the main profile document',
        operationId: 'getProfile',
        responses: {
          '200': {
            description: 'Profile data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProfileDocument' },
                example: profileExample
              }
            }
          },
          '500': {
            description: 'Profile data is missing or cannot be loaded'
          }
        }
      }
    },
    '/resume/pdf': {
      get: {
        tags: ['Resume'],
        summary: 'Download the resume as a PDF',
        operationId: 'downloadResumePdf',
        parameters: [
          {
            name: 'locale',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['fi', 'en'], default: 'en' },
            description: 'Language used for localized resume content'
          }
        ],
        responses: {
          '200': {
            description: 'PDF resume file',
            content: {
              'application/pdf': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ProfileLink: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          url: { type: 'string', format: 'uri' }
        },
        required: ['label', 'url']
      },
      SocialProfile: {
        type: 'object',
        properties: {
          platform: { type: 'string', enum: ['github', 'linkedin', 'website', 'x', 'other'] },
          label: { type: 'string' },
          url: { type: 'string', format: 'uri' }
        },
        required: ['platform', 'label', 'url']
      },
      LocalizedText: {
        type: 'object',
        properties: {
          fi: { type: 'string' },
          en: { type: 'string' }
        },
        required: ['fi', 'en']
      },
      ExperienceEntry: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          role: {
            oneOf: [
              { type: 'string' },
              { $ref: '#/components/schemas/LocalizedText' }
            ]
          },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          summary: {
            oneOf: [
              { type: 'string' },
              { $ref: '#/components/schemas/LocalizedText' }
            ]
          }
          },
          highlights: {
            type: 'array',
            items: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/LocalizedText' }
              ]
            }
          },
          technologies: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['company', 'role', 'startDate', 'summary', 'highlights', 'technologies']
      },
      EducationEntry: {
        type: 'object',
        properties: {
          institution: {
            oneOf: [
              { type: 'string' },
              { $ref: '#/components/schemas/LocalizedText' }
            ]
          },
          degree: {
            oneOf: [
              { type: 'string' },
              { $ref: '#/components/schemas/LocalizedText' }
            ]
          },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          summary: {
            oneOf: [
              { type: 'string' },
              { $ref: '#/components/schemas/LocalizedText' }
            ]
        },
        required: ['institution', 'degree', 'startDate']
      },
      CertificateEntry: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          issuer: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string', format: 'uri' }
        },
        required: ['name', 'issuer', 'date']
      },
      ProjectEntry: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          summary: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          technologies: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['name', 'summary', 'technologies']
      },
      ProfileDocument: {
        type: 'object',
        properties: {
          _id: { type: 'string', const: 'main' },
          name: { type: 'string' },
          headline: { type: 'string' },
          summary: {
            oneOf: [
              { type: 'string' },
              { $ref: '#/components/schemas/LocalizedText' }
            ]
          },
          location: { type: 'string' },
          email: { type: 'string', format: 'email' },
          photoUrl: { type: 'string', format: 'uri' },
          links: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProfileLink' }
          },
          socialLinks: {
            type: 'array',
            items: { $ref: '#/components/schemas/SocialProfile' }
          },
          skills: {
            type: 'array',
            items: { type: 'string' }
          },
          experience: {
            type: 'array',
            items: { $ref: '#/components/schemas/ExperienceEntry' }
          },
          education: {
            type: 'array',
            items: { $ref: '#/components/schemas/EducationEntry' }
          },
          certificates: {
            type: 'array',
            items: { $ref: '#/components/schemas/CertificateEntry' }
          },
          projects: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProjectEntry' }
          }
        },
        required: [
          '_id',
          'name',
          'headline',
          'summary',
          'location',
          'email',
          'links',
          'socialLinks',
          'skills',
          'experience',
          'education',
          'certificates',
          'projects'
        ]
      }
    }
  }
} as const;
