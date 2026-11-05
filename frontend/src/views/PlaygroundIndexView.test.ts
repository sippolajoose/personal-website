import {
  mount,
  RouterLinkStub,
  type VueWrapper
} from '@vue/test-utils';
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

  it('lists the mini golf experiment and links to its route in both locales', async () => {
    const mountedView = mountView();

    expect(mountedView.text()).toContain('Playground');
    expect(mountedView.text()).toContain('Minigolf');
    expect(mountedView.findComponent(RouterLinkStub).props('to')).toEqual({
      name: 'playground-minigolf'
    });

    i18n.global.locale.value = 'fi';
    await nextTick();

    expect(mountedView.text()).toContain('Omat kokeilut');
    expect(mountedView.text()).toContain('Minigolf');
  });
});
