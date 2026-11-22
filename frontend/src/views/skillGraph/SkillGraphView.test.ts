import { createPinia } from 'pinia';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getProfile } from '../../services/api';
import type { ProfileDocument } from '../../types';
import SkillGraphView from '../SkillGraphView.vue';

const cytoscapeHarness = vi.hoisted(() => ({
  instance: null as unknown,
  create: vi.fn()
}));

vi.mock('cytoscape', () => ({
  default: vi.fn((options: unknown) => {
    cytoscapeHarness.create(options);
    return cytoscapeHarness.instance;
  })
}));

vi.mock('../../services/api', () => ({
  getProfile: vi.fn()
}));

const mockGetProfile = vi.mocked(getProfile);

const messages = {
  en: {
    skillGraph: {
      eyebrow: 'Skills',
      title: 'Skill graph',
      intro: 'Explore how skills connect to projects and experience.',
      loading: 'Loading skills…',
      loadError: 'The skill graph could not be loaded.',
      empty: 'There is no skill data to display yet.',
      searchLabel: 'Search graph',
      searchPlaceholder: 'Search skills and work',
      filterLegend: 'Show node types',
      filterSkills: 'Skills',
      filterProjects: 'Projects',
      filterExperience: 'Experience',
      clearFilters: 'Reset filters',
      resultCount: '{shown} of {total}',
      noResults: 'No matching nodes.',
      graphAria: 'Interactive portfolio skill graph',
      edgeLegend: 'Connections',
      technologyEdge: 'Technology',
      viewControls: 'Graph controls',
      zoomOut: 'Zoom out',
      zoomIn: 'Zoom in',
      fitGraph: 'Fit graph',
      selectedNodeHeading: 'Selected item',
      nodeListHeading: 'Graph items',
      selectNodeHint: 'Select a graph node to see its details.',
      relatedItems: 'Related items',
      noRelatedItems: 'No related items.',
      skill: 'Skill',
      project: 'Project',
      experience: 'Experience',
      technologies: 'Technologies',
      noTechnologies: 'No technologies listed.'
    }
  }
};

const emptyProfile: ProfileDocument = {
  _id: 'main',
  name: 'Example',
  headline: 'Developer',
  summary: 'A portfolio.',
  location: 'Helsinki',
  email: 'person@example.com',
  links: [],
  socialLinks: [],
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  projects: []
};

const connectedProfile: ProfileDocument = {
  ...emptyProfile,
  skills: ['Vue', 'TypeScript'],
  projects: [
    {
      name: 'Portfolio',
      summary: 'A personal website',
      technologies: ['Vue']
    }
  ],
  experience: [
    {
      company: 'Example Co.',
      role: 'Developer',
      startDate: '2022',
      summary: 'Builds web applications',
      technologies: ['TypeScript']
    }
  ]
};

type GraphElementDefinition = {
  group: 'nodes' | 'edges';
  data: {
    id: string;
    label?: string;
    type?: string;
    source?: string;
    target?: string;
  };
};

type TapEvent = { target: { id?: () => string } };
type TapHandler = (event: TapEvent) => void;

interface FakeGraphNode {
  id: () => string;
  style: ReturnType<typeof vi.fn>;
  addClass: ReturnType<typeof vi.fn>;
  removeClass: ReturnType<typeof vi.fn>;
}

interface FakeGraphEdge {
  style: ReturnType<typeof vi.fn>;
  source: () => FakeGraphNode;
  target: () => FakeGraphNode;
}

function createGraphHarness() {
  const nodeElements: FakeGraphNode[] = [];
  const edgeElements: FakeGraphEdge[] = [];
  const nodeById = new Map<string, FakeGraphNode>();
  const handlers = new Map<string, TapHandler>();
  const collection = <T>(items: T[]) => ({
    forEach(callback: (item: T) => void) {
      items.forEach(callback);
    }
  });

  let zoomLevel = 1;
  const instance = {
    on: vi.fn(
      (
        event: string,
        selectorOrHandler: string | TapHandler,
        maybeHandler?: TapHandler
      ) => {
        const key =
          typeof selectorOrHandler === 'string'
            ? `${event}:${selectorOrHandler}`
            : event;
        const handler =
          typeof selectorOrHandler === 'string'
            ? maybeHandler
            : selectorOrHandler;

        if (handler) {
          handlers.set(key, handler);
        }
      }
    ),
    nodes: vi.fn(() => collection(nodeElements)),
    edges: vi.fn(() => collection(edgeElements)),
    elements: vi.fn(() => ({
      remove: vi.fn(() => {
        nodeElements.splice(0);
        edgeElements.splice(0);
        nodeById.clear();
      })
    })),
    add: vi.fn((definitions: GraphElementDefinition[]) => {
      for (const definition of definitions) {
        if (definition.group === 'nodes') {
          const node: FakeGraphNode = {
            id: () => definition.data.id,
            style: vi.fn(),
            addClass: vi.fn(),
            removeClass: vi.fn()
          };
          nodeElements.push(node);
          nodeById.set(definition.data.id, node);
        }
      }

      for (const definition of definitions) {
        if (
          definition.group === 'edges' &&
          definition.data.source &&
          definition.data.target
        ) {
          const source = nodeById.get(definition.data.source);
          const target = nodeById.get(definition.data.target);

          if (source && target) {
            edgeElements.push({
              style: vi.fn(),
              source: () => source,
              target: () => target
            });
          }
        }
      }
    }),
    layout: vi.fn(() => ({ run: vi.fn() })),
    zoom: vi.fn((level?: number) => {
      if (level !== undefined) {
        zoomLevel = level;
      }

      return zoomLevel;
    }),
    fit: vi.fn(),
    getElementById: vi.fn(
      (id: string) =>
        nodeById.get(id) ?? {
          id: () => id,
          style: vi.fn(),
          addClass: vi.fn(),
          removeClass: vi.fn()
        }
    ),
    resize: vi.fn(),
    destroy: vi.fn()
  };

  cytoscapeHarness.instance = instance;

  return { instance, handlers };
}

function mountView() {
  return mount(SkillGraphView, {
    global: {
      plugins: [
        createPinia(),
        createI18n({ legacy: false, locale: 'en', messages })
      ]
    }
  });
}

let wrapper: VueWrapper | undefined;
let graphHarness: ReturnType<typeof createGraphHarness>;

describe('SkillGraphView', () => {
  beforeEach(() => {
    mockGetProfile.mockReset();
    cytoscapeHarness.create.mockClear();
    graphHarness = createGraphHarness();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('shows loading until an empty profile resolves, then shows the empty state', async () => {
    let resolveProfile: (profile: ProfileDocument) => void = () => {};
    mockGetProfile.mockReturnValue(
      new Promise((resolve) => {
        resolveProfile = resolve;
      })
    );
    wrapper = mountView();

    expect(wrapper.text()).toContain('Loading skills…');

    resolveProfile(emptyProfile);
    await flushPromises();

    expect(wrapper.text()).toContain('There is no skill data to display yet.');
    expect(cytoscapeHarness.create).not.toHaveBeenCalled();
  });

  it('shows a translated error state when profile loading fails', async () => {
    mockGetProfile.mockRejectedValue(new Error('Internal service detail'));
    wrapper = mountView();
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe(
      'The skill graph could not be loaded.'
    );
    expect(wrapper.text()).not.toContain('Internal service detail');
  });

  it('shows connected skills when searching for a project', async () => {
    mockGetProfile.mockResolvedValue({
      ...connectedProfile,
      projects: [
        {
          name: 'Mansenmolskis',
          summary: 'A project',
          technologies: ['Vue']
        }
      ]
    });
    wrapper = mountView();
    await flushPromises();

    await wrapper.get('input[type="search"]').setValue('Mansenmolskis');

    expect(wrapper.text()).toContain('2 of 4');
    const listedNodes = wrapper
      .findAll('.graph-node-button')
      .map((button) => button.text());
    expect(listedNodes).toHaveLength(2);
    expect(listedNodes[0]).toContain('Vue');
    expect(listedNodes[1]).toContain('Mansenmolskis');
  });

  it('selects nodes and applies search and type filters accessibly', async () => {
    mockGetProfile.mockResolvedValue(connectedProfile);
    wrapper = mountView();
    await flushPromises();

    expect(wrapper.text()).toContain('4 of 4');
    const graphOptions = cytoscapeHarness.create.mock.calls[0]?.[0];
    expect(graphOptions).toMatchObject({
      userZoomingEnabled: true,
      userPanningEnabled: true
    });
    expect(graphOptions).not.toHaveProperty('wheelSensitivity');
    expect(graphOptions).toMatchObject({
      layout: expect.objectContaining({
        name: 'preset',
        positions: {
          'skill:vue': { x: 0, y: -180 },
          'skill:typescript': { x: 0, y: 180 },
          'project:0': { x: -95, y: 0 },
          'experience:0': { x: 95, y: 0 }
        },
        fit: true,
        padding: 28
      })
    });

    const projectButton = wrapper
      .findAll('.graph-node-button')
      .find((button) => button.text().includes('Portfolio'));
    expect(projectButton).toBeDefined();
    await projectButton?.trigger('click');

    expect(wrapper.get('.selected-node-panel').text()).toContain('Portfolio');
    expect(projectButton?.attributes('aria-pressed')).toBe('true');

    graphHarness.handlers.get('tap:node')?.({
      target: { id: () => 'skill:vue' }
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.get('.selected-node-panel').text()).toContain('Vue');
    expect(wrapper.get('.selected-node-related').text()).toContain('Portfolio');

    const search = wrapper.get('input[type="search"]');
    await search.setValue('vue');
    expect(wrapper.text()).toContain('2 of 4');

    const projectFilter = wrapper.findAll('input[type="checkbox"]').at(1);
    await projectFilter?.setValue(false);
    expect(wrapper.text()).toContain('1 of 4');
    expect(wrapper.findAll('.graph-node-button')).toHaveLength(1);

    await wrapper.get('.graph-reset').trigger('click');
    expect(wrapper.text()).toContain('4 of 4');
    expect(wrapper.findAll('.graph-node-button')).toHaveLength(4);
  });

  it('provides button-based zoom and fit controls', async () => {
    mockGetProfile.mockResolvedValue(connectedProfile);
    wrapper = mountView();
    await flushPromises();

    await wrapper.get('button[aria-label="Zoom in"]').trigger('click');
    expect(graphHarness.instance.zoom).toHaveBeenLastCalledWith(1.25);

    await wrapper.get('button[aria-label="Zoom out"]').trigger('click');
    expect(graphHarness.instance.zoom).toHaveBeenLastCalledWith(1);

    await wrapper.get('button[aria-label="Fit graph"]').trigger('click');
    expect(graphHarness.instance.fit).toHaveBeenCalledWith(undefined, 28);
  });

  it('destroys the Cytoscape instance when unmounted', async () => {
    mockGetProfile.mockResolvedValue(connectedProfile);
    wrapper = mountView();
    await flushPromises();

    wrapper.unmount();
    wrapper = undefined;

    expect(graphHarness.instance.destroy).toHaveBeenCalledOnce();
    expect(graphHarness.instance.resize).not.toHaveBeenCalled();
  });
});
