import { describe, expect, it } from 'vitest';
import type { ProfileDocument } from '../../types';
import { deriveSkillGraph } from './deriveSkillGraph';

function createProfile(
  overrides: Partial<ProfileDocument> = {}
): ProfileDocument {
  return {
    _id: 'main',
    name: 'Example',
    headline: 'Developer',
    summary: { en: 'Builds software.' },
    location: 'Helsinki',
    email: 'person@example.com',
    links: [],
    socialLinks: [],
    skills: [],
    experience: [],
    education: [],
    certificates: [],
    projects: [],
    ...overrides
  };
}

describe('deriveSkillGraph', () => {
  it('returns an empty graph when no profile is available', () => {
    expect(deriveSkillGraph(null, 'en')).toEqual({ nodes: [], edges: [] });
  });

  it('merges case-insensitive technologies and connects entries to skills', () => {
    const graph = deriveSkillGraph(
      createProfile({
        skills: ['Vue', ' vue ', 'TypeScript', '  '],
        projects: [
          {
            name: 'Portfolio',
            summary: 'A personal site',
            technologies: ['VUE', 'Node.js', ' node.js ']
          }
        ],
        experience: [
          {
            company: 'Example Co.',
            role: { en: 'Developer' },
            startDate: '2022',
            technologies: ['node.js', 'Vue']
          }
        ]
      }),
      'en'
    );

    expect(
      graph.nodes
        .filter((node) => node.kind === 'skill')
        .map((node) => node.label)
    ).toEqual(['Vue', 'TypeScript', 'Node.js']);
    expect(
      graph.edges.filter((edge) => edge.kind === 'technology')
    ).toHaveLength(4);
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    expect(
      graph.edges.every(
        (edge) =>
          nodesById.get(edge.source)?.kind === 'skill' ||
          nodesById.get(edge.target)?.kind === 'skill'
      )
    ).toBe(true);
  });

  it('keeps duplicate entry names distinct', () => {
    const graph = deriveSkillGraph(
      createProfile({
        projects: [
          { name: 'Demo', summary: 'First', technologies: ['Vue'] },
          { name: 'Demo', summary: 'Second', technologies: ['Vue'] }
        ],
        experience: [
          {
            company: 'Example Co.',
            role: 'Developer',
            startDate: '2022',
            technologies: ['Go']
          }
        ]
      }),
      'en'
    );

    expect(
      graph.nodes
        .filter((node) => node.kind === 'project')
        .map((node) => node.id)
    ).toEqual(['project:0', 'project:1']);
    expect(
      graph.edges.filter((edge) => edge.kind === 'technology')
    ).toHaveLength(3);
  });

  it('uses the requested locale for labels and searchable descriptions', () => {
    const graph = deriveSkillGraph(
      createProfile({
        projects: [
          {
            name: 'Portfolio',
            summary: { en: 'Personal website', fi: 'Henkilökohtainen sivusto' },
            technologies: []
          }
        ],
        experience: [
          {
            company: 'Example Co.',
            role: { en: 'Engineer', fi: 'Kehittäjä' },
            summary: { en: 'Builds apps', fi: 'Rakentaa sovelluksia' },
            startDate: '2022'
          }
        ]
      }),
      'fi'
    );

    expect(
      graph.nodes.find((node) => node.kind === 'experience')
    ).toMatchObject({
      label: 'Kehittäjä',
      searchText: expect.stringContaining('rakentaa sovelluksia')
    });
    expect(graph.nodes.find((node) => node.kind === 'project')).toMatchObject({
      description: 'Henkilökohtainen sivusto'
    });
  });
});
