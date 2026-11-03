import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '../i18n';
import { getPublishedFeedback, sendFeedback } from '../services/api';
import FeedbackScroller from './FeedbackScroller.vue';
import type { FeedbackItem } from '../services/api';

vi.mock('../services/api', () => ({
  getPublishedFeedback: vi.fn(),
  sendFeedback: vi.fn()
}));

const firstFeedback: FeedbackItem = {
  message: 'The first message',
  displayName: 'Ada',
  locale: 'en',
  featured: false,
  createdAt: '2026-09-15T10:00:00.000Z'
};

const secondFeedback: FeedbackItem = {
  message: 'The second message',
  displayName: 'Lin',
  locale: 'en',
  featured: false,
  createdAt: '2026-09-16T10:00:00.000Z'
};

let wrapper: VueWrapper | undefined;

function mountScroller() {
  wrapper = mount(FeedbackScroller, {
    global: {
      plugins: [i18n]
    }
  });

  return wrapper;
}

describe('FeedbackScroller', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en';
    vi.mocked(getPublishedFeedback).mockReset();
    vi.mocked(sendFeedback).mockReset();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('loads published feedback and wraps through items with its controls', async () => {
    vi.mocked(getPublishedFeedback).mockResolvedValue([
      firstFeedback,
      secondFeedback
    ]);
    const mountedScroller = mountScroller();

    await flushPromises();
    expect(mountedScroller.text()).toContain(firstFeedback.message);

    await mountedScroller
      .get('button[aria-label="Next feedback"]')
      .trigger('click');
    expect(mountedScroller.text()).toContain(secondFeedback.message);

    await mountedScroller
      .get('button[aria-label="Next feedback"]')
      .trigger('click');
    expect(mountedScroller.text()).toContain(firstFeedback.message);

    await mountedScroller
      .get('button[aria-label="Previous feedback"]')
      .trigger('click');
    expect(mountedScroller.text()).toContain(secondFeedback.message);
  });

  it('shows the empty state when feedback cannot be loaded', async () => {
    vi.mocked(getPublishedFeedback).mockRejectedValue(
      new Error('Service unavailable')
    );
    const mountedScroller = mountScroller();

    await flushPromises();

    expect(mountedScroller.get('.feedback-empty').text()).toBe(
      i18n.global.t('feedback.empty')
    );
    expect(
      mountedScroller.find('button[aria-label="Next feedback"]').exists()
    ).toBe(false);
  });
});
