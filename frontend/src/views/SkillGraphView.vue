<script setup lang="ts">
import cytoscape, { type Core, type StylesheetJson } from 'cytoscape';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '../stores/profile';
import {
  deriveSkillGraph,
  type SkillGraphNode,
  type SkillGraphNodeKind
} from './skillGraph/deriveSkillGraph';

const profileStore = useProfileStore();
const { locale, t } = useI18n();
const canvas = ref<HTMLDivElement | null>(null);
const graphInstance = shallowRef<Core | null>(null);
const themeObserver = shallowRef<MutationObserver | null>(null);
const initialLoad = ref(true);
const searchTerm = ref('');
const selectedNodeId = ref<string | null>(null);
const enabledKinds = reactive<Record<SkillGraphNodeKind, boolean>>({
  skill: true,
  project: true,
  experience: true
});
const minGraphZoom = 0.35;
const maxGraphZoom = 2.5;
const graphZoomStep = 1.25;

const currentLocale = computed(() => (locale.value === 'fi' ? 'fi' : 'en'));
const graph = computed(() =>
  deriveSkillGraph(profileStore.profile, currentLocale.value)
);
const normalizedSearch = computed(() => searchTerm.value.trim().toLowerCase());
const visibleNodes = computed(() => {
  const matchingNodes = graph.value.nodes.filter(
    (node) =>
      enabledKinds[node.kind] &&
      (!normalizedSearch.value ||
        node.searchText.includes(normalizedSearch.value))
  );

  if (!normalizedSearch.value) {
    return matchingNodes;
  }

  const matchingIds = new Set(matchingNodes.map((node) => node.id));
  const visibleIds = new Set(matchingIds);

  graph.value.edges.forEach((edge) => {
    if (matchingIds.has(edge.source)) {
      visibleIds.add(edge.target);
    }

    if (matchingIds.has(edge.target)) {
      visibleIds.add(edge.source);
    }
  });

  return graph.value.nodes.filter(
    (node) => enabledKinds[node.kind] && visibleIds.has(node.id)
  );
});
const visibleNodeIds = computed(
  () => new Set(visibleNodes.value.map((node) => node.id))
);
const selectedNode = computed(
  () =>
    graph.value.nodes.find((node) => node.id === selectedNodeId.value) ?? null
);
const relatedNodes = computed(() => {
  if (!selectedNode.value) {
    return [];
  }

  const relatedIds = new Set(
    graph.value.edges
      .filter(
        (edge) =>
          edge.source === selectedNode.value?.id ||
          edge.target === selectedNode.value?.id
      )
      .map((edge) =>
        edge.source === selectedNode.value?.id ? edge.target : edge.source
      )
  );

  return visibleNodes.value.filter((node) => relatedIds.has(node.id));
});
const isLoading = computed(() => initialLoad.value || profileStore.loading);
const isEmpty = computed(
  () => !isLoading.value && graph.value.nodes.length === 0
);

function nodeKindLabel(kind: SkillGraphNodeKind): string {
  return t(`skillGraph.${kind}`);
}

function selectNode(node: SkillGraphNode) {
  selectedNodeId.value = node.id;
}

function resetFilters() {
  searchTerm.value = '';
  enabledKinds.skill = true;
  enabledKinds.project = true;
  enabledKinds.experience = true;
}

function cytoscapeElements() {
  return [
    ...graph.value.nodes.map((node) => ({
      group: 'nodes' as const,
      data: { id: node.id, label: node.label, type: node.kind }
    })),
    ...graph.value.edges.map((edge) => ({
      group: 'edges' as const,
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.kind
      }
    }))
  ];
}

function graphLayoutOptions() {
  const skills = graph.value.nodes.filter((node) => node.kind === 'skill');
  const entries = graph.value.nodes.filter((node) => node.kind !== 'skill');
  const positions: Record<string, { x: number; y: number }> = {};

  function placeRow(nodes: SkillGraphNode[], y: number, gap: number) {
    nodes.forEach((node, index) => {
      positions[node.id] = {
        x: (index - (nodes.length - 1) / 2) * gap,
        y
      };
    });
  }

  const firstSkillRowEnd = Math.ceil(skills.length / 2);
  placeRow(skills.slice(0, firstSkillRowEnd), -180, 160);
  placeRow(entries, 0, 190);
  placeRow(skills.slice(firstSkillRowEnd), 180, 160);

  return {
    name: 'preset' as const,
    positions,
    fit: true,
    animate: false,
    padding: 28
  };
}

function themeToken(name: string, fallback: string): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim() || fallback
  );
}

function graphStyles(): StylesheetJson {
  const text = themeToken('text', '#172033');
  const muted = themeToken('muted', '#5d6677');
  const accent = themeToken('accent', '#1b6f5b');
  const accentStrong = themeToken('accent-strong', '#13493b');
  const surface = themeToken('surface-strong', '#ffffff');
  const inset = themeToken('surface-inset', '#f7f4ed');
  const border = themeToken('border', 'rgba(23, 32, 51, 0.18)');
  const fontFamily = getComputedStyle(document.documentElement).fontFamily;

  return [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        color: text,
        'font-family': fontFamily,
        'font-size': 12,
        'text-wrap': 'wrap',
        'text-max-width': '118px',
        'text-valign': 'center',
        'text-halign': 'center',
        'border-width': 1,
        'border-color': border,
        width: 'label',
        height: 'label',
        padding: '14px'
      }
    },
    {
      selector: 'node[type = "skill"]',
      style: {
        shape: 'ellipse',
        'background-color': accent,
        color: surface,
        'font-weight': 600
      }
    },
    {
      selector: 'node[type = "project"]',
      style: {
        shape: 'round-rectangle',
        'background-color': surface,
        color: text,
        'border-color': accentStrong,
        'border-width': 2
      }
    },
    {
      selector: 'node[type = "experience"]',
      style: {
        shape: 'rectangle',
        'background-color': inset,
        color: text,
        'border-color': muted
      }
    },
    {
      selector: 'node.is-selected',
      style: {
        'border-color': accent,
        'border-width': 4,
        'overlay-opacity': 0.12,
        'overlay-color': accent
      }
    },
    {
      selector: 'edge',
      style: {
        width: 1.5,
        'line-color': border,
        'curve-style': 'bezier',
        'target-arrow-shape': 'none'
      }
    },
    {
      selector: 'edge[type = "technology"]',
      style: {
        'line-color': accent,
        'target-arrow-color': accent,
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.8
      }
    }
  ];
}

function applyVisibility() {
  const instance = graphInstance.value;

  if (!instance) {
    return;
  }

  const ids = visibleNodeIds.value;
  instance.nodes().forEach((node) => {
    node.style('display', ids.has(node.id()) ? 'element' : 'none');
  });
  instance.edges().forEach((edge) => {
    const shouldShow =
      ids.has(edge.source().id()) && ids.has(edge.target().id());
    edge.style('display', shouldShow ? 'element' : 'none');
  });

  if (selectedNodeId.value && !ids.has(selectedNodeId.value)) {
    selectedNodeId.value = null;
  }
}

function applySelection() {
  const instance = graphInstance.value;

  if (!instance) {
    return;
  }

  instance.nodes().forEach((node) => {
    node.removeClass('is-selected');
  });

  if (selectedNodeId.value) {
    instance.getElementById(selectedNodeId.value).addClass('is-selected');
  }
}

function renderGraph() {
  const instance = graphInstance.value;

  if (!instance) {
    return;
  }

  instance.elements().remove();
  instance.add(cytoscapeElements());
  instance.layout(graphLayoutOptions()).run();
  applyVisibility();
  applySelection();
}

function handleResize() {
  graphInstance.value?.resize();
}

function adjustGraphZoom(direction: 1 | -1) {
  const instance = graphInstance.value;

  if (!instance) {
    return;
  }

  const factor = direction > 0 ? graphZoomStep : 1 / graphZoomStep;
  const zoom = Math.min(
    maxGraphZoom,
    Math.max(minGraphZoom, instance.zoom() * factor)
  );
  instance.zoom(zoom);
}

function fitGraph() {
  graphInstance.value?.fit(undefined, 28);
}

function initializeGraph() {
  if (!canvas.value || graph.value.nodes.length === 0) {
    return;
  }

  const instance = cytoscape({
    container: canvas.value,
    elements: cytoscapeElements(),
    style: graphStyles(),
    layout: graphLayoutOptions(),
    minZoom: minGraphZoom,
    maxZoom: maxGraphZoom,
    userZoomingEnabled: true,
    userPanningEnabled: true
  });

  graphInstance.value = instance;
  instance.on('tap', 'node', (event) => {
    selectedNodeId.value = event.target.id();
  });
  instance.on('tap', (event) => {
    if (event.target === instance) {
      selectedNodeId.value = null;
    }
  });
  applyVisibility();
  applySelection();
  window.addEventListener('resize', handleResize);
  themeObserver.value = new MutationObserver(() => {
    graphInstance.value?.style().fromJson(graphStyles()).update();
  });
  themeObserver.value.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

watch(graph, () => renderGraph(), { flush: 'post' });
watch(visibleNodes, () => applyVisibility(), { flush: 'post' });
watch(selectedNodeId, () => applySelection(), { flush: 'post' });

onMounted(async () => {
  await profileStore.loadProfile();
  initialLoad.value = false;
  await nextTick();
  initializeGraph();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  themeObserver.value?.disconnect();
  themeObserver.value = null;
  graphInstance.value?.destroy();
  graphInstance.value = null;
});
</script>

<template>
  <section class="skill-graph-view">
    <header class="page-intro skill-graph-intro">
      <p class="eyebrow">{{ t('skillGraph.eyebrow') }}</p>
      <h1>{{ t('skillGraph.title') }}</h1>
      <p class="lede">{{ t('skillGraph.intro') }}</p>
    </header>

    <p v-if="isLoading" class="graph-state" role="status">
      {{ t('skillGraph.loading') }}
    </p>
    <p
      v-else-if="profileStore.error"
      class="graph-state graph-state-error"
      role="alert"
    >
      {{ t('skillGraph.loadError') }}
    </p>
    <p v-else-if="isEmpty" class="graph-state">
      {{ t('skillGraph.empty') }}
    </p>
    <div v-else class="skill-graph-content">
      <section
        class="graph-controls"
        :aria-label="t('skillGraph.filterLegend')"
      >
        <div class="graph-search">
          <label for="skill-graph-search">{{
            t('skillGraph.searchLabel')
          }}</label>
          <input
            id="skill-graph-search"
            v-model="searchTerm"
            type="search"
            :placeholder="t('skillGraph.searchPlaceholder')"
          />
        </div>

        <fieldset class="graph-filters">
          <legend>{{ t('skillGraph.filterLegend') }}</legend>
          <label class="graph-filter">
            <input v-model="enabledKinds.skill" type="checkbox" />
            <span>{{ t('skillGraph.filterSkills') }}</span>
          </label>
          <label class="graph-filter">
            <input v-model="enabledKinds.project" type="checkbox" />
            <span>{{ t('skillGraph.filterProjects') }}</span>
          </label>
          <label class="graph-filter">
            <input v-model="enabledKinds.experience" type="checkbox" />
            <span>{{ t('skillGraph.filterExperience') }}</span>
          </label>
        </fieldset>

        <div class="graph-filter-actions">
          <p class="graph-result-count" aria-live="polite">
            {{
              t('skillGraph.resultCount', {
                shown: visibleNodes.length,
                total: graph.nodes.length
              })
            }}
          </p>
          <button class="graph-reset" type="button" @click="resetFilters">
            {{ t('skillGraph.clearFilters') }}
          </button>
        </div>
      </section>

      <p v-if="visibleNodes.length === 0" class="graph-state graph-no-results">
        {{ t('skillGraph.noResults') }}
      </p>

      <div
        class="graph-layout"
        :class="{ 'graph-layout-empty': visibleNodes.length === 0 }"
      >
        <section class="graph-panel graph-visual">
          <div
            class="graph-view-controls"
            role="group"
            :aria-label="t('skillGraph.viewControls')"
          >
            <button
              class="graph-zoom-button"
              type="button"
              :aria-label="t('skillGraph.zoomOut')"
              @click="adjustGraphZoom(-1)"
            >
              −
            </button>
            <button
              class="graph-zoom-button"
              type="button"
              :aria-label="t('skillGraph.zoomIn')"
              @click="adjustGraphZoom(1)"
            >
              +
            </button>
            <button
              class="graph-fit-button"
              type="button"
              :aria-label="t('skillGraph.fitGraph')"
              @click="fitGraph"
            >
              {{ t('skillGraph.fitGraph') }}
            </button>
          </div>
          <div
            ref="canvas"
            class="graph-canvas"
            role="img"
            :aria-label="t('skillGraph.graphAria')"
          ></div>
          <div class="graph-legend" :aria-label="t('skillGraph.edgeLegend')">
            <span class="graph-legend-item">
              <span
                class="graph-legend-line graph-legend-technology"
                aria-hidden="true"
              ></span>
              {{ t('skillGraph.technologyEdge') }}
            </span>
          </div>
        </section>

        <aside class="graph-aside">
          <section class="graph-panel selected-node-panel">
            <h2>{{ t('skillGraph.selectedNodeHeading') }}</h2>
            <template v-if="selectedNode">
              <p class="selected-node-kind">
                {{ nodeKindLabel(selectedNode.kind) }}
              </p>
              <h3>{{ selectedNode.label }}</h3>
              <p v-if="selectedNode.subtitle" class="selected-node-subtitle">
                {{ selectedNode.subtitle }}
              </p>
              <p
                v-if="selectedNode.description"
                class="selected-node-description"
              >
                {{ selectedNode.description }}
              </p>
              <div
                v-if="selectedNode.kind !== 'skill'"
                class="selected-node-technologies"
              >
                <h4>{{ t('skillGraph.technologies') }}</h4>
                <ul v-if="selectedNode.technologies.length">
                  <li
                    v-for="technology in selectedNode.technologies"
                    :key="technology"
                  >
                    {{ technology }}
                  </li>
                </ul>
                <p v-else class="selected-node-subtitle">
                  {{ t('skillGraph.noTechnologies') }}
                </p>
              </div>
              <div class="selected-node-related">
                <h4>{{ t('skillGraph.relatedItems') }}</h4>
                <ul v-if="relatedNodes.length">
                  <li v-for="node in relatedNodes" :key="node.id">
                    <button
                      type="button"
                      class="related-node-button"
                      @click="selectNode(node)"
                    >
                      <span>{{ node.label }}</span>
                      <small>{{ nodeKindLabel(node.kind) }}</small>
                    </button>
                  </li>
                </ul>
                <p v-else class="selected-node-subtitle">
                  {{ t('skillGraph.noRelatedItems') }}
                </p>
              </div>
            </template>
            <p v-else class="selected-node-hint">
              {{ t('skillGraph.selectNodeHint') }}
            </p>
          </section>

          <section class="graph-panel graph-node-list">
            <h2>{{ t('skillGraph.nodeListHeading') }}</h2>
            <ul v-if="visibleNodes.length">
              <li v-for="node in visibleNodes" :key="node.id">
                <button
                  type="button"
                  class="graph-node-button"
                  :class="{
                    'graph-node-button-selected': selectedNodeId === node.id
                  }"
                  :aria-pressed="selectedNodeId === node.id"
                  @click="selectNode(node)"
                >
                  <span>{{ node.label }}</span>
                  <small>{{ nodeKindLabel(node.kind) }}</small>
                </button>
              </li>
            </ul>
            <p v-else class="selected-node-hint">
              {{ t('skillGraph.noResults') }}
            </p>
          </section>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skill-graph-view {
  color: var(--text);
}

.skill-graph-intro {
  margin-bottom: 24px;
}

.skill-graph-content {
  display: grid;
  gap: 18px;
}

.graph-controls,
.graph-panel,
.graph-state {
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.graph-controls {
  display: grid;
  grid-template-columns: minmax(210px, 1fr) minmax(250px, 1.2fr) auto;
  align-items: end;
  gap: 18px;
  padding: 18px;
}

.graph-search {
  display: grid;
  gap: 8px;
}

.graph-search label,
.graph-filters legend {
  color: var(--text);
  font-size: 0.88rem;
  font-weight: 650;
}

.graph-search input[type='search'] {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  background: var(--surface-strong);
  font: inherit;
}

.graph-search input[type='search']:focus-visible,
.graph-filter input:focus-visible,
.graph-reset:focus-visible,
.graph-zoom-button:focus-visible,
.graph-fit-button:focus-visible,
.graph-node-button:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.graph-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.graph-filters legend {
  margin-bottom: 8px;
}

.graph-filter {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-size: 0.9rem;
  cursor: pointer;
}

.graph-filter input {
  accent-color: var(--accent);
}

.graph-filter-actions {
  display: grid;
  justify-items: end;
  gap: 8px;
}

.graph-result-count,
.selected-node-hint,
.selected-node-subtitle {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.graph-reset {
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface-strong);
  font: inherit;
  font-size: 0.86rem;
  cursor: pointer;
}

.graph-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(260px, 0.85fr);
  align-items: start;
  gap: 18px;
}

.graph-layout-empty {
  opacity: 0.74;
}

.graph-panel {
  padding: 18px;
}

.graph-visual {
  min-width: 0;
  overflow: hidden;
}

.graph-canvas {
  width: 100%;
  min-height: 480px;
  border-radius: 12px;
  background: var(--surface-inset);
}

.graph-view-controls {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 10px;
}

.graph-zoom-button,
.graph-fit-button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  background: var(--surface-strong);
  font: inherit;
  cursor: pointer;
}

.graph-zoom-button {
  font-size: 1.2rem;
}

.graph-fit-button {
  padding: 8px 12px;
}

.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  padding-top: 15px;
}

.graph-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.82rem;
}

.graph-legend-line {
  width: 25px;
  border-top: 2px solid var(--accent);
}

.graph-aside {
  display: grid;
  gap: 18px;
}

.graph-panel h2 {
  margin: 0 0 12px;
  font-size: 1rem;
}

.selected-node-kind {
  margin: 0 0 5px;
  color: var(--accent-strong);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.selected-node-panel h3 {
  margin: 0 0 7px;
  overflow-wrap: anywhere;
  font-size: 1.15rem;
}

.selected-node-description {
  margin: 12px 0;
  color: var(--muted);
  line-height: 1.55;
}

.selected-node-technologies {
  margin-top: 16px;
}

.selected-node-related {
  margin-top: 16px;
}

.selected-node-technologies h4 {
  margin: 0 0 8px;
  font-size: 0.88rem;
}

.selected-node-related h4 {
  margin: 0 0 8px;
  font-size: 0.88rem;
}

.selected-node-technologies ul,
.selected-node-related ul,
.graph-node-list ul {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.selected-node-technologies li {
  width: fit-content;
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--text);
  background: var(--surface-inset);
  font-size: 0.82rem;
}

.related-node-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border: 0;
  color: var(--text);
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.related-node-button:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.related-node-button:hover span {
  color: var(--accent-strong);
}

.related-node-button span {
  overflow-wrap: anywhere;
}

.related-node-button small {
  flex: 0 0 auto;
  color: var(--muted);
}

.graph-node-list ul {
  max-height: 310px;
  overflow: auto;
  padding-right: 4px;
}

.graph-node-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text);
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.graph-node-button:hover,
.graph-node-button-selected {
  border-color: var(--border);
  background: var(--surface-inset);
}

.graph-node-button span {
  overflow-wrap: anywhere;
}

.graph-node-button small {
  flex: 0 0 auto;
  color: var(--muted);
}

.graph-state {
  margin: 0;
  padding: 20px;
  color: var(--muted);
}

.graph-state-error {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}

.graph-no-results {
  padding: 12px 16px;
  box-shadow: none;
}

@media (max-width: 820px) {
  .graph-controls {
    grid-template-columns: 1fr 1fr;
  }

  .graph-filter-actions {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .graph-layout {
    grid-template-columns: 1fr;
  }

  .graph-aside {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .graph-controls,
  .graph-aside {
    grid-template-columns: 1fr;
  }

  .graph-filters {
    gap: 10px 14px;
  }

  .graph-filter {
    min-height: 44px;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .graph-filter input {
    width: 18px;
    height: 18px;
  }

  .graph-canvas {
    min-height: 370px;
  }

  .graph-panel,
  .graph-controls {
    padding: 14px;
  }

  .graph-filter-actions {
    grid-column: auto;
  }
}
</style>
