import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { i18n } from '../i18n';
import PlaygroundIndexView from './PlaygroundIndexView.vue';

let wrapper: VueWrapper | undefined;

function mountView() {
  wrapper = mount(PlaygroundIndexView, {
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  });

  return wrapper;
}

describe('PlaygroundIndexView', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en';
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('lists available experiments and links to their routes in both locales', async () => {
    const mountedView = mountView();
    const destinations = () =>
      mountedView
        .findAllComponents(RouterLinkStub)
        .map((link) => link.props('to'));

    expect(mountedView.text()).toContain('Playground');
    expect(mountedView.text()).toContain('Minigolf');
    expect(mountedView.text()).toContain('Skill graph');
    expect(destinations()).toEqual([
      { name: 'playground-minigolf' },
      { name: 'playground-skill-graph' }
    ]);

    i18n.global.locale.value = 'fi';
    await nextTick();

    expect(mountedView.text()).toContain('Omat kokeilut');
    expect(mountedView.text()).toContain('Minigolf');
    expect(mountedView.text()).toContain('Taitokartta');
  });
});
