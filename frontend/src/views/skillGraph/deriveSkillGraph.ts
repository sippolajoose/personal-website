import type { Locale } from '../../i18n';
import type {
  ExperienceEntry,
  ProfileDocument,
  ProjectEntry
} from '../../types';
import { getLocalizedText } from '../../utils/localizedText';

export type SkillGraphNodeKind = 'skill' | 'project' | 'experience';
export type SkillGraphEdgeKind = 'technology';

export interface SkillGraphNode {
  id: string;
  kind: SkillGraphNodeKind;
  label: string;
  subtitle: string;
  description: string;
  technologies: string[];
  searchText: string;
}

export interface SkillGraphEdge {
  id: string;
  source: string;
  target: string;
  kind: SkillGraphEdgeKind;
  technologies: string[];
}

export interface SkillGraph {
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
}

interface RelatedEntry {
  id: string;
  technologies: string[];
}

function normalizeTechnology(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function cleanTechnology(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function technologyValues(values: string[] | undefined): string[] {
  if (!values) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const technology = cleanTechnology(value);
    const key = normalizeTechnology(technology);

    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(technology);
    }
  }

  return result;
}

function createNode(node: Omit<SkillGraphNode, 'searchText'>): SkillGraphNode {
  return {
    ...node,
    searchText: [
      node.label,
      node.subtitle,
      node.description,
      ...node.technologies
    ]
      .join(' ')
      .toLowerCase()
  };
}

function createProjectNode(
  project: ProjectEntry,
  index: number,
  locale: Locale
): SkillGraphNode | null {
  const label = project.name.trim();

  if (!label) {
    return null;
  }

  return createNode({
    id: `project:${index}`,
    kind: 'project',
    label,
    subtitle: '',
    description: getLocalizedText(project.summary, locale),
    technologies: technologyValues(project.technologies)
  });
}

function createExperienceNode(
  experience: ExperienceEntry,
  index: number,
  locale: Locale
): SkillGraphNode | null {
  const company = experience.company.trim();
  const role = getLocalizedText(experience.role, locale).trim();
  const label = role || company;

  if (!label) {
    return null;
  }

  return createNode({
    id: `experience:${index}`,
    kind: 'experience',
    label,
    subtitle: company,
    description: getLocalizedText(experience.summary, locale),
    technologies: technologyValues(experience.technologies)
  });
}

function createTechnologyEdges(
  entry: RelatedEntry,
  technologies: string[],
  skillsByKey: Map<string, SkillGraphNode>
): SkillGraphEdge[] {
  return technologyValues(technologies).flatMap((technology) => {
    const skill = skillsByKey.get(normalizeTechnology(technology));

    return skill
      ? [
          {
            id: `technology:${encodeURIComponent(entry.id)}:${encodeURIComponent(skill.id)}`,
            source: entry.id,
            target: skill.id,
            kind: 'technology' as const,
            technologies: [skill.label]
          }
        ]
      : [];
  });
}

export function deriveSkillGraph(
  profile: ProfileDocument | null | undefined,
  locale: Locale
): SkillGraph {
  if (!profile) {
    return { nodes: [], edges: [] };
  }

  const nodes: SkillGraphNode[] = [];
  const skillsByKey = new Map<string, SkillGraphNode>();

  function addSkill(value: string) {
    const label = cleanTechnology(value);
    const key = normalizeTechnology(label);

    if (!key || skillsByKey.has(key)) {
      return;
    }

    const node = createNode({
      id: `skill:${encodeURIComponent(key)}`,
      kind: 'skill',
      label,
      subtitle: '',
      description: '',
      technologies: []
    });

    skillsByKey.set(key, node);
    nodes.push(node);
  }

  for (const skill of profile.skills ?? []) {
    addSkill(skill);
  }

  const projectNodes = (profile.projects ?? [])
    .map((project, index) => createProjectNode(project, index, locale))
    .filter((node): node is SkillGraphNode => node !== null);
  const experienceNodes = (profile.experience ?? [])
    .map((experience, index) => createExperienceNode(experience, index, locale))
    .filter((node): node is SkillGraphNode => node !== null);

  for (const project of profile.projects ?? []) {
    for (const technology of project.technologies ?? []) {
      addSkill(technology);
    }
  }

  for (const experience of profile.experience ?? []) {
    for (const technology of experience.technologies ?? []) {
      addSkill(technology);
    }
  }

  nodes.push(...projectNodes, ...experienceNodes);

  const projectEntries: RelatedEntry[] = projectNodes.map((node) => ({
    id: node.id,
    technologies: node.technologies
  }));
  const experienceEntries: RelatedEntry[] = experienceNodes.map((node) => ({
    id: node.id,
    technologies: node.technologies
  }));

  const edges = [
    ...projectEntries.flatMap((entry) =>
      createTechnologyEdges(entry, entry.technologies, skillsByKey)
    ),
    ...experienceEntries.flatMap((entry) =>
      createTechnologyEdges(entry, entry.technologies, skillsByKey)
    )
  ];

  return { nodes, edges };
}
