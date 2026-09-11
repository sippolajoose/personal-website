import type { ProfileDocument } from '../types/profile';

export const defaultProfile: ProfileDocument = {
  _id: 'main',
  name: 'Your Name',
  headline: 'Full-stack developer',
  summary: 'I build clear, maintainable web products with Vue, Node.js, and data-driven backends.',
  location: 'Finland',
  email: 'hello@example.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/your-name' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/your-name' }
  ],
  skills: ['Vue', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
  experience: [
    {
      company: 'Example Company',
      role: 'Software Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      summary: 'Built customer-facing web features and backend APIs.',
      highlights: ['Improved core workflows', 'Built reusable components'],
      technologies: ['Vue', 'Node.js', 'MongoDB']
    }
  ],
  education: [
    {
      institution: 'Example University',
      degree: 'BSc in Computer Science',
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
