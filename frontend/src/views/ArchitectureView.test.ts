import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { i18n } from '../i18n';
import ArchitectureView from './ArchitectureView.vue';

let wrapper: VueWrapper | undefined;

function mountView() {
  wrapper = mount(ArchitectureView, {
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: true
      }
    }
  });

  return wrapper;
}

describe('ArchitectureView', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en';
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('explains the Raspberry Pi hosting and automatic release setup in both locales', async () => {
    const mountedView = mountView();
    const pageText = () => mountedView.text();

    expect(pageText()).toContain('This app');
    expect(pageText()).toContain('Raspberry Pi 400');
    expect(pageText()).toContain('K3s and Helm');
    expect(pageText()).toContain('MongoDB Atlas');
    expect(pageText()).toContain('Automatic releases');
    expect(pageText()).toContain('How do requests reach the app?');
    expect(pageText()).toContain('Cloudflare Tunnel');

    i18n.global.locale.value = 'fi';
    await nextTick();

    expect(pageText()).toContain('Tämä sovellus');
    expect(pageText()).toContain('Raspberry Pi 400');
    expect(pageText()).toContain('K3s ja Helm');
    expect(pageText()).toContain('MongoDB Atlas');
    expect(pageText()).toContain('Automaattiset julkaisut');
    expect(pageText()).toContain('Miten sivulle pääsee?');
    expect(pageText()).toContain('Cloudflare Tunnel');
  });
});
