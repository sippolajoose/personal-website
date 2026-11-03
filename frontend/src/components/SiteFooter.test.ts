import { defineComponent } from 'vue';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '../i18n';
import { getPublishedFeedback, sendFeedback } from '../services/api';
import SiteFooter from './SiteFooter.vue';

vi.mock('../services/api', () => ({
  getPublishedFeedback: vi.fn(),
  sendFeedback: vi.fn()
}));

const NButtonStub = defineComponent({
  name: 'NButton',
  props: {
    attrType: { type: String, default: 'button' },
    loading: { type: Boolean, default: false },
    type: { type: String, default: 'default' }
  },
  template: '<button :type="attrType" :disabled="loading"><slot /></button>'
});

const FeedbackScrollerStub = defineComponent({
  name: 'FeedbackScroller',
  props: {
    refreshKey: { type: Number, default: 0 }
  },
  template:
    '<div data-test="feedback-scroller" :data-refresh-key="refreshKey" />'
});

let wrapper: VueWrapper | undefined;

function mountFooter() {
  wrapper = mount(SiteFooter, {
    global: {
      plugins: [i18n],
      stubs: {
        NButton: NButtonStub,
        FeedbackScroller: FeedbackScrollerStub
      }
    }
  });

  return wrapper;
}

describe('SiteFooter', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en';
    vi.mocked(sendFeedback).mockReset();
    vi.mocked(sendFeedback).mockResolvedValue(undefined);
    vi.mocked(getPublishedFeedback).mockReset();
    vi.mocked(getPublishedFeedback).mockResolvedValue([]);
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('submits trimmed feedback, resets the form, and refreshes the scroller', async () => {
    const mountedFooter = mountFooter();
    await mountedFooter.get('#feedback-message').setValue('  A helpful note  ');
    await mountedFooter.get('#feedback-name').setValue(' Ada ');
    await mountedFooter.get('input[type="checkbox"]').setValue(true);

    await mountedFooter.get('form').trigger('submit');
    await flushPromises();

    expect(sendFeedback).toHaveBeenCalledWith({
      message: 'A helpful note',
      displayName: 'Ada',
      locale: 'en',
      publishConsent: true
    });
    expect(mountedFooter.get('[role="status"]').text()).toBe(
      i18n.global.t('feedback.success')
    );
    expect(
      mountedFooter.get<HTMLTextAreaElement>('#feedback-message').element.value
    ).toBe('');
    expect(
      mountedFooter.get<HTMLInputElement>('input[type="checkbox"]').element
        .checked
    ).toBe(false);
    expect(
      mountedFooter
        .get('[data-test="feedback-scroller"]')
        .attributes('data-refresh-key')
    ).toBe('1');
  });

  it('shows an error and keeps the message when submission fails', async () => {
    vi.mocked(sendFeedback).mockRejectedValueOnce(
      new Error('Service unavailable')
    );
    const mountedFooter = mountFooter();
    await mountedFooter.get('#feedback-message').setValue('Please review this');

    await mountedFooter.get('form').trigger('submit');
    await flushPromises();

    expect(mountedFooter.get('[role="alert"]').text()).toBe(
      i18n.global.t('feedback.error')
    );
    expect(
      mountedFooter.get<HTMLTextAreaElement>('#feedback-message').element.value
    ).toBe('Please review this');
  });

  it('does not send a blank message', async () => {
    const mountedFooter = mountFooter();
    await mountedFooter.get('#feedback-message').setValue('   ');

    await mountedFooter.get('form').trigger('submit');
    await flushPromises();

    expect(sendFeedback).not.toHaveBeenCalled();
    expect(mountedFooter.find('[role="status"]').exists()).toBe(false);
    expect(mountedFooter.find('[role="alert"]').exists()).toBe(false);
  });
});
